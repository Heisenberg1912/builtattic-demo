import React from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

const Buy = () => {
  const { id } = useParams();
  const DEMO_MESSAGE =
    "This is a demo, we are unable to serve you right now, apologies for the inconvenience caused!";

  const handleBuyNow = () => {
    toast(DEMO_MESSAGE, { duration: 4000, style: { maxWidth: "420px" } });
  };

  return (
    <div className="h-[89vh] bg-white flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <div className="w-full mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 text-center">
          {DEMO_MESSAGE}
        </div>
        <img
          src={`https://via.placeholder.com/200?text=Item+${id}`}
          alt={`Item ${id}`}
          className="mb-6 rounded-xl shadow-md"
        />
        <h1 className="text-3xl font-semibold mb-2 text-gray-900">Buy Item #{id}</h1>
        <p className="text-gray-500 mb-6 text-center">Experience premium quality and seamless design. Secure your purchase now.</p>

        {/* Product Details */}
        <div className="w-full mb-6">
          <div className="flex justify-between text-gray-700 mb-2">
            <span>Price:</span>
            <span className="font-bold">₹9,999</span>
          </div>
          <div className="flex justify-between text-gray-700 mb-2">
            <span>Color:</span>
            <span>White</span>
          </div>
          <div className="flex justify-between text-gray-700 mb-2">
            <span>Delivery:</span>
            <span>Free, 2-3 days</span>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="w-full flex items-center justify-between mb-6">
          <span className="text-gray-700">Quantity:</span>
          <input
            type="number"
            min="1"
            defaultValue={1}
            className="w-16 px-2 py-1 border rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Buy Now Button */}
        <button
          className="w-full py-3 bg-black text-white rounded-xl font-semibold text-lg shadow hover:bg-gray-800 transition mb-4"
          onClick={handleBuyNow}
        >
          Buy Now
        </button>

        {/* Payment Options */}
        <div className="w-full flex flex-col items-center mb-4">
          <span className="text-gray-500 mb-2">Or pay with</span>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 shadow hover:bg-gray-200 transition">UPI</button>
            <button className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 shadow hover:bg-gray-200 transition">Card</button>
            <button className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 shadow hover:bg-gray-200 transition">Netbanking</button>
          </div>
        </div>

        {/* Security & Guarantee */}
        <div className="w-full text-center text-xs text-gray-400 mt-2">
          <span>Secure payment • 7-day return policy • 1-year warranty</span>
        </div>
      </div>
    </div>
  );
};

export default Buy;
