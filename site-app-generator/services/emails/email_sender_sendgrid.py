import sendgrid
from sendgrid.helpers.mail import *


class EmailSenderSandgrid:
    """
    single function file to send an email using sendgrid smtp
    """

    # ---> CONSTS <--- #
    EMAIL_ACCOUNT = "teddy@dnc-algo.com"
    API_KEY = "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"
    CONTENT_TYPE = "text/plain"
    # ---> END - CONSTS <--- #

    def __init__(self):
        pass

    @staticmethod
    def send_email_via_sendgrid(to: str, subject: str, text: str) -> int:
        """ Send an email to someone with given title and text using the sendGrid API SMTP """
        try:
            sg = sendgrid.SendGridAPIClient(
                api_key=EmailSenderSandgrid.API_KEY
            )
            this_email = Mail(
                from_email=EmailSenderSandgrid.EMAIL_ACCOUNT,
                to_emails=to,
                subject=subject,
                html_content=text
            )
            response = sg.send(this_email)
            return response.status_code
        # we have some error
        except BrokenPipeError as error:
            raise error

    @staticmethod
    def send_email_via_sendgrid_list(to_list: list, subject: str, text: str):
        """ Send an email to list of people with given title and text using the sendGrid API SMTP """
        try:
            sg = sendgrid.SendGridAPIClient(
                api_key=EmailSenderSandgrid.API_KEY
            )
            # for each member send once
            return [sg.send(Mail(from_email=EmailSenderSandgrid.EMAIL_ACCOUNT,
                                 to_emails=to_email,
                                 subject=subject,
                                 html_content=text))
                    for to_email in to_list]
        # we have some error
        except BrokenPipeError as error:
            print(error)
            raise error
        except Exception as error:
            print(error)
            raise error
