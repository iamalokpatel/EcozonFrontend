"use client";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import CartItem from "@/components/CartItem";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const hasCheckedRef = useRef(false);
  const router = useRouter();

  const handleRemove = async (productId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await api.delete(`/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data.cart.items);
      window.location.reload();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleGoToPlaceCartOrder = async (item) => {
    if (item.length === 0) {
      alert("Add a product to the cart before placing an order.");
      return;
    }
    router.push("/placedOrders");
  };

  useEffect(() => {
    if (hasCheckedRef.current) return;
    hasCheckedRef.current = true;

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token) {
      alert("Please login to access the Cart");
      router.push("/users/login");
      return;
    }
    if (role !== "user") {
      alert("Unauthorized! Only User can access the Cart");
      router.push("/");
      return;
    }

    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      const res = await api.get("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data.items);
    };
    fetchCart();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 mt-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cartItems.map((item) => (
        <CartItem key={item._id} item={item} onRemove={handleRemove} />
      ))}
      <button
        onClick={handleGoToPlaceCartOrder}
        className="bg-orange-500 text-white font-semibold w-full py-3 rounded-md hover:bg-orange-600 transition duration-200"
      >
        Place Order
      </button>
    </div>
  );
};

export default CartPage;
