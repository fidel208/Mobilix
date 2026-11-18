import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendTicketEmail = async (toEmail, details) => {
  try {
    const booking = details.booking || {};
    const ticket = details.ticket || {};
    const vehicle = details.vehicle || {};
    const route = details.route || {};

    const passengerName =
      ticket.passengerName ||
      `${booking.firstName || ""} ${booking.lastName || ""}`.trim() ||
      "Valued Customer";
    const ticketNumber = ticket.ticketNumber || booking.id || "N/A";
    const serviceTypeFormatted = String(booking.serviceType || "Transit")
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    const vehicleLabel =
      booking.carType ||
      (vehicle.name ? `${vehicle.name} (${vehicle.plate})` : "Assigned Vehicle");
    const routeLabel =
      ticket.route ||
      `${booking.startingPoint || "Origin"} to ${booking.destination || "Destination"}`;
    const travelDate = booking.travelDate || ticket.travelDate || "As scheduled";
    const seats = booking.seats || ticket.seats || 1;
    const amount = ticket.amount || (route.price ? route.price * seats : 500);
    const paymentType = booking.paymentType || "now";
    const paymentStatus =
      booking.status || (paymentType === "now" ? "PAID" : "CONFIRMED (PAY ON ARRIVAL)");
    const mpesaNumber = booking.mpesaNumber || "N/A";
    const mpesaRef = ticket.mpesaRefCode || "N/A";

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Mobilix Booking Confirmation</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 24px;">
          <div style="max-width: 600px; background: #ffffff; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08); border: 1px solid #e5e7eb;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1e293b, #0f172a); padding: 32px 24px; text-align: center; color: #ffffff;">
              <h1 style="margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 1px; color: #ffffff;">MOBILIX</h1>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Booking &amp; Ticket Confirmation</p>
            </div>

            <!-- Content Area -->
            <div style="padding: 28px 24px;">
              <p style="font-size: 16px; color: #1e293b; margin-top: 0;">Hello <strong>${passengerName}</strong>,</p>
              <p style="font-size: 15px; color: #475569; line-height: 1.5;">
                Thank you for choosing Mobilix. Your booking has been confirmed! Here are all the details of your reservation:
              </p>

              <!-- Ticket Badge Box -->
              <div style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 10px; padding: 20px; margin: 24px 0;">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 16px;">
                  <div>
                    <span style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600;">Ticket Number</span>
                    <div style="font-size: 20px; font-weight: 700; color: #2563eb; letter-spacing: 0.5px;">${ticketNumber}</div>
                  </div>
                  <div style="text-align: right;">
                    <span style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600;">Status</span>
                    <div style="display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; background: ${
                      paymentStatus.includes("PAID") ? "#dcfce7; color: #15803d" : "#fef9c3; color: #854d0e"
                    };">
                      ${paymentStatus}
                    </div>
                  </div>
                </div>

                <!-- Detail Rows -->
                <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #334155;">
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Service Type:</td>
                    <td style="padding: 6px 0; font-weight: 600; text-align: right;">${serviceTypeFormatted}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Assigned Vehicle:</td>
                    <td style="padding: 6px 0; font-weight: 600; text-align: right; color: #0f172a;">${vehicleLabel}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Route:</td>
                    <td style="padding: 6px 0; font-weight: 600; text-align: right; color: #0f172a;">${routeLabel}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Travel Date:</td>
                    <td style="padding: 6px 0; font-weight: 600; text-align: right;">${travelDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Seats Booked:</td>
                    <td style="padding: 6px 0; font-weight: 600; text-align: right;">${seats}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; font-weight: 500;">M-Pesa Contact:</td>
                    <td style="padding: 6px 0; font-weight: 600; text-align: right;">${mpesaNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Payment Reference:</td>
                    <td style="padding: 6px 0; font-weight: 600; text-align: right; font-family: monospace;">${mpesaRef}</td>
                  </tr>
                  <tr style="border-top: 1px solid #e2e8f0;">
                    <td style="padding: 12px 0 0 0; font-size: 16px; color: #0f172a; font-weight: 700;">Total Amount:</td>
                    <td style="padding: 12px 0 0 0; font-size: 18px; color: #2563eb; font-weight: 700; text-align: right;">KES ${Number(amount).toLocaleString()}</td>
                  </tr>
                </table>
              </div>

              <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px 16px; border-radius: 4px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 13px; color: #1e40af; line-height: 1.4;">
                  <strong>Important:</strong> Please arrive at your pickup station at least 15 minutes before departure and have your ticket number (<strong>${ticketNumber}</strong>) ready for validation.
                </p>
              </div>

              <p style="font-size: 14px; color: #64748b; margin-bottom: 0;">
                If you have any questions or need to make adjustments to your reservation, reply directly to this email or contact our 24/7 support.
              </p>
            </div>

            <!-- Footer -->
            <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 24px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                &copy; ${new Date().getFullYear()} Mobilix Transport Services. All rights reserved.<br>
                You are automatically registered in our community newsletter.
              </p>
            </div>

          </div>
        </body>
      </html>
    `;

    const data = await resend.emails.send({
      from: "Mobilix Bookings <onboarding@resend.dev>",
      to: [toEmail],
      subject: `Mobilix Ticket Confirmation - ${ticketNumber} (${routeLabel})`,
      html: emailHtml,
    });

    console.log("Resend email sent successfully:", data);
    return data;
  } catch (error) {
    console.error("Resend sendTicketEmail error:", error);
    
    return null;
  }
};
