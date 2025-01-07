from flask import Flask, jsonify, request
from utils.email import send_email
from supabase import Client
from datetime import datetime


def ChoresRoutes(app: Flask, supabase: Client):
    # Create a new chore associated with the group_id
    @app.route('/chores', methods=['POST'])
    def create_chore():
        data = request.json
        group_id = data['group_id']
        name = data['name']
        description = data['description']
        cadence = data['cadence']

        try:
            insert_response = supabase.table('chores').insert({
                'group_id': group_id,
                'name': name,
                'description': description,
                'cadence': cadence
            }).execute()
            return jsonify(insert_response.data)
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    # Assign a existing chore to the given user id
    @app.route('/chores/user/<user_id>', methods=['POST'])
    def assign_chore(user_id):
        data = request.json
        chore_id = data['chore_id']
        due_date = data['due_date']

        try:
            # Use upsert to replace the record if it exists
            upsert_response = supabase.table('chore_assignments').upsert({
                'chore_id': chore_id,
                'user_id': user_id,
                'due_date': due_date
            }).execute()

            return jsonify(upsert_response.data)
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    # Gets all chores associated with the group_id
    @app.route('/chores/group/<group_id>', methods=['GET'])
    def get_chore(group_id):
        try:
            response = supabase.table('chores').select(
                '*').eq('group_id', group_id).execute()
            return jsonify(response.data)
        except Exception as e:
            return jsonify({'error:': str(e)}), 500

    # Gets all chore assignments associated with the chore_id
    @app.route('/chores/assignees/<chore_id>', methods=['GET'])
    def get_assignees(chore_id):
        try:
            response = supabase.table('chore_assignments').select(
                'user_id, due_date').eq('chore_id', chore_id).execute()
            return jsonify(response.data)
        except Exception as e:
            return jsonify({'error:': str(e)}), 500

    # Deletes the chore with the given id
    @app.route('/chores/<chore_id>', methods=['DELETE'])
    def delete_chore(chore_id):
        try:
            delete_response = supabase.table(
                'chores').delete().eq('id', chore_id).execute()
            if delete_response.count == 0:
                return jsonify({'message': 'Chore not found'}), 404

            return jsonify({'message': 'Chore successfully deleted'})
        except Exception as e:
            return jsonify({'error:': str(e)}), 500

    # Remind user assinged to chore
    @app.route('/chores/<chore_id>/reminder', methods=['POST'])
    def remind_user(chore_id):
        try:
            chore = supabase.table('chores').select(
                'group_id, name, description').eq('id', chore_id).execute()

            if not chore.data:
                return jsonify({'error': 'Chore not found'}), 404

            chore_data = chore.data[0]

            assignments = supabase.table('chore_assignments').select(
                'user_id, due_date').eq('chore_id', chore_id).execute()

            if not assignments.data:
                return jsonify({'error': 'No user assignments to this chore'}), 404

            for assignment in assignments.data:
                user_id = assignment['user_id']

                # Parsing the data
                raw_date = str(assignment['due_date']).split('.')[0]  # Removing microseconds 
                due_date_obj = datetime.strptime(raw_date, '%Y-%m-%dT%H:%M:%S')
                formatted_date = due_date_obj.strftime("%A, %B %d, %Y")

                user = supabase.table('users').select(
                    'email').eq('id', user_id).execute()
                if user.data:
                    user_email = user.data[0]['email']
                    subject = f"Chore Reminder: {chore_data['name']}"
                    body = f"Reminder: You are assigned to the chore \"{chore_data['name']}\".\n" \
                        f"Description: {chore_data['description']}.\n" \
                        f"Due date: {formatted_date}."

                    send_email(user_email, subject, body)

            return jsonify({'message': 'Reminder sent successfully.'}), 200
        except Exception as e:
            return jsonify({'error': f'An error occurred while sending reminders: {str(e)}'}), 500