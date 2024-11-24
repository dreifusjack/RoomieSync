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

    # Get all groups a user is in
    @app.route("/user/<user_id>/groups", methods=["GET"])
    def get_user_groups(user_id):
        try:
            # Query the Supabase `group_members` table with a join to `groups`
            response = supabase.table('group_members').select(
                "group_id, groups(name, created_at, updated_at)"
            ).eq('user_id', user_id).execute()

            if response.get('error'):
                return jsonify({'error': response['error']['message']}), 400

            # Return the data as JSON
            return jsonify({'groups': response.get('data', [])}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
