from flask import Flask, jsonify, request
from supabase import Client


def UserRoutes(app: Flask, supabase: Client):
    # Create a new user
    @app.route("/user", methods=["POST"])
    def create_user():
        try:
            data = request.json
            email = data["email"]
            password = data["password"]
            first_name = data["first_name"]
            last_name = data["last_name"]

            insert_response = supabase.table("users").insert({
                "email": email,
                "password": password,
                "first_name": first_name,
                "last_name": last_name,
            }).execute()

            return jsonify(insert_response.data), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # Get a user by their ID
    @app.route("/user/<user_id>", methods=["GET"])
    def get_user(user_id):
        try:
            select_response = supabase.table("users").select().eq(
                "id", user_id).single().execute()
            return jsonify(select_response.data), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
