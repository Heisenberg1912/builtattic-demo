import React from "react";
import { toast } from "react-hot-toast";
import { useCart } from "../context/CartContext";

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  const calculateTotal = () =>
    cartItems.reduce(
      (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
      0
    );

  const handleCheckout = () => {
    toast.success("Proceeding to checkout...");
    // Add checkout logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Cart</h1>

        {cartItems.length > 0 ? (
          <>
            {/* Cart Items */}
            <div className="divide-y divide-gray-200">
              {cartItems.map((item, idx) => (
                <div
                  key={item?.productId ?? item?.id ?? idx}
                  className="flex justify-between items-center py-6"
                >
                  {/* Left: image + details */}
                  <div className="flex items-center gap-6">
                    <img
                      src={item?.image || item?.img || "https://placehold.co/120"}
                      alt={item?.title || item?.name || "Item"}
                      className="w-24 h-24 rounded-xl object-cover border border-gray-200"
                    />
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">
                        {item?.title || item?.name || "Item"}
                      </h2>
                      <p className="text-gray-600 text-sm">
                        Price: ₹{Number(item?.price ?? 0)} / sq.ft
                      </p>
                      {/* Quantity Controls */}
                      <div className="flex items-center mt-3">
                        <button
                          onClick={() =>
                            updateQuantity(item, Math.max(1, (item?.quantity || 1) - 1))
                          }
                          className="px-3 py-1 border rounded-l-lg text-gray-700 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 border-t border-b text-gray-900 font-medium">
                          {item?.quantity || 1}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item, (item?.quantity || 1) + 1)
                          }
                          className="px-3 py-1 border rounded-r-lg text-gray-700 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item)}
                        className="text-red-500 text-sm mt-2 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Right: Subtotal */}
                  <p className="text-lg font-semibold text-gray-900">
                    ₹{Number(item?.price ?? 0) * Number(item?.quantity ?? 1)}
                  </p>
                </div>
              ))}
            </div>

            {/* Total + Checkout */}
            <div className="border-t border-gray-200 pt-6 mt-8 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Total</h2>
              <p className="text-2xl font-bold text-gray-900">
                ₹{calculateTotal()}
              </p>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
                onClick={() => toast("Continue shopping...")}
              >
                Continue Shopping
              </button>
              <button
                className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-medium"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-lg text-center py-20">
            Your cart is empty 🛒
          </p>
        )}
      </div>
    </div>
  );
};

export default CartPage;

