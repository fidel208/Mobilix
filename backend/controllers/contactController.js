import { sendContactHelpEmail } from "../services/emailService.js";

export const handleContactMessage = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;

    const normalizedFirstName = String(firstName || "").trim();
    const normalizedLastName = String(lastName || "").trim();
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedPhone = String(phone || "").trim();
    const normalizedMessage = String(message || "").trim();

    if (!normalizedFirstName) {
      return res.status(400).json({
        status: "error",
        message: "First name is required.",
      });
    }

    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      return res.status(400).json({
        status: "error",
        message: "A valid email address is required.",
      });
    }

    if (!normalizedMessage) {
      return res.status(400).json({
        status: "error",
        message: "Message content is required.",
      });
    }

    await sendContactHelpEmail({
      firstName: normalizedFirstName,
      lastName: normalizedLastName,
      email: normalizedEmail,
      phone: normalizedPhone,
      message: normalizedMessage,
    });

    return res.status(200).json({
      status: "success",
      message: "Thank you for contacting us. Your message has been sent to our support team and we will respond shortly.",
    });
  } catch (error) {
    console.error("handleContactMessage error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to send contact inquiry. Please try again later.",
    });
  }
};
