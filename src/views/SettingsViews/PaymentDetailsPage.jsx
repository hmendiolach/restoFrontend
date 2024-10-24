import React, { useRef, useState, useEffect } from "react";
import Page from "../../components/Page";
import { usePaymentDetails, savePaymentDetails } from "../../controllers/settings.controller";
import { toast } from "react-hot-toast";
import { mutate } from "swr";

export default function PaymentDetailsPage() {
    const stripeSecretRef = useRef('');
    const stripeWebhookSecretRef = useRef('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { APIURL, data, error: fetchError, isLoading: fetching } = usePaymentDetails();

    useEffect(() => {
        if (fetching) return;

        if (fetchError) {
            setError("Error loading data, try again later!");
            setIsLoading(false);
            return;
        }

        if (data) {
            stripeSecretRef.current = data.stripeSecret || '';
            stripeWebhookSecretRef.current = data.stripeWebhookSecret || '';
        }

        setIsLoading(false);
    }, [fetching, fetchError, data]);

    const handleSave = async () => {
        const stripeSecret = stripeSecretRef.current;
        const stripeWebhookSecret = stripeWebhookSecretRef.current;

        if (!stripeSecret || !stripeWebhookSecret) {
            toast.error("Please provide all required details!");
            return;
        }

        try {
            toast.loading("Please wait...");
            const res = await savePaymentDetails(stripeSecret, stripeWebhookSecret);

            if (res.status === 200) {
                await mutate(APIURL);
                toast.dismiss();
                toast.success(res.data.message);
            } else {
                toast.error("Failed to save payment credentials!");
            }
        } catch (error) {
            const message = error?.response?.data?.message || "Something went wrong!";
            console.error(error);

            toast.dismiss();
            toast.error(message);
        }
    };

    if (isLoading) {
        return <Page className="px-8 py-6">Please wait...</Page>;
    }

    if (error) {
        return <Page className="px-8 py-6">{error}</Page>;
    }

    return (
        <Page className="px-8 py-6">
            <h3 className="text-3xl font-light">Payment Details</h3>

            <div className="mt-8 text-sm text-gray-500">
                <div>
                    <label htmlFor="stripeSecret" className="block mb-1">
                        Stripe Secret Key
                    </label>
                    <input
                        type="password"
                        name="stripeSecret"
                        id="stripeSecret"
                        defaultValue={stripeSecretRef.current}
                        onChange={(e) => stripeSecretRef.current = e.target.value}
                        placeholder="Enter Stripe secret key here..."
                        className="block w-full lg:min-w-96 border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
                    />
                </div>
                <div>
                    <label htmlFor="stripeWebhookSecret" className="block mb-1 mt-4">
                        Stripe Webhook Secret
                    </label>
                    <input
                        type="password"
                        name="stripeWebhookSecret"
                        id="stripeWebhookSecret"
                        defaultValue={stripeWebhookSecretRef.current}
                        onChange={(e) => stripeWebhookSecretRef.current = e.target.value}
                        placeholder="Enter Stripe Webhook Secret here..."
                        className="block w-full lg:min-w-96 border rounded-lg px-4 py-2 bg-gray-50 outline-restro-border-green-light"
                    />
                </div>

                <button
                    onClick={handleSave}
                    className="text-white w-full lg:min-w-96 bg-restro-green transition hover:bg-restro-green/80 active:scale-95 rounded-lg px-4 py-2 mt-6 outline-restro-border-green-light"
                >
                    Save
                </button>
            </div>
        </Page>
    );
}
