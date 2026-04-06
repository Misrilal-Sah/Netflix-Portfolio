import twilio from "twilio";

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM; // e.g. whatsapp:+14155552671
const WHATSAPP_TO = process.env.WHATSAPP_TO || "+918237138622"; // Your WhatsApp number

export async function sendWhatsAppMessage(
  senderName: string,
  senderEmail: string,
  subject: string,
  message: string,
  profile: string
): Promise<{ success: boolean; messageSid?: string; error?: string }> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM) {
    console.log("[whatsapp] Twilio credentials not configured, skipping WhatsApp notification");
    return { success: true }; // Graceful skip if not configured
  }

  try {
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    const messageBody = `
🔔 *New Contact Form Submission*

👤 *Name:* ${senderName}
📧 *Email:* ${senderEmail}
🏷️ *Profile:* ${profile}
📝 *Subject:* ${subject || "(none)"}

💬 *Message:*
${message}
    `.trim();

    const result = await client.messages.create({
      from: TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${WHATSAPP_TO}`,
      body: messageBody,
    });

    console.log("[whatsapp] Message sent successfully:", result.sid);
    return { success: true, messageSid: result.sid };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("[whatsapp] Failed to send message:", errorMsg);
    return { success: false, error: errorMsg };
  }
}
