from flask import Flask, jsonify, request
from supabase import Client


def HomeRoutes(app: Flask, supabase: Client):
    # Make a group
    @app.route("/group", methods=["POST"])
    def make_group():
        try:
            data = request.json
            name = data["name"]

            insert_response = supabase.table("groups").insert({
                "name": name,
            }).execute()

            return jsonify(insert_response.data), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # Join a group
    @app.route("/group/<group_id>/user/<user_id>", methods=["POST"])
    def join_group(group_id, user_id):
        try:
            insert_response = supabase.table("group_members").insert({
                "group_id": group_id,
                "user_id": user_id,
            }).execute()

            return jsonify(insert_response.data), 200
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
    @app.route("/group/<group_id>/users", methods=["GET"])
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
    @app.route("/group/<group_id>", methods=["GET"])
    def get_group(group_id):
        try:
            select_response = supabase.table(
                "groups").select().eq("id", group_id).execute()
            return jsonify(select_response.data), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
