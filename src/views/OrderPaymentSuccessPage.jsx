import React, { useState, useEffect } from "react";
import { IconCircleCheckFilled, IconCircleXFilled } from '@tabler/icons-react';
import { useParams, useLocation } from 'react-router-dom';
import { checkOrderPaymentStatus } from "../controllers/auth.controller";
import { toast } from "react-hot-toast";
import { ThreeDots } from 'react-loader-spinner'

function OrderPaymentSuccessPage() {
  const { search } = useLocation();
  const sessionId = new URLSearchParams(search).get('session_id');
  const uniqueCode = new URLSearchParams(search).get('uniqueCode');

  const [paymentStatus, setPaymentStatus] = useState('PENDING');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await checkOrderPaymentStatus(sessionId, uniqueCode);

        if (res.status === 200) {
          const { status } = res.data;

          if (status === 'PAID') {
            setPaymentStatus('PAID');
            clearInterval(interval); // Stop polling
            setLoading(false); // Stop loading
            // toast.success("Payment successful!");
          }
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
        // toast.error("Error checking payment status. Please try again.");
        setLoading(false);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [sessionId]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
    <div className="w-full max-w-sm bg-white shadow-lg rounded-xl px-10 py-8 flex flex-col justify-center items-center h-[400px]">
      {loading ? (
        <div className="text-center  flex flex-col justify-center items-center gap-6">
          <p className="text-sm text-gray-500">Please wait while we confirm your payment...</p>
          <ThreeDots
            visible={true}
            height="80"
            width="80"
            color="#4fa94d"
            radius="9"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      ) : paymentStatus === 'PAID' ? (
        <>
          <div className="flex flex-col justify-center items-center text-center mb-6">
            <p className="text-sm text-gray-500 mb-2">Thank you for choosing us!</p>
            <IconCircleCheckFilled className="text-restro-green" size={150} />
            <p className="text-md text-gray-600 tracking-wide mt-4 font-bold">
              Payment Successful
            </p>
          </div>
        </>
      ) : (
        <div className="mx-auto text-center mb-6">
          <IconCircleXFilled className="text-red-500" size={150} />
          <p className="text-md text-gray-600 tracking-wide mt-2 font-bold">
          Payment Failed
          </p>
          <p className="text-sm text-gray-600 tracking-wide mt-2">
          Try again!
          </p>
        </div>
      )}
    </div>
  </div>

  );
}

export default OrderPaymentSuccessPage;
