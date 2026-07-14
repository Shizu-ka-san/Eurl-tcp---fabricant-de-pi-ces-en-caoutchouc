import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Product, Category } from "../types";
import { 
  CheckCircle2, 
  X, 
  FileSpreadsheet, 
  Layers, 
  Shield, 
  Boxes, 
  Settings,
  ArrowRight
} from "lucide-react";
import BorderGlow from "./BorderGlow";

interface ProductCardProps {
  product: Product;
  categories: Category[];
  onNavigateToQuote: (material: string) => void;
  theme?: "light" | "oled";
}

export default function ProductCard({ product, categories, onNavigateToQuote, theme = "light" }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isOled = theme === "oled";

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  // Match category label
  const categoryLabel = categories.find((c) => c.id === product.category)?.label || product.category;

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        <BorderGlow
          edgeSensitivity={30}
          glowColor={isOled ? "24 100 50" : "24 95 70"}
          backgroundColor={isOled ? "#000000" : "#ffffff"}
          borderRadius={16}
          glowRadius={45}
          glowIntensity={isOled ? 1.5 : 1.0}
          coneSpread={25}
          animated={false}
          colors={isOled ? ["#ea580c", "#c2410c", "#7c2d12"] : ["#ea580c", "#fb923c", "#fcd34d"]}
          className="h-full w-full"
        >
          <div 
            className={`p-6 flex flex-col justify-between h-full group relative bg-transparent overflow-hidden ${
              isOled ? "text-white" : "text-neutral-900"
            }`}
          >
            {/* Subtle orange top accent bar on hover */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-orange-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />

            <div className="space-y-4">
              {/* Product Image */}
              <div className={`h-48 w-full overflow-hidden relative border rounded-lg ${
                isOled ? "bg-zinc-950 border-zinc-800/80" : "bg-neutral-50 border-neutral-200/80"
              }`}>
                {!imgError && product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover select-none transform group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className={`w-full h-full flex flex-col items-center justify-center relative ${
                    isOled ? "bg-gradient-to-br from-zinc-900 to-black text-zinc-400" : "bg-gradient-to-br from-neutral-50 to-neutral-100 text-neutral-500"
                  }`}>
                    <div className={`absolute inset-0 opacity-[0.03] ${
                      isOled ? "bg-[radial-gradient(#ffffff_1px,transparent_1px)]" : "bg-[radial-gradient(#1a1a1a_1px,transparent_1px)]"
                    } [background-size:16px_16px]`} />
                    <Layers className={`w-10 h-10 mb-2 ${isOled ? "text-orange-500/60" : "text-neutral-300"}`} />
                    <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-center px-4">
                      Pièce Technique Caoutchouc
                    </span>
                    <span className="text-[8px] font-mono uppercase text-zinc-500 tracking-wider mt-1 text-center">
                      {categoryLabel}
                    </span>
                  </div>
                )}
                {/* Premium industrial indicator badge */}
                <span className={`absolute top-3 left-3 text-[9px] font-mono tracking-widest px-2.5 py-1 uppercase rounded-full border shadow-sm font-semibold select-none ${
                  isOled 
                    ? "bg-black/90 text-orange-500 border-orange-950" 
                    : "bg-neutral-900/85 text-white border-white/10"
                }`}>
                  Série
                </span>
              </div>

              {/* Category tag & series info row */}
              <div className="flex justify-between items-center text-xs">
                <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded font-bold border ${
                  isOled 
                    ? "text-orange-400 bg-orange-950/30 border-orange-900/50" 
                    : "text-orange-700 bg-orange-50 border-orange-100/80"
                }`}>
                  {categoryLabel}
                </span>
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                  isOled 
                    ? "text-zinc-400 bg-zinc-900/80 border-zinc-800" 
                    : "text-neutral-400 bg-neutral-100 border-transparent"
                }`}>
                  {product.specs.series || "Réf. Standard"}
                </span>
              </div>

              {/* Product Name */}
              <h3 className={`font-serif font-black text-xl transition-colors tracking-tight leading-snug ${
                isOled 
                  ? "text-white group-hover:text-orange-500" 
                  : "text-neutral-900 group-hover:text-orange-600"
              }`}>
                {product.name}
              </h3>

              {/* Short Description */}
              <p className={`text-sm leading-relaxed font-light line-clamp-3 ${
                isOled ? "text-zinc-300" : "text-neutral-600"
              }`}>
                {product.description}
              </p>

              {/* Specs Small summary row - Bento micro cards */}
              <div className={`pt-4 border-t grid grid-cols-2 gap-3 ${isOled ? "border-zinc-800/80" : "border-neutral-100"}`}>
                <div className={`border rounded-lg p-2.5 flex items-center gap-2.5 ${
                  isOled ? "bg-zinc-900/50 border-zinc-800/80" : "bg-neutral-50/70 border-neutral-100/60"
                }`}>
                  <Shield className="w-4 h-4 text-orange-600 shrink-0" />
                  <div className="min-w-0">
                    <span className={`block text-[9px] font-mono uppercase tracking-wider font-semibold ${
                      isOled ? "text-zinc-500" : "text-neutral-450"
                    }`}>Dureté</span>
                    <span className={`text-xs font-mono font-bold truncate block ${
                      isOled ? "text-zinc-250" : "text-neutral-800"
                    }`}>{product.specs.hardness}</span>
                  </div>
                </div>
                <div className={`border rounded-lg p-2.5 flex items-center gap-2.5 ${
                  isOled ? "bg-zinc-900/50 border-zinc-800/80" : "bg-neutral-50/70 border-neutral-100/60"
                }`}>
                  <Boxes className="w-4 h-4 text-orange-600 shrink-0" />
                  <div className="min-w-0">
                    <span className={`block text-[9px] font-mono uppercase tracking-wider font-semibold ${
                      isOled ? "text-zinc-500" : "text-neutral-450"
                    }`}>Matières</span>
                    <span className={`text-xs font-mono font-bold truncate block ${
                      isOled ? "text-zinc-250" : "text-neutral-800"
                    }`} title={product.specs.materials.join(", ")}>
                      {product.specs.materials.join(", ")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Expand button */}
            <div className={`mt-6 pt-4 border-t ${isOled ? "border-zinc-800/80" : "border-neutral-100"}`}>
              <button
                id={`btn-open-modal-${product.id}`}
                onClick={() => setIsModalOpen(true)}
                className={`w-full py-2.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all border cursor-pointer ${
                  isOled
                    ? "bg-zinc-900 hover:bg-zinc-850 text-zinc-100 border-zinc-800 hover:border-zinc-700"
                    : "bg-white hover:bg-neutral-50 text-neutral-850 border-neutral-200 hover:border-neutral-400"
                }`}
              >
                <span>Fiche Technique Complète</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isOled ? "text-orange-500" : "text-orange-600"}`} />
              </button>
            </div>
          </div>
        </BorderGlow>
      </motion.div>

      {/* Modal Backdrop and Window using React Portal */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[9999] overflow-y-auto font-sans">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="fixed inset-0 bg-black/80 backdrop-blur-md"
              />

              {/* Modal Container */}
              <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 md:p-8 relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
                  className={`relative w-full max-w-4xl rounded-2xl shadow-2xl border overflow-hidden p-6 sm:p-8 md:p-10 z-10 ${
                    isOled 
                      ? "bg-[#000000] border-zinc-800 text-white" 
                      : "bg-white border-neutral-200 text-neutral-900"
                  }`}
                >
                  {/* Header pattern or glow lines */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500" />

                  {/* Close Button */}
                  <button
                    id={`btn-close-modal-${product.id}`}
                    onClick={() => setIsModalOpen(false)}
                    className={`absolute top-4 right-4 p-2 rounded-full border transition-all hover:rotate-90 duration-300 cursor-pointer ${
                      isOled 
                        ? "bg-zinc-950 text-zinc-400 hover:text-white border-zinc-800 hover:border-zinc-700" 
                        : "bg-neutral-50 text-neutral-500 hover:text-neutral-900 border-neutral-200 hover:border-neutral-300"
                    }`}
                    aria-label="Fermer"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Modal Grid Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 mt-4">
                    
                    {/* Left Column (Image & Overview) */}
                    <div className="md:col-span-5 space-y-6">
                      {/* Image Area */}
                      <div className={`aspect-square w-full overflow-hidden relative border rounded-xl flex items-center justify-center ${
                        isOled ? "bg-zinc-950 border-zinc-800/80" : "bg-neutral-50 border-neutral-200/80"
                      }`}>
                        {!imgError && product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover select-none"
                            referrerPolicy="no-referrer"
                            onError={() => setImgError(true)}
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center p-6 text-center">
                            <Layers className={`w-14 h-14 mb-3 ${isOled ? "text-orange-500/60" : "text-neutral-300"}`} />
                            <span className="text-xs font-mono uppercase tracking-widest font-bold">
                              TCP Caoutchouc
                            </span>
                            <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider mt-1">
                              {categoryLabel}
                            </span>
                          </div>
                        )}
                        <span className={`absolute top-4 left-4 text-[10px] font-mono tracking-widest px-3 py-1.5 uppercase rounded-full border shadow-sm font-bold ${
                          isOled 
                            ? "bg-black/90 text-orange-500 border-orange-950" 
                            : "bg-neutral-950 text-white border-white/10"
                        }`}>
                          SÉRIE INDUSTRIELLE
                        </span>
                      </div>

                      {/* About Section */}
                      <div className="space-y-3">
                        <span className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2.5 py-1 rounded border inline-block ${
                          isOled 
                            ? "text-orange-400 bg-orange-950/30 border-orange-900/50" 
                            : "text-orange-700 bg-orange-50 border-orange-100"
                        }`}>
                          {categoryLabel}
                        </span>
                        <h3 className="font-serif font-black text-2xl sm:text-3xl tracking-tight leading-tight">
                          {product.name}
                        </h3>
                        <p className={`text-sm leading-relaxed font-light ${
                          isOled ? "text-zinc-300" : "text-neutral-600"
                        }`}>
                          {product.description}
                        </p>
                      </div>
                    </div>

                    {/* Right Column (Technical Specifications / Bento-Style) */}
                    <div className="md:col-span-7 flex flex-col justify-between space-y-6">
                      <div className="space-y-6">
                        
                        {/* Section Title */}
                        <div className="border-b pb-2 border-zinc-800">
                          <h4 className={`text-xs font-mono font-bold uppercase tracking-widest ${
                            isOled ? "text-orange-500" : "text-orange-700"
                          }`}>
                            FICHE TECHNIQUE COMPLETE
                          </h4>
                        </div>

                        {/* Specifications Grid - Bento Grid Cards */}
                        <div className="grid grid-cols-2 gap-4">
                          {/* Dureté */}
                          <div className={`border rounded-xl p-4 flex items-start gap-3.5 transition-colors ${
                            isOled ? "bg-zinc-950/70 border-zinc-800/80 hover:border-zinc-700" : "bg-neutral-50/70 border-neutral-100 hover:border-neutral-200"
                          }`}>
                            <Shield className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                            <div>
                              <span className={`block text-[10px] font-mono uppercase tracking-wider font-semibold ${
                                isOled ? "text-zinc-500" : "text-neutral-400"
                              }`}>Dureté</span>
                              <span className="text-sm font-bold font-mono tracking-tight">{product.specs.hardness}</span>
                            </div>
                          </div>

                          {/* Matières */}
                          <div className={`border rounded-xl p-4 flex items-start gap-3.5 transition-colors ${
                            isOled ? "bg-zinc-950/70 border-zinc-800/80 hover:border-zinc-700" : "bg-neutral-50/70 border-neutral-100 hover:border-neutral-200"
                          }`}>
                            <Boxes className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                            <div>
                              <span className={`block text-[10px] font-mono uppercase tracking-wider font-semibold ${
                                isOled ? "text-zinc-500" : "text-neutral-400"
                              }`}>Matières</span>
                              <span className="text-sm font-bold font-mono tracking-tight">{product.specs.materials.join(", ")}</span>
                            </div>
                          </div>

                          {/* Tolérances */}
                          <div className={`border rounded-xl p-4 flex items-start gap-3.5 transition-colors ${
                            isOled ? "bg-zinc-950/70 border-zinc-800/80 hover:border-zinc-700" : "bg-neutral-50/70 border-neutral-100 hover:border-neutral-200"
                          }`}>
                            <Settings className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                            <div>
                              <span className={`block text-[10px] font-mono uppercase tracking-wider font-semibold ${
                                isOled ? "text-zinc-500" : "text-neutral-400"
                              }`}>Tolérance Précision</span>
                              <span className="text-sm font-bold font-mono tracking-tight">{product.specs.tolerances}</span>
                            </div>
                          </div>

                          {/* Volume/Séries */}
                          <div className={`border rounded-xl p-4 flex items-start gap-3.5 transition-colors ${
                            isOled ? "bg-zinc-950/70 border-zinc-800/80 hover:border-zinc-700" : "bg-neutral-50/70 border-neutral-100 hover:border-neutral-200"
                          }`}>
                            <Layers className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                            <div>
                              <span className={`block text-[10px] font-mono uppercase tracking-wider font-semibold ${
                                isOled ? "text-zinc-500" : "text-neutral-400"
                              }`}>Volume de Série</span>
                              <span className="text-sm font-bold font-mono tracking-tight">{product.specs.series || "Moyennes & Grandes séries"}</span>
                            </div>
                          </div>
                        </div>

                        {/* Points Forts du Produit */}
                        <div className="space-y-3">
                          <h4 className={`text-xs font-mono font-bold uppercase tracking-wider ${
                            isOled ? "text-zinc-400" : "text-neutral-500"
                          }`}>
                            Points Forts de Conception :
                          </h4>
                          <ul className="grid grid-cols-1 gap-2.5">
                            {product.features.map((feat, idx) => (
                              <li 
                                key={idx} 
                                className={`flex items-start gap-3 border rounded-lg p-3 transition-colors ${
                                  isOled ? "bg-zinc-900/30 border-zinc-800/40 hover:border-zinc-800/80" : "bg-neutral-50/50 border-neutral-100 hover:border-neutral-200/60"
                                }`}
                              >
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                <span className={`text-xs font-light leading-relaxed ${isOled ? "text-zinc-300" : "text-neutral-700"}`}>
                                  {feat}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Secteurs d'Applications */}
                        <div className="space-y-3">
                          <h4 className={`text-xs font-mono font-bold uppercase tracking-wider ${
                            isOled ? "text-zinc-400" : "text-neutral-500"
                          }`}>
                            Secteurs d'Application Industrielle :
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {product.applications.map((app, idx) => (
                              <span
                                key={idx}
                                className={`text-xs font-mono border px-3 py-1.5 rounded-lg transition-all ${
                                  isOled 
                                    ? "bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800 hover:text-white" 
                                    : "bg-neutral-100 text-neutral-600 border border-neutral-200 hover:bg-neutral-200 hover:text-neutral-900"
                                }`}
                              >
                                {app}
                              </span>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Footer CTA */}
                      <div className="pt-6">
                        <button
                          id={`btn-modal-quote-shortcut-${product.id}`}
                          onClick={() => {
                            setIsModalOpen(false);
                            onNavigateToQuote(product.specs.materials[0]);
                          }}
                          className="w-full py-4 bg-[#EA580C] hover:bg-[#F97316] active:scale-98 text-white font-bold text-sm uppercase tracking-widest transition-all rounded-xl cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-orange-600/10 hover:shadow-orange-600/20"
                        >
                          <FileSpreadsheet className="w-4 h-4 text-white" />
                          <span>Obtenir un Devis de Série</span>
                        </button>
                      </div>

                    </div>

                  </div>

                </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
