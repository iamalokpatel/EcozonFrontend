"use client";
import api from "@/utils/api";
import { useEffect, useState } from "react";
import ProjectCard from "@/components/ProductCard";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState("");
  const [products, setProducts] = useState([]);

  // Fetch categories on first load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/products/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products when category changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let res;
        if (!selected) {
          // Fetch all products when no category selected
          res = await api.get("/products");
        } else {
          // Fetch products filtered by category
          res = await api.get("/products/categories", {
            params: { category: selected.toLowerCase() },
          });
        }
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to load products", err);
      }
    };

    fetchProducts();
  }, [selected]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Category Navbar */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setSelected("")}
          className={`px-4 py-2 rounded-full border ${
            selected === ""
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          All Data
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelected(cat)}
            className={`px-4 py-2 rounded-full border capitalize ${
              selected === cat
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product List */}
      {products.length === 0 ? (
        <p className="text-gray-500 text-center col-span-full">
          No products found in this category.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products
            .filter(
              (product) =>
                product && (product._id || (product.title && product.price))
            )
            .map((product, index) => (
              <div
                key={
                  product._id ||
                  `${product.title}-${product.price}` ||
                  `fallback-${index}`
                }
                className="rounded p-4 transition"
              >
                <ProjectCard key={product._id} product={product} />
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
