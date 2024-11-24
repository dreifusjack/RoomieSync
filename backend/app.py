from flask import Flask
from flask_mail import Mail
from supabase import create_client

from routes.auth import AuthRoutes
from routes.examples import ExamplesRoutes
from routes.user import UserRoutes
from routes.chores import ChoresRoutes
from routes.alarms import AlarmRoutes
from routes.home import HomeRoutes

app = Flask(__name__)

# Flask-Mail configs
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = 'roomiesync@gmail.com' 
app.config['MAIL_PASSWORD'] = 'lykzipcowkzwwrwa' 
app.config['MAIL_DEFAULT_SENDER'] = 'roomiesync@gmail.com' 
mail = Mail(app)

SUPABASE_URL = "http://127.0.0.1:54321"
# Replace this by running `npx supabase status` and using "anon key" value
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"


def create_app():
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

    # Initialize routes here!
    ExamplesRoutes(app, supabase)
    AuthRoutes(app, supabase)
    UserRoutes(app, supabase)
    ChoresRoutes(app, supabase)
    HomeRoutes(app, supabase)
    AlarmRoutes(app, supabase)

    return app
