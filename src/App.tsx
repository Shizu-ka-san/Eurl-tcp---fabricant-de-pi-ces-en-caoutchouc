import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductsSection from "./components/ProductsSection";
import TechnologySection from "./components/TechnologySection";
import MaterialsGuide from "./components/MaterialsGuide";
import BureauEtudesAI from "./components/BureauEtudesAI";
import QuoteForm from "./components/QuoteForm";
import Footer from "./components/Footer";
import LineWaves from "./components/LineWaves";
import TcpLogo from "./components/TcpLogo";
import AdminModal from "./components/AdminModal";
import { PRODUCTS, INITIAL_CATEGORIES } from "./data";
import { Product, Category } from "./types";

export default function App() {
  const [activeSection, setActiveSection] = useState("accueil");
  const [initialMaterialForQuote, setInitialMaterialForQuote] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [theme, setTheme] = useState<"light" | "oled">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("tcp_theme") as "light" | "oled") || "light";
    }
    return "light";
  });

  // Apply theme class to document element
  useEffect(() => {
    localStorage.setItem("tcp_theme", theme);
    if (theme === "oled") {
      document.documentElement.classList.add("theme-oled");
    } else {
      document.documentElement.classList.remove("theme-oled");
    }
  }, [theme]);

  // Fetch initial data from server
  useEffect(() => {
    const fetchCatalog = async () => {
      setIsLoading(true);
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/products")
        ]);

        if (categoriesRes.ok) {
          const cats = await categoriesRes.json();
          setCategories(cats);
        } else {
          const savedCats = localStorage.getItem("tcp_catalog_categories");
          setCategories(savedCats ? JSON.parse(savedCats) : INITIAL_CATEGORIES);
        }

        if (productsRes.ok) {
          const prods = await productsRes.json();
          setProducts(prods);
        } else {
          const savedProds = localStorage.getItem("tcp_catalog_products");
          setProducts(savedProds ? JSON.parse(savedProds) : PRODUCTS);
        }
      } catch (err) {
        console.error("Échec de connexion aux endpoints de l'API. Utilisation du localStorage/Données initiales.");
        const savedCats = localStorage.getItem("tcp_catalog_categories");
        setCategories(savedCats ? JSON.parse(savedCats) : INITIAL_CATEGORIES);
        
        const savedProds = localStorage.getItem("tcp_catalog_products");
        setProducts(savedProds ? JSON.parse(savedProds) : PRODUCTS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCatalog();
  }, []);

  // Sync to local storage as secondary backup
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("tcp_catalog_products", JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem("tcp_catalog_categories", JSON.stringify(categories));
    }
  }, [categories]);

  const handleAddCategory = async (newCat: Category) => {
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCat)
      });
      if (res.ok) {
        const saved = await res.json();
        setCategories(prev => {
          const exists = prev.some(c => c.id === saved.id);
          if (exists) {
            return prev.map(c => c.id === saved.id ? saved : c);
          } else {
            return [...prev, saved];
          }
        });
      } else {
        setCategories(prev => {
          const exists = prev.some(c => c.id === newCat.id);
          if (exists) {
            return prev.map(c => c.id === newCat.id ? newCat : c);
          } else {
            return [...prev, newCat];
          }
        });
      }
    } catch (err) {
      setCategories(prev => {
        const exists = prev.some(c => c.id === newCat.id);
        if (exists) {
          return prev.map(c => c.id === newCat.id ? newCat : c);
        } else {
          return [...prev, newCat];
        }
      });
    }
  };

  const handleDeleteCategory = async (catId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/categories/${catId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setCategories(prev => prev.filter(c => c.id !== catId));
        setProducts(prev => prev.filter(p => p.category !== catId));
        return true;
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("Échec de la suppression de la catégorie :", errorData.error);
        alert(`Impossible de supprimer la catégorie : ${errorData.error || "Erreur serveur"}`);
        return false;
      }
    } catch (err: any) {
      console.error("Erreur réseau lors de la suppression de la catégorie :", err);
      alert(`Erreur réseau lors de la suppression : ${err.message}`);
      return false;
    }
  };

  const handleAddProduct = async (newProduct: Product) => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct)
      });
      if (res.ok) {
        const saved = await res.json();
        setProducts(prev => [saved, ...prev]);
      } else {
        setProducts(prev => [newProduct, ...prev]);
      }
    } catch (err) {
      setProducts(prev => [newProduct, ...prev]);
    }
  };

  const handleDeleteProduct = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        return true;
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("Échec de la suppression :", errorData.error);
        return false;
      }
    } catch (err: any) {
      console.error("Erreur réseau lors de la suppression :", err);
      return false;
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct)
      });
      if (res.ok) {
        const saved = await res.json();
        setProducts(prev => prev.map(p => p.id === saved.id ? saved : p));
      } else {
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      }
    } catch (err) {
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    }
  };

  const isManualScrolling = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollActionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Disable automatic browser scroll restoration so we can control it fully
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    
    // Force immediate scroll on initial load
    window.scrollTo(0, 0);

    // Simulate initial asset & WebGL loader
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2400);
    return () => {
      clearTimeout(timer);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (scrollActionTimeoutRef.current) clearTimeout(scrollActionTimeoutRef.current);
    };
  }, []);

  // Force landing on the absolute top of the page (accueil section) when the preloader ends
  useEffect(() => {
    if (!isLoading) {
      // Immediate scroll reset
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      setActiveSection("accueil");

      // Double reset with requestAnimationFrame to ensure layout shifts are fully settled
      const forceScrollTop = () => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" as any });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      };

      requestAnimationFrame(forceScrollTop);
      
      // Secondary fallback scroll-to-top after 50ms and 150ms
      const t1 = setTimeout(forceScrollTop, 50);
      const t2 = setTimeout(forceScrollTop, 150);
      
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [isLoading]);

  const handleNavigate = (sectionId: string) => {
    // Prevent scroll event listener from snapping and interrupting sliding animation during smooth scroll
    isManualScrolling.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    if (scrollActionTimeoutRef.current) clearTimeout(scrollActionTimeoutRef.current);
    
    // Update state instantly so navigation bar slides immediately without blocking
    setActiveSection(sectionId);
    
    // Jump smooth to section with a small delay (100ms) to let Framer Motion begin animation on an idle CPU thread
    scrollActionTimeoutRef.current = setTimeout(() => {
      const targetElement = document.getElementById(sectionId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);

    // Release scroll lock after smooth scroll completes (around 1000ms from start)
    scrollTimeoutRef.current = setTimeout(() => {
      isManualScrolling.current = false;
    }, 1000);
  };

  const handleNavigateToQuote = (recommendedMaterial: string) => {
    // Extract raw polymer name (e.g. NBR, EPDM)
    const cleanMat = recommendedMaterial.split(" ")[0];
    setInitialMaterialForQuote(cleanMat);
    handleNavigate("contact");
  };

  // Synchronize scrolling with navigation indicators
  useEffect(() => {
    const handleScroll = () => {
      if (isManualScrolling.current) return;
      
      const sections = ["accueil", "produits", "technologie", "materiaux", "bureau-etudes", "contact"];
      const scrollPosition = window.scrollY + 150;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`min-h-screen bg-transparent transition-colors duration-300 flex flex-col justify-between relative z-20 ${
      theme === "oled" 
        ? "text-[#F9F9F7] selection:bg-[#F9F9F7] selection:text-[#000000]" 
        : "text-[#1A1A1A] selection:bg-[#1A1A1A] selection:text-[#F9F9F7]"
    }`}>
      {/* Dynamic Preloader Splash Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.65, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center select-none bg-transparent"
          >
            {/* Absolute solid background color layer inside preloader */}
            <div className={`absolute inset-0 z-0 transition-colors duration-300 ${theme === "oled" ? "bg-[#000000]" : "bg-[#F9F9F7]"}`} />

            {/* WebGL Interactive Line Wave Background inside loader */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              <LineWaves
                speed={0.16}
                brightness={theme === "oled" ? 0.75 : 0.18}
                color1={theme === "oled" ? "#FFFFFF" : "#1A1A1A"}
                color2="#EA580C"
                color3={theme === "oled" ? "#D4D4D8" : "#9CA3AF"}
                warpIntensity={0.8}
                innerLineCount={38}
                outerLineCount={42}
                rotation={-35}
                enableMouseInteraction={false}
              />
            </div>

            <div className="flex flex-col items-center gap-6 text-center max-w-sm px-6 relative z-20">
              {/* Sized logo showcasing full floating animation */}
              <div id="preloader-logo">
                <TcpLogo className="w-48 h-48 drop-shadow-2xl" holeColor={theme === "oled" ? "#000000" : "#F9F9F7"} />
              </div>
              
              <div className="space-y-2 mt-2">
                <h1 className={`font-serif font-black text-4xl italic tracking-tight ${theme === "oled" ? "text-[#F9F9F7]" : "text-[#1A1A1A]"}`}>
                  Eurl <span className="not-italic font-sans font-extrabold tracking-tighter text-orange-600">TCP</span>
                </h1>
                <p className={`text-[10px] font-mono tracking-[0.25em] uppercase font-bold ${theme === "oled" ? "text-[#F9F9F7]/60" : "text-[#1A1A1A]/60"}`}>
                  Manufacture de Caoutchouc Technique
                </p>
              </div>

              {/* Progress dynamic line indicator */}
              <div className={`w-56 h-[3px] rounded-full overflow-hidden mt-6 relative ${theme === "oled" ? "bg-zinc-800" : "bg-[#1A1A1A]/10"}`}>
                <motion.div
                  initial={{ left: "-100%" }}
                  animate={{ left: "100%" }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.6,
                    ease: "easeInOut",
                  }}
                  className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full"
                />
              </div>
              
              <p className="text-[9px] text-neutral-400 font-mono tracking-widest uppercase mt-2">
                Chargement de l'usine...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed background solid color layer */}
      <div className={`fixed inset-0 transition-colors duration-300 z-0 ${theme === "oled" ? "bg-[#000000]" : "bg-[#F9F9F7]"}`} />

      {/* WebGL Interactive Line Wave Background */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        <LineWaves
          speed={0.12}
          brightness={theme === "oled" ? 0.75 : 0.15}
          color1={theme === "oled" ? "#FFFFFF" : "#1A1A1A"}
          color2="#EA580C"
          color3={theme === "oled" ? "#D4D4D8" : "#9CA3AF"}
          warpIntensity={0.8}
          innerLineCount={38}
          outerLineCount={42}
          rotation={-35}
          enableMouseInteraction={true}
          mouseInfluence={2.8}
        />
      </div>

      {/* Structural Glassmorphic Navbar */}
      <Navbar 
        activeSection={activeSection} 
        onNavigate={handleNavigate} 
        theme={theme}
        onThemeToggle={() => setTheme(prev => prev === "light" ? "oled" : "light")}
      />

      <main className="flex-1">
        {/* HERO Landing */}
        <div id="accueil">
          <Hero onNavigate={handleNavigate} theme={theme} />
        </div>

        {/* PRODUCTS Catalog */}
        <ProductsSection products={products} categories={categories} onNavigateToQuote={handleNavigateToQuote} theme={theme} />

        {/* PARC MACHINES & Technology Showcase */}
        <TechnologySection />

        {/* ELASTOMERS Chemistry Lookup Guide */}
        <MaterialsGuide theme={theme} />

        {/* SMART BUREAU D'ETUDES (Gemini Integration) */}
        <BureauEtudesAI theme={theme} />

        {/* QUOTE configurator form */}
        <QuoteForm initialMaterial={initialMaterialForQuote} />
      </main>

      {/* FOOTER */}
      <Footer onNavigate={handleNavigate} onAdminClick={() => setIsAdminOpen(true)} />

      {/* ADMIN CONTROL PANEL MODAL */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        categories={categories}
        onAddProduct={handleAddProduct}
        onDeleteProduct={handleDeleteProduct}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
        onUpdateProduct={handleUpdateProduct}
      />
    </div>
  );
}
