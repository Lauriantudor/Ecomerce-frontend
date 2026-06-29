import React from "react";
import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    // CONTAINER CARD: Păstrăm bg-white curat pentru a pluti pe vanilie, dar schimbăm bordura într-una caldă (stone-200/60)
    <div className="bg-white dark:bg-zinc-900 border border-stone-200/60 dark:border-zinc-800 rounded-3xl p-4 flex flex-col justify-between h-full shadow-sm hover:border-stone-300 dark:hover:border-zinc-700/80 transition-all duration-300 group">
      <div>
        {/* Container Imagine */}
        <div className="w-full rounded-2xl overflow-hidden bg-stone-50 dark:bg-zinc-950 flex mb-4 border border-stone-200/40 dark:border-zinc-800/50">
          <img
            src={`http://localhost:3000${product.imageUrl}`}
            alt={product?.altImage || "Produs"}
            className="w-full aspect-square object-cover object-bottom-right rounded-2xl transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>

        <div className="flex flex-col items-center text-center space-y-1 px-1">
          {/* BADGE CATEGORIE: text mai închis (emerald-800) pe light pentru lizibilitate maximă peste crem */}
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-600/10 dark:bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-600/10 dark:border-emerald-500/20 mb-1">
            {product?.category?.name || "Popular"}
          </span>

          {/* TITLU: text-stone-900 (maro-negru închis, mult mai organic decât negrul pur) */}
          <h3 className="text-lg font-bold text-stone-900 dark:text-white tracking-tight line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {product?.name}
          </h3>

          {/* DESCRIERE: text-stone-500, o nuanță caldă de gri/maro stins */}
          <p className="text-stone-500 dark:text-zinc-400 text-xs line-clamp-2 min-h-8 leading-relaxed">
            {product?.description || "Fără descriere disponibilă."}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {/* PREȚ */}
        <div className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400 text-center tracking-tight">
          {product?.price} RON
        </div>

        {/* BUTON: Emerald pe Light Mode (asortat cu E-COMMERCE-ul tău verde), Blue pe Dark Mode */}
        <button
          onClick={() => navigate(`/product/${product.id}`)}
          className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold text-sm py-2.5 px-4 rounded-xl transition-all duration-200 active:scale-[0.98] cursor-pointer flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-600/20 dark:shadow-blue-600/10"
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
