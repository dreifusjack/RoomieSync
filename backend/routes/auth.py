from flask import Flask, jsonify, request
from supabase import Client


def AuthRoutes(app: Flask, supabase: Client):
    # Create a new user
    @app.route("/auth/signup", methods=["POST"])
    def signup():
        data = request.get_json()
        try:
            # Register the user in Supabase
            auth_response = supabase.auth.sign_up({
                "email": data["email"],
                "password": data["password"]
            })
            user_id = auth_response.user.id

            # Insert the user into the users table
            insert_response = supabase.table("users").insert({
                "id": user_id,
                "email": data["email"],
                "first_name": data["first_name"],
                "last_name": data["last_name"],
            }).execute()

            return jsonify({
                "user": insert_response.data,
                "access_token": auth_response.session.access_token,
                "refresh_token": auth_response.session.refresh_token
            }), 200
        except Exception as e:
            return {"error": str(e)}, 400

    # Login a user
    @app.route("/auth/login", methods=["POST"])
    def login():
        data = request.get_json()
        try:
            auth_response = supabase.auth.sign_in_with_password({
                "email": data["email"],
                "password": data["password"]
            })
            return jsonify({
                "access_token": auth_response.session.access_token,
                "refresh_token": auth_response.session.refresh_token
            })
        except Exception as e:
            return {"error": str(e)}, 401

    # Refresh a user's session
    @app.route("/auth/refresh", methods=["POST"])
    def refresh():
        try:
            refresh_token = request.headers.get('Refresh-Token')
            if not refresh_token:
                return {"error": "Refresh token required"}, 401

            refresh_response = supabase.auth.refresh_session(refresh_token)

            return jsonify({
                "session": refresh_response.session
            })
        except Exception as e:
            return {"error": str(e)}, 401
