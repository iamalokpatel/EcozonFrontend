"use client";
import "./page.css";
import api from "@/utils/api";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const handleAddToCart = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await api.post(
        "/cart/add",
        { productId: id, quantity: 1 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const productExists = cart.find((item) => item.productId === id);

      if (!productExists) {
        cart.push({ productId: id, quantity: 1 });
      }
      router.push("/cart");
    } catch (error) {
      if (error.response?.data?.message === "Product already in cart") {
        alert("Product already in cart!");
      } else {
        alert("Something went wrong while adding to cart.");
        console.error("Add to cart error:", error);
      }
    }
  };

  const handleBuy = (id) => {
    router.push(`/buy/${id}`);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching project:", error);
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (!product)
    return <p className="text-center mt-10 text-red-500">Product not found!</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-80 object-cover"
        />
        <div className="p-6 space-y-4">
          <h1 className="text-2xl font-bold text-gray-800">{product.title}</h1>
          <h2 className="text-xl text-gray-600">{product.subtitle}</h2>
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
          <h3 className="text-xl font-semibold text-indigo-600">
            ${product.price}
          </h3>

          <div>
            <button
              onClick={() => handleAddToCart(product._id)}
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Add to Cart
            </button>

            <button
              onClick={() => handleBuy(product._id)}
              className="bg-green-500 text-white px-4 py-2 rounded ml-2 z-10"
            >
              Buy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
