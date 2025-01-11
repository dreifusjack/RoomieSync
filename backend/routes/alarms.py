import datetime
import json
from flask import Flask, jsonify, request
from supabase import Client

from auth.authenticate_user import authenticate_user


def AlarmRoutes(app: Flask, supabase: Client):
    # Create an alarm
    @app.route("/alarm/user/<user_id>", methods=["POST"])
    def create_alarm(user_id):
        try:
            data = request.json
            name = data["name"]
            time = datetime.datetime.strptime(data["time"], "%H:%M").time()

            insert_response = supabase.table("alarms").insert({
                "time": time.isoformat(),
                "name": name,
                "user_id": user_id,
            }).execute()

            return jsonify(insert_response.data), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500  

    # Get all alarms in a group
    @app.route("/alarm/groups/<group_id>", methods=["GET"])
    def get_group_alarms(group_id):
        try:
            # Step 1: Retrieve all user_ids in the specified group
            group_members_response = supabase.table("users").select(
                "*").eq("group_id", group_id).execute()
            user_ids = [member['id']
                        for member in group_members_response.data]

            # No users in the group
            if not user_ids:
                return jsonify({"alarms": []}), 200

            # Step 2: Retrieve alarms for these user_ids, including user details
            alarms_response = supabase.table("alarms") \
                .select("id, name, time, created_at, updated_at, user_id, users(id, first_name, last_name, email)") \
                .in_("user_id", tuple(user_ids)) \
                .execute()

            # Format the alarms to include user information
            alarms = []
            for alarm in alarms_response.data:
                alarm_data = {
                    "alarm_id": alarm.get("id"),
                    "alarm_name": alarm.get("name"),
                    "alarm_time": alarm.get("time"),
                    "alarm_created_at": alarm.get("created_at"),
                    "alarm_updated_at": alarm.get("updated_at"),
                    "user": {
                        "user_id": alarm.get("user_id"),
                        "first_name": alarm.get("users", {}).get("first_name"),
                        "last_name": alarm.get("users", {}).get("last_name"),
                        "email": alarm.get("users", {}).get("email"),
                    }
                }
                alarms.append(alarm_data)

            return jsonify({"alarms": alarms}), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # Get all alarms for a user
    @app.route("/alarm/user/<user_id>", methods=["GET"])
    def get_user_alarms(user_id):
        try:
            alarms_response = supabase.table("alarms") \
                .select() \
                .eq("user_id", user_id) \
                .execute()

            return jsonify(alarms_response.data), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        
    # Delete an alarm 
    @app.route("/alarm/<alarm_id>/delete", methods=["DELETE"])
    def delete_alarm(alarm_id):
        try:
            delete_response = supabase.table(
                "alarms").delete().eq("id", alarm_id).execute()
            if delete_response.count == 0:
                return jsonify({'message': 'Alarm not found'}), 404

            return jsonify({'message': 'Alarm successfully deleted'})

        except Exception as e:
            return jsonify({"error": str(e)}), 500

