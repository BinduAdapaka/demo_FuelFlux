# # src/services/sms_service.py
# # Twilio SMS helper — used for Admin 2FA OTP delivery

# import os
# import structlog

# log = structlog.get_logger()


# def send_sms_otp(phone_number: str, otp_code: str) -> bool:
#     """
#     Sends OTP via Twilio SMS. Returns True if sent successfully,
#     False on failure (caller should fall back to console/dev mode).

#     phone_number must include country code, e.g. "+919876543210"
#     """
#     try:
#         from twilio.rest import Client

#         account_sid = os.getenv("TWILIO_ACCOUNT_SID")
#         auth_token  = os.getenv("TWILIO_AUTH_TOKEN")
#         from_number = os.getenv("TWILIO_PHONE_NUMBER")

#         if not all([account_sid, auth_token, from_number]):
#             log.warning("Twilio credentials missing in .env — falling back to console OTP.")
#             return False

#         client = Client(account_sid, auth_token)

#         message = client.messages.create(
#             body=f"Your FuelFlux Admin verification code is: {otp_code}. Valid for 10 minutes. Do not share this code.",
#             from_=from_number,
#             to=phone_number,
#         )

#         log.info("Twilio SMS sent", sid=message.sid, to=phone_number)
#         return True

#     except ImportError:
#         log.error("Twilio package not installed. Run: pip install twilio")
#         return False
#     except Exception as e:
#         log.error("Twilio SMS failed", error=str(e), phone=phone_number)
#         return False


# src/services/sms_service.py
# Twilio WhatsApp helper — used for Admin 2FA OTP delivery
# (No DLT required — WhatsApp Sandbox works instantly for dev/testing)
# src/services/sms_service.py
# SMS/Twilio OTP delivery is disabled in favor of Email 2FA delivery.

import os
import structlog

log = structlog.get_logger()


def send_sms_otp(phone_number: str, otp_code: str) -> bool:
    """
    SMS/Twilio delivery is disabled by configuration.
    2FA verification codes are exclusively delivered via secure Email.
    Returns False without making external network calls.
    """
    log.debug(
        "SMS/Twilio OTP requested but disabled — 2FA OTP is routed via Email",
        phone=phone_number,
    )
    return False