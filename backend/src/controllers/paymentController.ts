import { Request, Response } from 'express';
import { createPayment, updatePaymentStatus, findPaymentByCheckoutRequestId } from '../models/Payment';
import { initiateSTKPush } from '../services/mpesa';
import { updateOrderStatus } from '../models/Order';
// For now, we will simulate the initiation and provide an endpoint that Safaricom would call.

export const initiatePayment = async (req: Request, res: Response) => {
    const { order_id, amount, phone_number } = req.body;

    if (!order_id || !amount || !phone_number) {
        res.status(400).json({ error: 'Missing payment details' });
        return;
    }

    try {
        // Initiate STK Push via Daraja
        const stkResponse = await initiateSTKPush({
            phoneNumber: phone_number,
            amount: amount,
            accountReference: `Order ${order_id.substring(0, 8)}`,
            transactionDesc: 'Payment for Thrift Collective Order'
        });

        const { MerchantRequestID, CheckoutRequestID, ResponseCode, CustomerMessage } = stkResponse;

        // Save initial payment record
        await createPayment({
            order_id,
            amount,
            phone_number,
            merchant_request_id: MerchantRequestID,
            checkout_request_id: CheckoutRequestID
        });

        res.json({
            message: 'STK Push initiated successfully',
            data: {
                MerchantRequestID,
                CheckoutRequestID,
                ResponseCode,
                CustomerMessage
            }
        });
    } catch (error: any) {
        console.error('Error initiating payment:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

// This is the endpoint Safaricom would hit
export const mpesaCallback = async (req: Request, res: Response) => {
    try {
        const { Body } = req.body;

        if (!Body || !Body.stkCallback) {
            console.error('Invalid M-Pesa Callback');
            res.status(400).send('Invalid');
            return;
        }

        const { CheckoutRequestID, ResultCode, ResultDesc } = Body.stkCallback;
        // ResultCode 0 is success, anything else is failure

        const status = ResultCode === 0 ? 'SUCCESS' : 'FAILED';

        // Extract transaction code from Item if success (usually Item[1])
        let transactionCode = '';
        if (Body.stkCallback.CallbackMetadata && Body.stkCallback.CallbackMetadata.Item) {
            const items = Body.stkCallback.CallbackMetadata.Item;
            const codeItem = items.find((i: any) => i.Name === 'MpesaReceiptNumber');
            if (codeItem) transactionCode = codeItem.Value;
        }

        const payment = await updatePaymentStatus(CheckoutRequestID, status, transactionCode, ResultDesc);

        if (payment && status === 'SUCCESS') {
            await updateOrderStatus(payment.order_id, 'PAID');
        }

        console.log(`M-Pesa Callback processed: ${status} for ${CheckoutRequestID}`);

        // Safaricom expects a simple response
        res.json({ ResultCode: 0, ResultDesc: "Accepted" });
    } catch (error) {
        console.error('Error processing M-Pesa callback:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
