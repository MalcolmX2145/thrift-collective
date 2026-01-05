import { query } from '../config/db';

export interface Payment {
    id: string;
    order_id: string;
    amount: number;
    provider: 'MPESA';
    status: 'PENDING' | 'SUCCESS' | 'FAILED';
    phone_number: string;
    transaction_code?: string;
    merchant_request_id?: string;
    checkout_request_id?: string;
    result_desc?: string;
    created_at: Date;
    updated_at: Date;
}

export const createPayment = async (paymentData: Partial<Payment>): Promise<Payment> => {
    const {
        order_id,
        amount,
        phone_number,
        merchant_request_id,
        checkout_request_id,
    } = paymentData;

    const sql = `
    INSERT INTO payments (
      order_id, amount, phone_number,
      merchant_request_id, checkout_request_id, status
    )
    VALUES ($1, $2, $3, $4, $5, 'PENDING')
    RETURNING *
  `;

    const result = await query(sql, [
        order_id,
        amount,
        phone_number,
        merchant_request_id,
        checkout_request_id,
    ]);
    return result.rows[0];
};

export const updatePaymentStatus = async (
    checkoutRequestId: string,
    status: 'SUCCESS' | 'FAILED',
    transactionCode?: string,
    resultDesc?: string
): Promise<Payment | null> => {
    const sql = `
    UPDATE payments
    SET status = $1, transaction_code = $2, result_desc = $3, updated_at = CURRENT_TIMESTAMP
    WHERE checkout_request_id = $4
    RETURNING *
  `;
    const result = await query(sql, [status, transactionCode, resultDesc, checkoutRequestId]);
    return result.rows[0] || null;
};

export const findPaymentByCheckoutRequestId = async (checkoutRequestId: string): Promise<Payment | null> => {
    const sql = `SELECT * FROM payments WHERE checkout_request_id = $1`;
    const result = await query(sql, [checkoutRequestId]);
    return result.rows[0] || null;
};
