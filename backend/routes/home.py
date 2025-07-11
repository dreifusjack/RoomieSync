from flask import Flask, jsonify, request
from supabase import Client
import random
import string

def generate_group_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))

def HomeRoutes(app: Flask, supabase: Client):
    # Create a group (creating user automatically joins)
    @app.route("/groups", methods=["POST"])
    def make_group():
        try:
            data = request.json
            name = data.get("name")
            user_id = data.get("user_id")

            if not all([name, user_id]):
                return jsonify({"error": "Missing required fields"}), 400

            # Generate a unique group code
            group_code = generate_group_code()

            # Insert the new group into the groups table
            insert_response = supabase.table("groups").insert({
                "name": name,
                "group_code": group_code,
            }).execute()

            if not insert_response.data:
                return jsonify({"error": "Failed to create group"}), 500

            # Get the created group ID
            group_id = insert_response.data[0]["id"]

            # Update the user's group_id to the created group
            update_response = supabase.table("users").update({
                "group_id": group_id
            }).eq("id", user_id).execute()

            if not update_response.data:
                return jsonify({"error": "Failed to update user with group_id"}), 400

            return jsonify({
                "group": insert_response.data[0],
                "user": update_response.data[0]
            }), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # Join a group
    @app.route("/groups/join", methods=["POST"])
    def join_group():
        try:
            data = request.json
            group_code = data.get("group_code")
            user_id = data.get("user_id")

            if not all([group_code, user_id]):
                return jsonify({"error": "Missing required fields"}), 400

            # Find the group by group code
            group_response = supabase.table("groups").select("*").eq("group_code", group_code).execute()
            if not group_response.data:
                return jsonify({"error": "Invalid group code"}), 404

            group_id = group_response.data[0]["id"]

            # Update the user's group_id with the given group_id
            update_response = supabase.table("users").update({
                "group_id": group_id
            }).eq("id", user_id).execute()

            # Check if the update was successful
            if not update_response.data:
                return jsonify({"error": "User not found or update failed"}), 404

            return jsonify(update_response.data), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # Get all groups
    @app.route("/groups", methods=["GET"])
    def get_groups():
        try:
            select_response = supabase.table("groups").select().execute()
            return jsonify(select_response.data), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # Get all users in a group
    @app.route("/groups/<group_id>/users", methods=["GET"])
    def get_group_users(group_id):
        try:
            # Query users table directly with group_id
            response = supabase.table('users')\
                .select('id, email, first_name, last_name')\
                .eq('group_id', group_id)\
                .execute()

            return jsonify({'users': response.data}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # Get a group
    @app.route("/groups/<group_id>", methods=["GET"])
    def get_group(group_id):
        try:
            select_response = supabase.table("groups").select().eq("id", group_id).execute()
            if not select_response.data:
                return jsonify({"error": "Group not found"}), 404
            return jsonify(select_response.data), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500