"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/utils/api";

const BuyPage = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode"); // 'single' or 'cart'
  const productId = searchParams.get("productId");
  const [product, setProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (mode === "single" && productId) {
      api.get(`/products/${productId}`).then((res) => setProduct(res.data));
    } else if (mode === "cart") {
      api
        .get("/cart", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setCartItems(res.data.items));
    }
  }, [mode, productId]);

  const handleConfirmOrder = async () => {
    const token = localStorage.getItem("token");

    try {
      if (mode === "single" && productId) {
        await api.post(
          "/orders",
          { productId, address },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else if (mode === "cart") {
        await api.post(
          "/orders/cart",
          { address },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setSuccess("Order placed successfully!");
      setTimeout(() => router.push("/orders"), 1000);
    } catch (err) {
      console.error("Order error:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">
        {mode === "single" ? `Buy ${product?.title}` : "Buy All Cart Items"}
      </h2>

      {mode === "single" && product && (
        <p className="mb-2">Price: ₹{product.price}</p>
      )}

      {mode === "cart" &&
        cartItems.map((item) => (
          <div key={item._id} className="mb-2">
            <p>
              {item.product.title} - ₹{item.product.price} × {item.quantity}
            </p>
          </div>
        ))}

      <textarea
        className="w-full border p-2 mt-4"
        placeholder="Enter your address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <button
        onClick={handleConfirmOrder}
        className="bg-green-600 text-white px-4 py-2 mt-4 rounded"
      >
        Confirm Order
      </button>

      {success && <p className="text-green-600 mt-4">{success}</p>}
    </div>
  );
};

export default BuyPage;
