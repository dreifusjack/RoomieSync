from flask import Flask, jsonify, request
from supabase import Client

def UserRoutes(app: Flask, supabase: Client):
    # Create a new user
    @app.route("/users", methods=["POST"])
    def create_user():
        try:
            data = request.json
            email = data.get("email")
            password = data.get("password")
            first_name = data.get("first_name")
            last_name = data.get("last_name")

            if not all([email, password, first_name, last_name]):
                return jsonify({"error": "Missing required fields"}), 400

            insert_response = supabase.table("users").insert({
                "email": email,
                "password": password,  # Note: In production, hash the password
                "first_name": first_name,
                "last_name": last_name,
            }).execute()

            return jsonify(insert_response.data), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # Get a user by their ID
    @app.route("/users/<user_id>", methods=["GET"])
    def get_user(user_id):
        try:
            select_response = supabase.table("users").select().eq("id", user_id).single().execute()
            if not select_response.data:
                return jsonify({"error": "User not found"}), 404
            return jsonify(select_response.data), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500