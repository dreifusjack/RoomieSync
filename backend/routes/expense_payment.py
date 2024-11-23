from flask import Flask, request, jsonify
from supabase import Client

def ExpensePaymentRoutes(app: Flask, supabase: Client):

    # route to create a new payment
    @app.route('/create_payment', methods=['POST'])
    def create_payment():
        data = request.json
        amount_paid = data['amount_paid']
        payer = data['payer']
        recipient = data['recipient']

        insert_response = supabase.table('expense_payment').insert({
            'amount_paid': amount_paid,
            'payer': payer,
            'recipient': recipient
        }).execute()
        return jsonify(insert_response.data), insert_response.status_code
    
    # route to get the total amount paid from one user to another
    # will subtract this from all payment accumulatives between two given users to get net payment amount
    @app.route('/total_amount_paid/<payer>/<recipient>', methods=['GET'])
    def get_total_amount_paid(payer, recipient):
        response = supabase.table('expense_payment').select('SUM(amount_paid) as total_amount').eq('payer', payer).eq('recipient', recipient).execute()
        total_amount = response.data[0]['total_amount'] if response.data else 0
        return jsonify({'total_amount_paid': total_amount}), response.status_code