from flask_mail import Message
from flask import jsonify
from app import mail

def send_email(recipient, subject, body):
  try:
      msg = Message(subject, recipients=[recipient])
      msg.body = body
      mail.send(msg)
      return jsonify({"message": "Email sent successfully!"}), 200
  except Exception as e:
      return jsonify({"error": f"Failed to send email: {str(e)}"}), 500