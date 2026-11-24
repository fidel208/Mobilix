import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import https from "node:https";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

const httpsAgent = new https.Agent({ family: 4, keepAlive: true });

const sendViaResendHttp = async ({ from, to, replyTo, subject, html }) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY is not defined in environment variables");
    return { data: null, error: { message: "Missing RESEND_API_KEY" } };
  }

  const payload = JSON.stringify({
    from,
    to: Array.isArray(to) ? to : [to],
    ...(replyTo ? { reply_to: replyTo } : {}),
    subject,
    html,
  });

  return new Promise((resolve) => {
    const req = https.request(
      "https://api.resend.com/emails",
      {
        method: "POST",
        agent: httpsAgent,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => {
          raw += chunk;
        });
        res.on("end", () => {
          try {
            const parsed = JSON.parse(raw);
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve({ data: parsed, error: null });
            } else {
              resolve({
                data: null,
                error: {
                  statusCode: res.statusCode,
                  message: parsed.message || raw,
                },
              });
            }
          } catch {
            resolve({
              data: null,
              error: { statusCode: res.statusCode, message: raw },
            });
          }
        });
      },
    );

    req.on("error", (err) => {
      resolve({ data: null, error: { message: err.message } });
    });

    req.write(payload);
    req.end();
  });
};

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
      (vehicle.name
        ? `${vehicle.name} (${vehicle.plate})`
        : "Assigned Vehicle");
    const routeLabel =
      ticket.route ||
      `${booking.startingPoint || "Origin"} to ${booking.destination || "Destination"}`;
    const travelDate =
      booking.travelDate || ticket.travelDate || "As scheduled";
    const seats = booking.seats || ticket.seats || 1;
    const amount = ticket.amount || (route.price ? route.price * seats : 500);
    const paymentType = booking.paymentType || "now";
    const paymentStatus =
      booking.status ||
      (paymentType === "now" ? "PAID" : "CONFIRMED (PAY ON ARRIVAL)");
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
            
            <div style="background: linear-gradient(135deg, #1e293b, #0f172a); padding: 32px 24px; text-align: center; color: #ffffff;">
              <h1 style="margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 1px; color: #ffffff;">MOBILIX</h1>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Booking &amp; Ticket Confirmation</p>
            </div>

            <div style="padding: 28px 24px;">
              <p style="font-size: 16px; color: #1e293b; margin-top: 0;">Hello <strong>${passengerName}</strong>,</p>
              <p style="font-size: 15px; color: #475569; line-height: 1.5;">
                Thank you for choosing Mobilix. Your booking has been confirmed! Here are all the details of your reservation:
              </p>

              <div style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 10px; padding: 20px; margin: 24px 0;">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 16px;">
                  <div>
                    <span style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600;">Ticket Number</span>
                    <div style="font-size: 20px; font-weight: 700; color: #2563eb; letter-spacing: 0.5px;">${ticketNumber}</div>
                  </div>
                  <div style="text-align: right;">
                    <span style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600;">Status</span>
                    <div style="display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; background: ${
                      paymentStatus.includes("PAID")
                        ? "#dcfce7; color: #15803d"
                        : "#fef9c3; color: #854d0e"
                    };">
                      ${paymentStatus}
                    </div>
                  </div>
                </div>

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

    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const verifiedAccountEmail = process.env.RESEND_TEST_EMAIL;

    const result = await sendViaResendHttp({
      from: fromEmail,
      to: [toEmail],
      subject: `Mobilix Ticket Confirmation - ${ticketNumber} (${routeLabel})`,
      html: emailHtml,
    });

    if (result.error) {
      console.warn(
        `Resend send warning for ${toEmail} (${result.error.statusCode}): ${result.error.message}`,
      );

      if (
        (result.error.statusCode === 403 ||
          result.error.message?.includes("testing emails")) &&
        toEmail !== verifiedAccountEmail
      ) {
        console.info(
          `Domain not yet verified. Forwarding test ticket copy to verified account email (${verifiedAccountEmail}) for inspection.`,
        );

        const banner = `
          <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 12px 16px; margin-bottom: 20px; border-radius: 8px; font-size: 13px; color: #92400e;">
            <strong>Test Mode Delivery:</strong> This ticket was generated for passenger <strong>${passengerName}</strong> (intended recipient: <strong>${toEmail}</strong>). Resend free tier forwarded it to your account email because a custom domain has not yet been verified.
          </div>
        `;

        const fallbackHtml = emailHtml.replace(
          '<div style="padding: 28px 24px;">',
          `<div style="padding: 28px 24px;">${banner}`,
        );

        const fallbackResult = await sendViaResendHttp({
          from: fromEmail,
          to: [verifiedAccountEmail],
          subject: `[TEST COPY - ${passengerName}] Mobilix Ticket Confirmation - ${ticketNumber}`,
          html: fallbackHtml,
        });

        if (!fallbackResult.error) {
          console.log(
            "Test ticket email successfully delivered to account owner:",
            fallbackResult.data?.id,
          );
          return fallbackResult;
        }
      }

      return result;
    }

    console.log("Resend email sent successfully:", result.data?.id);
    return result;
  } catch (error) {
    console.error("Resend sendTicketEmail error:", error);
    return null;
  }
};

