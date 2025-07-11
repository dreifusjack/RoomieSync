# backend/routes/expenses.py
from flask import Flask, request, jsonify
from supabase import Client
from auth.authenticate_user import authenticate_user

def ExpensesRoutes(app: Flask, supabase: Client):
    # Create a new expense
    @app.route('/expenses', methods=['POST'])
    def create_expense():
        try:
            data = request.json
            group_id = data["group_id"]
            paid_by = data["paid_by"]
            amount = float(data["amount"]) 
            description = data["description"]
            is_paid = data.get("is_paid", False)  # Default to False if not provided

            # Validate the group exists
            group_response = supabase.table("groups").select("id").eq("id", group_id).execute()
            if not group_response.data:
                return jsonify({"error": "Group not found"}), 404

            # Validate the user exists and belongs to the group
            user_response = supabase.table("users").select("id").eq("id", paid_by).eq("group_id", group_id).execute()
            if not user_response.data:
                return jsonify({"error": "User not found or not in this group"}), 404

            insert_response = supabase.table("expenses").insert({
                "group_id": group_id,
                "paid_by": paid_by,
                "amount": amount,
                "description": description,
                "is_paid": is_paid,
            }).execute()

            return jsonify(insert_response.data), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # Get all expenses for a group
    @app.route('/groups/<group_id>/expenses', methods=['GET'])
    def get_group_expenses(group_id):
        try:
            response = supabase.table('expenses').select(
                '*').eq('group_id', group_id).execute()
            return jsonify(response.data), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # Get a specific expense
    @app.route('/expenses/<expense_id>', methods=['GET'])
    def get_expense(expense_id):
        try:
            response = supabase.table('expenses').select(
                '*').eq('id', expense_id).execute()
            
            if not response.data:
                return jsonify({"error": "Expense not found"}), 404
                
            return jsonify(response.data[0]), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # Update an expense
    @app.route('/expenses/<expense_id>', methods=['PUT'])
    def update_expense(expense_id):
        try:
            data = request.json
            
            # Check if expense exists
            check_response = supabase.table('expenses').select('id').eq('id', expense_id).execute()
            if not check_response.data:
                return jsonify({"error": "Expense not found"}), 404
            
            update_response = supabase.table('expenses').update(data).eq('id', expense_id).execute()
            return jsonify(update_response.data[0]), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # Delete an expense
    @app.route('/expenses/<expense_id>', methods=['DELETE'])
    def delete_expense(expense_id):
        try:
            delete_response = supabase.table('expenses').delete().eq('id', expense_id).execute()
            
            if not delete_response.data:
                return jsonify({"error": "Expense not found"}), 404
                
            return jsonify({"message": "Expense deleted successfully"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # Mark an expense as paid
    @app.route('/expenses/<expense_id>/status', methods=['PATCH'])
    def update_expense_status(expense_id):
        try:
            data = request.json
            is_paid = data.get('is_paid')
            
            if is_paid is None:
                return jsonify({"error": "is_paid status is required"}), 400
                
            update_response = supabase.table('expenses').update({
                'is_paid': is_paid
            }).eq('id', expense_id).execute()
            
            if not update_response.data:
                return jsonify({"error": "Expense not found"}), 404
                
            return jsonify(update_response.data[0]), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # Calculate expense balances for a group
    @app.route('/groups/<group_id>/balances', methods=['GET'])
    def calculate_group_balances(group_id):
        try:
            # Get all users in the group
            users_response = supabase.table('users').select('id, first_name, last_name').eq('group_id', group_id).execute()
            if not users_response.data:
                return jsonify({"error": "No users found in this group"}), 404
                
            users = users_response.data
            user_ids = [user['id'] for user in users]
            user_map = {user['id']: f"{user['first_name']} {user['last_name']}" for user in users}
            
            # Get all unpaid expenses for the group
            expenses_response = supabase.table('expenses').select('*').eq('group_id', group_id).eq('is_paid', False).execute()
            expenses = expenses_response.data
            
            if not expenses:
                return jsonify({"message": "No unpaid expenses found", "balances": []}), 200
            
            # Calculate what each person has paid
            total_paid = {user_id: 0 for user_id in user_ids}
            for expense in expenses:
                payer = expense['paid_by']
                if payer in total_paid:
                    total_paid[payer] += expense['amount']
            
            # Calculate per person share for each expense
            num_users = len(user_ids)
            total_expenses = sum(total_paid.values())
            equal_share = total_expenses / num_users if num_users > 0 else 0
            
            # Calculate net balances (positive means they are owed money, negative means they owe)
            balances = []
            for user_id in user_ids:
                paid = total_paid.get(user_id, 0)
                balance = paid - equal_share
                balances.append({
                    "user_id": user_id,
                    "name": user_map.get(user_id, "Unknown"),
                    "paid": paid,
                    "should_have_paid": equal_share,
                    "balance": balance  # Positive: others owe them, Negative: they owe others
                })
            
            # Calculate who owes whom
            transactions = []
            # Sort by balance (ascending: most negative (owes most) first)
            sorted_balances = sorted(balances, key=lambda x: x["balance"])
            
            debtors = [b for b in sorted_balances if b["balance"] < 0]  # People who owe money
            creditors = [b for b in sorted_balances if b["balance"] > 0]  # People who are owed money
            
            # Match debtors with creditors
            for debtor in debtors:
                debt_remaining = abs(debtor["balance"])
                
                while debt_remaining > 0.01 and creditors:  # Using 0.01 to handle floating point issues
                    creditor = creditors[0]
                    credit_remaining = creditor["balance"]
                    
                    if debt_remaining >= credit_remaining:
                        # Debtor pays the full amount the creditor is owed
                        transactions.append({
                            "from": debtor["user_id"],
                            "from_name": debtor["name"],
                            "to": creditor["user_id"],
                            "to_name": creditor["name"],
                            "amount": round(credit_remaining, 2)
                        })
                        debt_remaining -= credit_remaining
                        creditors.pop(0)  # Remove this creditor as they've been fully paid
                    else:
                        # Debtor pays part of what the creditor is owed
                        transactions.append({
                            "from": debtor["user_id"],
                            "from_name": debtor["name"],
                            "to": creditor["user_id"],
                            "to_name": creditor["name"],
                            "amount": round(debt_remaining, 2)
                        })
                        creditor["balance"] -= debt_remaining
                        debt_remaining = 0
            
            return jsonify({
                "total_expenses": total_expenses,
                "equal_share": equal_share,
                "balances": balances,
                "transactions": transactions  # Who should pay whom
            }), 200
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # Record a payment between users
    @app.route('/payments', methods=['POST'])
    def record_payment():
        try:
            data = request.json
            amount = float(data['amount'])
            payer = data['payer']
            recipient = data['recipient']
            
            # Validate users exist
            payer_response = supabase.table('users').select('id').eq('id', payer).execute()
            recipient_response = supabase.table('users').select('id').eq('id', recipient).execute()
            
            if not payer_response.data:
                return jsonify({"error": "Payer not found"}), 404
                
            if not recipient_response.data:
                return jsonify({"error": "Recipient not found"}), 404
            
            # Record the payment
            insert_response = supabase.table('expense_payment').insert({
                'amount_paid': amount,
                'payer': payer,
                'recipient': recipient
            }).execute()
            
            return jsonify(insert_response.data), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # Get payment history between users
    @app.route('/payments', methods=['GET'])
    def get_payments():
        try:
            payer = request.args.get('payer')
            recipient = request.args.get('recipient')
            
            query = supabase.table('expense_payment').select('*')
            
            if payer:
                query = query.eq('payer', payer)
            if recipient:
                query = query.eq('recipient', recipient)
                
            response = query.execute()
            return jsonify(response.data), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500