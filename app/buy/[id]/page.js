"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

const BuyPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [address, setAddress] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
    };
    if (id) fetchProduct();
  }, [id]);

  const handleBuy = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await api.post(
        "/orders",
        { productId: id, address },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Orders placed successfully!");
      setTimeout(() => {
        router.push("/orders");
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Buy {product.title}</h2>
      <p>Price: ₹{product.price}</p>
      <textarea
        className="w-full border p-2 mt-4"
        placeholder="Enter your address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button
        onClick={handleBuy}
        className="bg-green-600 text-white px-4 py-2 mt-4 rounded"
      >
        Confirm Order
      </button>

      {success && <p className="text-green-600 mt-4">{success}</p>}
    </div>
  );
};

export default BuyPage;
