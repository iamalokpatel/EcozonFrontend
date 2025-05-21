"use client";
import React from "react";

const CartItem = ({ item, onRemove }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 mb-4 flex items-center justify-between border border-gray-200">
      <div className="flex items-center space-x-4">
        <img
          src={item.product.image}
          alt={item.product.title}
          className="w-20 h-20 object-cover rounded-lg border"
        />
        <div>
          <h4 className="font-semibold text-lg">{item.product.title}</h4>
          <p className="text-gray-600 text-sm">₹{item.product.price}</p>
        </div>
      </div>
      <button
        onClick={() => onRemove(item.product._id)}
        className="text-red-500 hover:text-red-700 font-medium"
      >
        Remove
      </button>
    </div>
  );
};

export default CartItem;
