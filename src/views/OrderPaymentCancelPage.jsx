import React from "react";
import { IconCircleXFilled } from '@tabler/icons-react';

function OrderPaymentCancelPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-xl px-10 py-8 flex flex-col justify-between h-[400px]">
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500">Oops! Something went wrong</p>
        </div>

        <div className="mx-auto text-center mb-6">
          <IconCircleXFilled className="text-red-500" size={150} />
          <p className="text-md text-gray-600 tracking-wide mt-2 font-bold">
          Payment Failed
          </p>
          <p className="text-sm text-gray-600 tracking-wide mt-2">
          Try again!
          </p>
        </div>

        <div></div>

      </div>
    </div>
  );
}

export default OrderPaymentCancelPage;
