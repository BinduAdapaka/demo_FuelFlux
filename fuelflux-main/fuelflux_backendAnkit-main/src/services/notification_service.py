"""
src/services/notification_service.py
Centralized notification service for email and WhatsApp notifications.
Used by invoice_scheduler.py for compliance reminders and billing alerts.
"""

import os
import smtplib
import structlog
from dotenv import load_dotenv
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional

load_dotenv(override=True)

log = structlog.get_logger()


def send_email_notification(
    to_email: str,
    subject: str,
    body: str,
    cc_email: Optional[str] = None,
    html_body: Optional[str] = None,
) -> bool:
    load_dotenv(override=True)
    """
    Send an email notification via SMTP.
    Falls back to console logging if SMTP credentials are missing.

    Required .env variables:
        SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM_EMAIL
    """
    try:
        smtp_host = (os.getenv("SMTP_HOST") or "").strip()
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        smtp_user = (os.getenv("SMTP_USER") or "").strip()
        # Google App Passwords often contain spaces, strip them out
        smtp_password = (os.getenv("SMTP_PASSWORD") or "").strip().replace(" ", "")
        from_email = (os.getenv("SMTP_FROM_EMAIL") or smtp_user or "").strip()
        from_name = (os.getenv("SMTP_FROM_NAME") or "FuelFlux Security").strip()

        if not all([smtp_host, smtp_user, smtp_password, from_email]):
            # Dev mode fallback
            log.warning(
                "SMTP credentials not fully configured in .env — email not sent via network (dev fallback)",
                to=to_email,
                subject=subject,
                hint="Set SMTP_USER and SMTP_PASSWORD in .env for live email delivery to inboxes",
            )
            print(f"\n[DEV EMAIL SIMULATION] >>> To: {to_email} | Subject: {subject}")
            print(f"Body snippet:\n{body[:300]}\n")
            return False

        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{from_name} <{from_email}>" if from_name else from_email
        msg["To"] = to_email
        if cc_email:
            msg["Cc"] = cc_email

        # Attach text/plain first, then text/html (RFC standard alternative)
        msg.attach(MIMEText(body, "plain", "utf-8"))
        if html_body:
            msg.attach(MIMEText(html_body, "html", "utf-8"))

        recipients = [to_email]
        if cc_email:
            recipients.append(cc_email)

        if smtp_port == 465:
            with smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=15) as server:
                server.login(smtp_user, smtp_password)
                server.sendmail(from_email, recipients, msg.as_string())
        else:
            with smtplib.SMTP(smtp_host, smtp_port, timeout=15) as server:
                server.starttls()
                server.login(smtp_user, smtp_password)
                server.sendmail(from_email, recipients, msg.as_string())

        log.info("Email sent successfully via SMTP", to=to_email, subject=subject)
        return True

    except Exception as e:
        log.error("Email notification failed", error=str(e), to=to_email, subject=subject)
        return False


def send_2fa_email(to_email: str, otp_code: str, account_email: Optional[str] = None) -> bool:
    """
    Sends a high-security Two-Factor Authentication (2FA) verification code email.
    Includes both plain text and a modern, responsive HTML email template.
    """
    display_account = account_email or to_email
    subject = "FuelFlux Security — Your 2-Factor Authentication Code"

    plain_text_body = (
        f"FuelFlux Security Verification\n\n"
        f"Your Two-Factor Authentication (2FA) code is:\n\n"
        f"       {otp_code}\n\n"
        f"This code will expire in 10 minutes.\n"
        f"Login Account: {display_account}\n\n"
        f"If you did not request this code, please secure your account immediately.\n"
        f"Do not share this code with anyone. FuelFlux support will never ask for your 2FA code.\n\n"
        f"— FuelFlux Security Operations"
    )

    html_body = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 520px; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
          <!-- Header Banner -->
          <tr>
            <td style="background: #0f172a; padding: 30px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">FuelFlux</h1>
              <p style="margin: 6px 0 0; color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Security Operations Center</p>
            </td>
          </tr>
          
          <!-- Content Body -->
          <tr>
            <td style="padding: 36px 40px 28px;">
              <h2 style="margin: 0 0 12px; font-size: 18px; font-weight: 700; color: #1e293b; text-align: center;">Two-Factor Authentication Code</h2>
              <p style="margin: 0 0 24px; font-size: 14px; line-height: 22px; color: #475569; text-align: center;">
                Use the verification code below to verify your identity and access your FuelFlux account:
              </p>
              
              <!-- OTP Box -->
              <table role="presentation" width="100%" style="margin: 10px 0 24px;">
                <tr>
                  <td align="center">
                    <div style="background-color: #fff7ed; border: 2px dashed #f97316; border-radius: 14px; padding: 18px 24px; text-align: center; display: inline-block;">
                      <span style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 800; color: #ea580c; letter-spacing: 8px; display: block; margin-left: 8px;">{otp_code}</span>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Meta info -->
              <table role="presentation" width="100%" style="background-color: #f1f5f9; border-radius: 10px; padding: 14px 18px; margin-bottom: 24px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 6px; font-size: 12px; color: #64748b;">
                      <strong style="color: #334155;">Account:</strong> {display_account}
                    </p>
                    <p style="margin: 0; font-size: 12px; color: #64748b;">
                      <strong style="color: #334155;">Validity:</strong> Expires in 10 minutes
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Security Warning -->
              <p style="margin: 0 0 14px; font-size: 12px; line-height: 18px; color: #64748b; text-align: center;">
                🔒 <strong>Security Warning:</strong> Never share this code with anyone. FuelFlux support staff will never request your verification code.
              </p>
              <p style="margin: 0; font-size: 11px; line-height: 16px; color: #94a3b8; text-align: center;">
                If you did not initiate this login attempt, someone may have entered your credentials. Please secure your account immediately.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 40px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #94a3b8; font-weight: 500;">
                © 2026 FuelFlux Systems Inc. · Automated Security Transmission
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""

    return send_email_notification(
        to_email=to_email,
        subject=subject,
        body=plain_text_body,
        html_body=html_body,
    )



def send_whatsapp_notification(phone: str, message: str) -> bool:
    """
    Send a WhatsApp notification via Twilio.
    Falls back to console logging if Twilio credentials are missing.

    phone must include country code, e.g. "+919876543210"

    Required .env variables:
        TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER
    """
    try:
        from twilio.rest import Client

        account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        whatsapp_from = os.getenv("TWILIO_WHATSAPP_NUMBER", "+14155238886")  # Twilio Sandbox default

        if not all([account_sid, auth_token]):
            log.warning(
                "Twilio credentials missing — WhatsApp not sent (dev fallback)",
                phone=phone,
            )
            log.info("[DEV WHATSAPP]", to=phone, message=message[:200])
            return False

        client = Client(account_sid, auth_token)
        client.messages.create(
            body=message,
            from_=f"whatsapp:{whatsapp_from}",
            to=f"whatsapp:{phone}",
        )

        log.info("WhatsApp notification sent", to=phone)
        return True

    except ImportError:
        log.warning("Twilio not installed — WhatsApp notification skipped", phone=phone)
        return False
    except Exception as e:
        log.error("WhatsApp notification failed", error=str(e), phone=phone)
        return False
