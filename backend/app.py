from flask import Flask
from flask_mail import Mail
from flask_cors import CORS 
from shared import mail
from supabase import create_client

from routes.auth import AuthRoutes
from routes.examples import ExamplesRoutes
from routes.user import UserRoutes
from routes.chores import ChoresRoutes
from routes.alarms import AlarmRoutes
from routes.home import HomeRoutes
from routes.expense import ExpensesRoutes
from routes.expense_payment import ExpensePaymentRoutes

SUPABASE_URL = "http://127.0.0.1:54321"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"


def create_app():
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    app = Flask(__name__)

    @app.route('/')
    def test_route():
        return {"message": "Flask server is running"}, 200

    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })

    # Flask-Mail configs
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USE_SSL'] = False
    app.config['MAIL_USERNAME'] = 'roomiesync@gmail.com'
    app.config['MAIL_PASSWORD'] = 'lykzipcowkzwwrwa'
    app.config['MAIL_DEFAULT_SENDER'] = 'roomiesync@gmail.com'
    mail.init_app(app)

    ExamplesRoutes(app, supabase)
    AuthRoutes(app, supabase)
    UserRoutes(app, supabase)
    ChoresRoutes(app, supabase)
    ExpensesRoutes(app, supabase)
    ExpensePaymentRoutes(app, supabase)
    HomeRoutes(app, supabase)
    AlarmRoutes(app, supabase)

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(port=5000, debug=True)
