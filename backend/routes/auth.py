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

            # Create a new group for the user
            insert_response = supabase.table("groups").insert({
                "name": f"{data['first_name']}'s Group",
            }).execute()
            group_id = insert_response.data[0]["id"]

            # Insert the user into the users table
            insert_response = supabase.table("users").insert({
                "id": user_id,
                "group_id": group_id,
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

    # Get the current user
    @app.route("/auth/user", methods=["GET"])
    def current_user():
        try:
            # Extract the access token from the Authorization header
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return jsonify({'error': 'Authorization header missing or malformed'}), 401
            access_token = auth_header.split(' ')[1]

            # Retrieve the user associated with the access token
            response = supabase.auth.get_user(access_token)

            # Fetch the user from the users table
            user_response = supabase.table("users").select(
                "*").eq("id", response.user.id).single().execute()
            return jsonify(user_response.data), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 400
