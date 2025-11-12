// src/utils/mailer.js
export async function sendMail(to, subject, html) {
  console.log("📧 Sending mail to:", to);
  console.log("Subject:", subject);
  console.log("HTML:", html);
  // For now, we just log the email instead of sending it
  return true;
}
