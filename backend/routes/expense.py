from flask import Flask, request, jsonify
from supabase import Client

from auth.authenticate_user import authenticate_user


def ExpensesRoutes(app: Flask, supabase: Client):
    # Route to add a new expense
    @app.route('/add_expense/user/<user_id>', methods=['POST'])
    def create_expense(user_id):
        try:
            data = request.json
            group_id = data["group_id"]
            amount = float(data["amount"]) 
            description = data["description"]
            is_paid = data.get("is_paid", False)  # Default to False if not provided

            insert_response = supabase.table("expenses").insert({
                "group_id": group_id,
                "paid_by": user_id,
                "amount": amount,
                "description": description,
                "is_paid": is_paid,
            }).execute()

            return jsonify(insert_response.data), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route('/calculate_expenses/<group_id>', methods=['GET'])
    def calculate_expenses(group_id):
        try:
            response = supabase.table('expenses').select(
                '*').eq('group_id', group_id).eq('is_paid', False).execute()
            expenses = response.data

            # start by calculating the total amount each person in the group spent
            total_spent = {}
            for expense in expenses:
                payer = expense['paid_by']
                amount = expense['amount']
                if payer in total_spent:
                    total_spent[payer] += amount
                else:
                    total_spent[payer] = amount

            # Calculate how much everyone owes each person
            num_roommates = len(total_spent)
            per_person_share = {
                user_id: total / num_roommates for user_id, total in total_spent.items()}

            # create dictionary for net owes
            net_owes = {}
            users = list(per_person_share.keys())

            for i in range(len(users)):
                for j in range(i + 1, len(users)):
                    user1 = users[i]
                    user2 = users[j]
                    amount_user1_owes_user2 = per_person_share[user2] - \
                        per_person_share[user1]
                    amount_user2_owes_user1 = per_person_share[user1] - \
                        per_person_share[user2]

                    # amount user1 owes user2 gets populated onto dictionary- can be negative (means user2 owes user1 that amount)
                    if amount_user1_owes_user2 > 0:
                        net_owes[(user1, user2)] = amount_user1_owes_user2
                    elif amount_user2_owes_user1 > 0:
                        net_owes[(user1, user2)] = -amount_user1_owes_user2
                    else:
                        net_owes[(user1, user2)] = 0

            return jsonify({'net_owes': net_owes}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # Route to get all expenses for a specific group
    @app.route('/expenses/<group_id>', methods=['GET'])
    def get_expenses_by_group(group_id):
        response = supabase.table('expenses').select(
            '*').eq('group_id', group_id).execute()
        return jsonify(response.data), response.status_code

    # Route to get all expenses by the person who paid for them
    @app.route('/expenses_by_person/<user_id>', methods=['GET'])
    def get_expenses_by_person(user_id):
        response = supabase.table('expenses').select(
            '*').eq('paid_by', user_id).execute()
        return jsonify(response.data), response.status_code

    # Route to get a specific expense by its ID
    @app.route('/expense/<id>', methods=['GET'])
    def get_expense_by_id(id):
        response = supabase.table('expenses').select(
            '*').eq('id', id).execute()
        return jsonify(response.data), response.status_code

    # Route to add an expense with authentication
    @app.route('/add_expense_auth', methods=['POST'])
    @authenticate_user(supabase)
    def add_expense_auth(user_id):
        data = request.json
        response = supabase.table('expenses').insert(data).execute()
        return jsonify(response.data), response.status_code

    # Route to calculate expenses with authentication
    @app.route('/calculate_expenses_auth/<group_id>', methods=['GET'])
    @authenticate_user(supabase)
    def calculate_expenses_auth(user_id, group_id):
        response = supabase.table('expenses').select(
            '*').eq('group_id', group_id).execute()
        expenses = response.data
        total = sum(expense['amount'] for expense in expenses)
        num_roommates = len(set(expense['paid_by'] for expense in expenses))
        per_person = total / num_roommates if num_roommates else 0
        return jsonify({'total': total, 'per_person': per_person}), response.status_code
