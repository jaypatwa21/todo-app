from flask_mail import Message
from flask import current_app
import os

def send_todo_created_email(mail, user_email, user_name, todo_title):
    """Send email notification when a todo is created"""
    try:
        subject = "New Todo Created!"
        sender = os.getenv('MAIL_USERNAME')
        recipients = [user_email]
        
        body = f"""
        Hi {user_name},
        
        You have successfully created a new todo item:
        
        Title: {todo_title}
        
        Don't forget to complete it!
        
        Best regards,
        Todo App Team
        """
        
        html_body = f"""
        <html>
        <body>
            <h2>New Todo Created!</h2>
            <p>Hi <strong>{user_name}</strong>,</p>
            <p>You have successfully created a new todo item:</p>
            <div style="background-color: #f0f0f0; padding: 10px; border-radius: 5px; margin: 10px 0;">
                <strong>Title:</strong> {todo_title}
            </div>
            <p>Don't forget to complete it!</p>
            <p>Best regards,<br>Todo App Team</p>
        </body>
        </html>
        """
        
        msg = Message(
            subject=subject,
            sender=sender,
            recipients=recipients,
            body=body,
            html=html_body
        )
        
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False
