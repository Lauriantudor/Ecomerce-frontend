import React from "react";
import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 flex flex-col justify-between h-full shadow-lg hover:border-zinc-700/80 transition-all duration-300 group">
      <div>
        {/* Container Imagine - Edge to Edge cu rotunjire internă premium */}
        <div className="w-full rounded-2xl overflow-hidden bg-zinc-950 flex mb-4 border border-zinc-800/50">
          <img
            src={`http://localhost:3000${product.imageUrl}`}
            alt={product?.name || "Produs"}
            className="w-full aspect-square object-cover object-bottom-right rounded-2xl transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>

        <div className="flex flex-col items-center text-center space-y-1 px-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 mb-1">
            {product?.category?.name || "Popular"}
          </span>

          <h3 className="text-lg font-bold text-white tracking-tight line-clamp-1 group-hover:text-emerald-400 transition-colors">
            {product?.name}
          </h3>

          <p className="text-zinc-400 text-xs line-clamp-2 min-h-8 leading-relaxed">
            {product?.description || "Fără descriere disponibilă."}
          </p>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        <div className="text-xl font-extrabold text-emerald-400 text-center tracking-tight">
          {product?.price} RON
        </div>

        <button
          onClick={() => navigate(`/product/${product.id}`)}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm py-2.5 px-4 rounded-xl transition-all duration-200 active:scale-[0.98] cursor-pointer flex items-center justify-center space-x-1.5 shadow-md shadow-blue-600/10"
        >
          <span>Vezi detalii</span>
          <svg
            className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
