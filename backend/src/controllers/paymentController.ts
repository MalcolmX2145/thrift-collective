import { Request, Response } from 'express';
import { createPayment, updatePaymentStatus, findPaymentByCheckoutRequestId } from '../models/Payment';
// In a real implementation, we would import a Daraja/Mpesa service here to make the actual request.
// For now, we will simulate the initiation and provide an endpoint that Safaricom would call.

export const initiatePayment = async (req: Request, res: Response) => {
    const { order_id, amount, phone_number } = req.body;

    if (!order_id || !amount || !phone_number) {
        res.status(400).json({ error: 'Missing payment details' });
        return;
    }

    try {
        // SIMULATION: In real life, we'd call axios.post to Safaricom Daraja API here.
        // We'd get back a MerchantRequestID and CheckoutRequestID.
        // We'll generate fake ones for this demo to verify the flow logic.
        const mockMerchantRequestId = `MR-${Date.now()}`;
        const mockCheckoutRequestId = `CR-${Date.now()}`;

        const payment = await createPayment({
            order_id,
            amount,
            phone_number,
            merchant_request_id: mockMerchantRequestId,
            checkout_request_id: mockCheckoutRequestId
        });

        // Respond to frontend that STK push was "sent"
        res.json({
            message: 'STK Push initiated successfully',
            data: {
                MerchantRequestID: mockMerchantRequestId,
                CheckoutRequestID: mockCheckoutRequestId,
                ResponseCode: "0",
                CustomerMessage: "Success. Request accepted for processing"
            }
        });
    } catch (error) {
        console.error('Error initiating payment:', error);
        res.status(500).json({ error: 'Internal server error' });
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

        await updatePaymentStatus(CheckoutRequestID, status, transactionCode, ResultDesc);

        console.log(`M-Pesa Callback processed: ${status} for ${CheckoutRequestID}`);

        // Safaricom expects a simple response
        res.json({ ResultCode: 0, ResultDesc: "Accepted" });
    } catch (error) {
        console.error('Error processing M-Pesa callback:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
