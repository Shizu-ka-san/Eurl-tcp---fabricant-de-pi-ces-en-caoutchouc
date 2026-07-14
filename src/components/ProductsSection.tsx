import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Product, Category } from "../types";
import { Search, SlidersHorizontal, Layers } from "lucide-react";
import ProductCard from "./ProductCard";

interface ProductsSectionProps {
  products: Product[];
  categories: Category[];
  onNavigateToQuote: (material: string) => void;
  theme?: "light" | "oled";
}

export default function ProductsSection({ 
  products, 
  categories, 
  onNavigateToQuote, 
  theme = "light" 
}: ProductsSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const isOled = theme === "oled";

  const filterCategories = [
    { id: "all", label: "Toutes les Pièces" },
    ...categories,
  ];

  // Filtering products based on category & search terms (name, materials, applications, description)
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.specs.materials.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase())) ||
      product.applications.some((app) => app.toLowerCase().includes(searchQuery.toLowerCase())) ||
      product.features.some((feat) => feat.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <section 
      id="produits" 
      className={`py-20 bg-transparent border-t relative transition-colors duration-300 ${
        isOled ? "border-zinc-900" : "border-[#1A1A1A]/10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className={`text-left max-w-3xl space-y-4 mb-16 border-l-4 pl-6 ${
          isOled ? "border-orange-600" : "border-[#1A1A1A]"
        }`}>
          <span className={`text-xs uppercase tracking-[0.2em] font-mono font-bold ${
            isOled ? "text-orange-500/70" : "text-[#1A1A1A]/50"
          }`}>
            PRODUITS
          </span>
          <h2 className={`font-serif italic text-3xl sm:text-5xl tracking-tight ${
            isOled ? "text-white" : "text-[#1A1A1A]"
          }`}>
            Notre Catalogue de Pièces Techniques en Caoutchouc
          </h2>
          <p className={`text-lg leading-relaxed font-light ${
            isOled ? "text-zinc-300" : "text-[#1A1A1A]/70"
          }`}>
            Eurl TCP fabrique une vaste gamme d'articles de précision, optimisés pour les moyennes et grandes séries industrielles selon des processus de contrôle rigoureux.
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className={`border p-4 sm:p-6 mb-12 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between gap-6 ${
          isOled ? "bg-[#0C0C0E] border-zinc-800" : "bg-white border-[#1A1A1A]/10"
        }`}>
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
              isOled ? "text-zinc-500" : "text-[#1A1A1A]/40"
            }`} />
            <input
              id="product-search-input"
              type="text"
              placeholder="Rechercher par pièce, matière (EPDM, NBR, FKM...) ou application..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-11 pr-4 py-3 text-sm focus:outline-none transition-all border ${
                isOled 
                  ? "bg-black border-zinc-800 text-white placeholder-zinc-500 focus:border-orange-600" 
                  : "bg-[#F9F9F7] border-[#1A1A1A]/10 focus:border-[#1A1A1A] text-[#1A1A1A] placeholder-[#1A1A1A]/40"
              }`}
            />
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className={`text-xs font-mono flex items-center gap-1.5 mr-2 ${
              isOled ? "text-zinc-400" : "text-[#1A1A1A]/60"
            }`}>
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filtrer :</span>
            </div>
            {filterCategories.map((cat) => (
              <button
                key={cat.id}
                id={`filter-chip-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs font-bold tracking-wider uppercase transition-all border cursor-pointer ${
                  selectedCategory === cat.id
                    ? isOled
                      ? "bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-950/20"
                      : "bg-[#1A1A1A] text-[#F9F9F7] border-[#1A1A1A]"
                    : isOled
                      ? "bg-transparent text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:text-white"
                      : "bg-transparent text-[#1A1A1A] border-[#1A1A1A]/10 hover:border-[#1A1A1A]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categories={categories}
                onNavigateToQuote={onNavigateToQuote}
                theme={theme}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state when no products match searchQuery */}
        {filteredProducts.length === 0 && (
          <div className={`text-center py-16 max-w-lg mx-auto border ${
            isOled ? "bg-[#0C0C0E] border-zinc-800 text-white" : "bg-white border-[#1A1A1A]/10 text-[#1A1A1A]"
          }`}>
            <Layers className={`w-12 h-12 mx-auto mb-4 ${
              isOled ? "text-orange-500/50" : "text-[#1A1A1A]/30"
            }`} />
            <h3 className="text-lg font-bold mb-2 font-serif">Aucune pièce ne correspond à votre recherche</h3>
            <p className={`text-sm px-6 font-light ${
              isOled ? "text-zinc-400" : "text-[#1A1A1A]/70"
            }`}>
              Notre bureau d'études peut fabriquer n'importe quelle pièce complexe sur mesure. Consultez notre assistant IA ou décrivez votre besoin directement dans le formulaire de devis.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
