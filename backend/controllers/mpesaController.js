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
        
        const updatedTicket = await prisma.ticket.update({
          where: { id: existingTicket.id },
          data: {
            mpesaRefCode: realMpesaCode || `MPESA-${Date.now()}`,
            status: "CONFIRMED",
          },
        });

        
        const updatedBooking = await prisma.booking.update({
          where: { id: existingTicket.bookingId },
          data: { status: "PAID" },
        });

        
        
        
        
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
          
        }

        if (customerEmailAddr) {
          sendTicketEmail(customerEmailAddr, {
            booking: updatedBooking,
            ticket: updatedTicket,
          }).catch((err) => console.error("Email send error after Daraja callback:", err));
        }
      }
    } else {
      
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
    
    return res.status(200).json({ ResultCode: 0, ResultDesc: "Error handled" });
  }
};

export const checkPaymentStatus = async (req, res) => {
  try {
    const { checkoutRequestId } = req.params;
    if (!checkoutRequestId) {
      return res.status(400).json({ status: "error", message: "CheckoutRequestID is required." });
    }

    
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

    
    const queryResult = await queryStkPush(checkoutRequestId);
    console.log("Daraja STK Query result:", queryResult);

    if (queryResult?.ResultCode === "0") {
      
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
      
      return res.status(200).json({
        status: "failed",
        paid: false,
        message: queryResult.ResultDesc || "Payment was not completed.",
      });
    }

    
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
