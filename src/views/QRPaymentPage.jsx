import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getStripePaymentURL } from '../controllers/auth.controller';
import { toast } from "react-hot-toast";
import { getInvoiceByCode } from '../controllers/invoices.controller';

function QRPaymentPage() {
    const { code: uniqueCode } = useParams();
    const [amount, setAmount] = useState(null);
    const [currency, setCurrency] = useState(null);
    const [storeName, setStoreName] = useState(null);

    useEffect(() => {
        const fetchInvoiceData = async () => {
            try {
                const res = await getInvoiceByCode(uniqueCode);
                setAmount(res.data[0].total);
                setCurrency(res.data[0].currency);
                setStoreName(res.data[0].store_name);
            } catch (error) {
                console.error("Error fetching invoice data:", error);
                toast.error("Failed to retrieve invoice details. Please try again later.");
            }
        };

        fetchInvoiceData();
    }, [uniqueCode]);

    const handlePayment = async () => {
        if (!amount || !currency) {
            toast.error("Amount or currency information is missing!");
            return;
        }

        toast.loading("Please wait...");
        try {
            const res = await getStripePaymentURL({ amount, currency, uniqueCode });
            toast.dismiss();

            if (res.status === 200) {
                const data = res.data;
                window.location.href = data.url;
            }
        } catch (error) {
            const message = error?.response?.data?.message || "Can't process the payment, please try again later!";
            console.error(error);
            toast.dismiss();
            toast.error(message);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-restro-green-light p-4">
            <div className="w-full max-w-sm bg-white shadow-lg rounded-xl px-10 py-8 flex flex-col justify-between h-[400px]">
                <div className="text-center">
                    <p className="text-sm text-gray-500">Paying <span><b>{storeName}</b></span></p>
                </div>

                <div className="text-center">
                    <p className="text-sm text-gray-600 tracking-wide">Order Total</p>
                    {amount && currency && (
                        <p className="text-4xl font-extrabold text-restro-green mt-1">
                            {currency} {amount}
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-4 mt-8">
                    <button
                        className="w-full bg-restro-green text-white py-2 rounded-lg hover:bg-restro-green-dark transition font-medium border border-gray-300"
                        onClick={handlePayment}
                    >
                        Pay via Stripe
                    </button>
                </div>
            </div>
        </div>
    );
}

export default QRPaymentPage;
