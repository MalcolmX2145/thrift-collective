import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const MPESA_AUTH_URL = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
const MPESA_STK_PUSH_URL = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

const getAccessToken = async (): Promise<string> => {
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

    if (!consumerKey || !consumerSecret) {
        throw new Error('Missing M-Pesa Consumer Key or Secret');
    }

    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

    try {
        const response = await axios.get(MPESA_AUTH_URL, {
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });
        return response.data.access_token;
    } catch (error: any) {
        console.error('M-Pesa Auth Error:', error.response?.data || error.message);
        throw new Error('Failed to authenticate with M-Pesa');
    }
};

interface STKPushParams {
    phoneNumber: string;
    amount: number;
    accountReference: string;
    transactionDesc: string;
}

export const initiateSTKPush = async ({ phoneNumber, amount, accountReference, transactionDesc }: STKPushParams) => {
    const token = await getAccessToken();
    const shortCode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;
    const callbackUrl = process.env.MPESA_CALLBACK_URL;

    if (!shortCode || !passkey || !callbackUrl) {
        throw new Error('Missing M-Pesa Configuration (Shortcode, Passkey, or Callback URL)');
    }

    const date = new Date();
    const timestamp = date.getFullYear() +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        ('0' + date.getDate()).slice(-2) +
        ('0' + date.getHours()).slice(-2) +
        ('0' + date.getMinutes()).slice(-2) +
        ('0' + date.getSeconds()).slice(-2);

    const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');

    // Format phone number to 254...
    let formattedPhone = phoneNumber.replace(/\D/g, ''); // Remove non-digits
    if (formattedPhone.startsWith('0')) {
        formattedPhone = '254' + formattedPhone.substring(1);
    } else if (formattedPhone.startsWith('7') || formattedPhone.startsWith('1')) {
        formattedPhone = '254' + formattedPhone;
    }

    const payload = {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.ceil(amount), // Ensure integer
        PartyA: formattedPhone,
        PartyB: shortCode,
        PhoneNumber: formattedPhone,
        CallBackURL: callbackUrl,
        AccountReference: accountReference,
        TransactionDesc: transactionDesc,
    };

    try {
        const response = await axios.post(MPESA_STK_PUSH_URL, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error('M-Pesa STK Push Error:', error.response?.data || error.message);
        throw error;
    }
};