export const sendContactHelpEmail = async ({
  firstName,
  lastName,
  email,
  phone,
  message,
}) => {
  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const adminEmail = process.env.SUPPORT_EMAIL;
    const verifiedAccountEmail = process.env.RESEND_TEST_EMAIL;
    const senderFullName =
      `${String(firstName || "").trim()} ${String(lastName || "").trim()}`.trim() ||
      "Customer";

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Customer Support Inquiry</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 24px;">
          <div style="max-width: 600px; background: #ffffff; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08); border: 1px solid #e5e7eb;">
            <div style="background: linear-gradient(135deg, #1e293b, #0f172a); padding: 28px 24px; text-align: center; color: #ffffff;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px; color: #ffffff;">MOBILIX SUPPORT</h1>
              <p style="margin: 6px 0 0 0; font-size: 13px; color: #94a3b8; text-transform: uppercase;">New Website Inquiry</p>
            </div>
            <div style="padding: 28px 24px;">
              <p style="font-size: 15px; color: #1e293b; margin-top: 0;">
                You have received a new customer inquiry from the Mobilix contact page:
              </p>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
                <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #334155;">
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; width: 35%;">Customer Name:</td>
                    <td style="padding: 6px 0; font-weight: 600;">${senderFullName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b;">Customer Email:</td>
                    <td style="padding: 6px 0; font-weight: 600;"><a href="mailto:${email}" style="color: #2563eb;">${email}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b;">Phone Number:</td>
                    <td style="padding: 6px 0; font-weight: 600;">${phone || "Not provided"}</td>
                  </tr>
                </table>
              </div>
              <div style="margin: 20px 0;">
                <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #475569; text-transform: uppercase;">Message Content</h4>
                <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.6; color: #1e293b; white-space: pre-wrap;">${message}</div>
              </div>
              <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 12px; color: #64748b;">
                You can reply directly to this email to contact <strong>${email}</strong>.
              </div>
            </div>
            <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px; text-align: center; font-size: 12px; color: #94a3b8;">
              Mobilix Transport Services Administrator Notification
            </div>
          </div>
        </body>
      </html>
    `;

    const primaryResult = await sendViaResendHttp({
      from: fromEmail,
      to: [adminEmail],
      replyTo: email,
      subject: `Support Request from ${senderFullName} - Mobilix Help`,
      html: emailHtml,
    });

    if (primaryResult.error) {
      console.warn(
        `Primary admin delivery to ${adminEmail} failed (${primaryResult.error.statusCode}): ${primaryResult.error.message}`,
      );

      if (adminEmail !== verifiedAccountEmail) {
        console.info(
          `Forwarding support inquiry to verified test account (${verifiedAccountEmail})`,
        );
        const fallbackResult = await sendViaResendHttp({
          from: fromEmail,
          to: [verifiedAccountEmail],
          replyTo: email,
          subject: `[FORWARDED TO ADMIN] Support Request from ${senderFullName} (${email})`,
          html: emailHtml,
        });

        if (!fallbackResult.error) {
          console.log(
            "Support inquiry delivered to verified admin:",
            fallbackResult.data?.id,
          );
          return fallbackResult;
        }
      }
      return primaryResult;
    }

    console.log(
      "Support inquiry sent successfully to admin:",
      primaryResult.data?.id,
    );
    return primaryResult;
  } catch (error) {
    console.error("Resend sendContactHelpEmail error:", error);
    return null;
  }
};
