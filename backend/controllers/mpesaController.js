import prisma from "../lib/prisma.js";
import { initiateStkPush, queryStkPush, formatMpesaPhoneNumber } from "../services/mpesaService.js";
import { sendTicketEmail } from "../services/emailService.js";

export const handleStkPush = async (req, res) => {
  try {
    const { phoneNumber, amount, bookingId, ticketNumber } = req.body;

    if (!phoneNumber || !amount) {
      return res.status(400).json({
        status: "error",
        message: "Phone number and amount are required.",
      });
    }

    const result = await initiateStkPush({
      phoneNumber,
      amount,
      accountReference: ticketNumber || "Mobilix",
      transactionDesc: "Ticket Booking",
    });

    if (!result.success) {
      return res.status(400).json({
        status: "error",
        message: result.message || "Failed to initiate M-Pesa STK Push.",
      });
    }

    // If bookingId is provided, link checkoutRequestId to ticket
    if (bookingId) {
      await prisma.ticket.updateMany({
        where: { bookingId },
        data: { mpesaRefCode: result.checkoutRequestId },
      });
    }

    return res.status(200).json({
      status: "success",
      message: result.customerMessage || "M-Pesa prompt sent. Please enter your PIN on your phone.",
      checkoutRequestId: result.checkoutRequestId,
    });
  } catch (error) {
    console.error("handleStkPush controller error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error while initiating M-Pesa payment.",
    });
  }
};

export const handleMpesaCallback = async (req, res) => {
  try {
    console.log("=== M-PESA DARAJA CALLBACK RECEIVED ===");
    console.log(JSON.stringify(req.body, null, 2));

    const callbackData = req.body?.Body?.stkCallback;
    if (!callbackData) {
      return res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted but empty" });
    }

    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata,
    } = callbackData;

    // Locate ticket matching checkoutRequestId in mpesaRefCode or booking.userId
    const existingTicket = await prisma.ticket.findFirst({
      where: {
        OR: [
          { mpesaRefCode: CheckoutRequestID },
          { booking: { userId: CheckoutRequestID } },
        ],
      },
      include: { booking: true },
    });

    if (ResultCode === 0) {
      // Payment Successful! Extract real MpesaReceiptNumber
      let realMpesaCode = "";
      let amountPaid = 0;
      let paidByPhone = "";

      if (CallbackMetadata?.Item) {
        for (const item of CallbackMetadata.Item) {
          if (item.Name === "MpesaReceiptNumber") realMpesaCode = String(item.Value);
          if (item.Name === "Amount") amountPaid = Number(item.Value);
          if (item.Name === "PhoneNumber") paidByPhone = String(item.Value);
        }
      }

      console.log(`Payment confirmed! Real M-Pesa Receipt: ${realMpesaCode}, Amount: ${amountPaid}`);

      if (existingTicket) {
        // Update Ticket with real M-Pesa ref code
        const updatedTicket = await prisma.ticket.update({
          where: { id: existingTicket.id },
          data: {
            mpesaRefCode: realMpesaCode || `MPESA-${Date.now()}`,
            status: "CONFIRMED",
          },
        });

        // Update Booking
        const updatedBooking = await prisma.booking.update({
          where: { id: existingTicket.bookingId },
          data: { status: "PAID" },
        });

        // Send confirmation email via Resend with REAL M-Pesa receipt
        // The community member table was populated with the customer email at booking time.
        // For STK Push bookings, booking.userId = checkoutRequestId (not email).
        // We look up the most recently added community member who matches the booking's passenger name.
        let customerEmailAddr = "";
        try {
          const firstName = existingTicket.passengerName?.split(" ")[0]?.toLowerCase() || "";
          if (firstName) {
            const matchedMember = await prisma.communityMember.findFirst({
              where: { email: { contains: firstName } },
              orderBy: { createdAt: "desc" },
            });
            customerEmailAddr = matchedMember?.email || "";
          }
        } catch {
          // non-critical — continue without email
        }

        if (customerEmailAddr) {
          sendTicketEmail(customerEmailAddr, {
            booking: updatedBooking,
            ticket: updatedTicket,
          }).catch((err) => console.error("Email send error after Daraja callback:", err));
        }
      }
    } else {
      // Payment failed or cancelled
      console.log(`Payment failed/cancelled: ${ResultDesc} (ResultCode: ${ResultCode})`);
      if (existingTicket) {
        await prisma.ticket.update({
          where: { id: existingTicket.id },
          data: { status: "PAYMENT_FAILED" },
        });
        await prisma.booking.update({
          where: { id: existingTicket.bookingId },
          data: { status: "CANCELLED" },
        });
      }
    }

    return res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (error) {
    console.error("M-Pesa callback processing error:", error);
    // Always return 200 to Safaricom so it doesn't repeatedly retry
    return res.status(200).json({ ResultCode: 0, ResultDesc: "Error handled" });
  }
};

export const checkPaymentStatus = async (req, res) => {
  try {
    const { checkoutRequestId } = req.params;
    if (!checkoutRequestId) {
      return res.status(400).json({ status: "error", message: "CheckoutRequestID is required." });
    }

    // 1. Check local DB first
    const ticket = await prisma.ticket.findFirst({
      where: {
        OR: [
          { mpesaRefCode: checkoutRequestId },
          { booking: { userId: checkoutRequestId } },
          { id: checkoutRequestId },
        ],
      },
      include: { booking: true },
    });

    if (ticket && (ticket.status === "CONFIRMED" || ticket.booking?.status === "PAID")) {
      return res.status(200).json({
        status: "success",
        paid: true,
        mpesaRefCode: ticket.mpesaRefCode,
        ticketNumber: ticket.ticketNumber,
        booking: ticket.booking,
      });
    }

    // 2. Query Safaricom Daraja STK query directly
    const queryResult = await queryStkPush(checkoutRequestId);
    console.log("Daraja STK Query result:", queryResult);

    if (queryResult?.ResultCode === "0") {
      // Safaricom confirms success! Update ticket if found
      if (ticket) {
        await prisma.ticket.update({
          where: { id: ticket.id },
          data: { status: "CONFIRMED" },
        });
        await prisma.booking.update({
          where: { id: ticket.bookingId },
          data: { status: "PAID" },
        });
      }

      return res.status(200).json({
        status: "success",
        paid: true,
        mpesaRefCode: ticket?.mpesaRefCode || "CONFIRMED",
        ticketNumber: ticket?.ticketNumber,
      });
    } else if (queryResult?.ResultCode) {
      // Completed with error (e.g. 1032 cancelled, 1037 timeout)
      return res.status(200).json({
        status: "failed",
        paid: false,
        message: queryResult.ResultDesc || "Payment was not completed.",
      });
    }

    // Still pending / user entering PIN
    return res.status(200).json({
      status: "pending",
      paid: false,
      message: "Waiting for M-Pesa payment confirmation. Please enter your PIN on your phone.",
    });
  } catch (error) {
    console.error("checkPaymentStatus error:", error);
    return res.status(500).json({ status: "error", message: "Failed to check payment status." });
  }
};
