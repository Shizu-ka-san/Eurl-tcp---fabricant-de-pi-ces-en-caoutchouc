import React, { useState, useEffect } from "react";
import { Hammer, Menu, X, ArrowRight, ShieldCheck, Mail, Phone, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import TcpLogo from "./TcpLogo";

interface NavbarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  theme: "light" | "oled";
  onThemeToggle: () => void;
}

export default function Navbar({ activeSection, onNavigate, theme, onThemeToggle }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "accueil", label: "Accueil" },
    { id: "produits", label: "Notre Catalogue" },
    { id: "technologie", label: "Technologie" },
    { id: "materiaux", label: "Guide Matériaux" },
    { id: "bureau-etudes", label: "Bureau d'Études IA" },
    { id: "contact", label: "Contact & Devis" },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Banner */}
      <div className="bg-[#1A1A1A] text-[#F9F9F7]/80 text-[10px] uppercase tracking-widest py-2.5 px-4 border-b border-black hidden sm:block font-mono">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-zinc-400" />
              <a href="tel:+213775554646" className="hover:text-orange-400 transition-colors">Contact direct : +213 775 55 46 46</a>
            </span>
            <span className="h-3 w-[1px] bg-zinc-800"></span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-zinc-400" />
              <a href="mailto:eurl.tcp@gmail.com" className="hover:text-orange-400 transition-colors">eurl.tcp@gmail.com</a>
            </span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-300">Normes ISO 3302-1 - Qualité Industrielle</span>
          </div>
        </div>
      </div>

      <header
         id="main-header"
         className={`sticky top-0 z-50 transition-all duration-300 ${
           theme === "oled"
             ? isScrolled
               ? "bg-black/90 backdrop-blur-md shadow-sm border-b border-zinc-900 py-3"
               : "bg-black/75 backdrop-blur-md border-b border-zinc-900/10 py-4"
             : isScrolled
               ? "bg-[#F9F9F7]/85 backdrop-blur-md shadow-sm border-b border-[#1A1A1A] py-3"
               : "bg-[#F9F9F7]/75 backdrop-blur-md border-b border-[#1A1A1A]/10 py-4"
         }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo Brand - Shifted slightly to the left */}
          <button
            id="nav-logo"
            onClick={() => handleNavClick("accueil")}
            className="flex items-center gap-3 text-left group cursor-pointer -ml-1.5 sm:-ml-3 lg:-ml-4 transition-all"
          >
            <TcpLogo className="w-10 h-10 shrink-0" />
            <div>
              <span className={`font-serif font-black text-xl italic tracking-tight block leading-none ${
                theme === "oled" ? "text-white" : "text-[#1A1A1A]"
              }`}>
                Eurl <span className="not-italic font-sans font-extrabold tracking-tighter">TCP</span>
              </span>
              <span className={`text-[9px] font-mono tracking-widest block mt-1 uppercase ${
                theme === "oled" ? "text-zinc-400" : "text-[#1A1A1A]/60"
              }`}>
                Manufacture Caoutchouc
              </span>
            </div>
          </button>

          {/* Desktop Navigation Menu with Smooth Sliding Indicator */}
          <LayoutGroup id="desktop-nav-group">
            <nav id="desktop-nav" className="hidden md:flex items-center gap-0.5 font-sans uppercase tracking-wider font-bold">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className="px-2.5 py-1.5 relative cursor-pointer select-none rounded-md text-[10px] md:text-[11px] font-bold uppercase tracking-widest whitespace-nowrap"
                  >
                    {/* Subtle color transitions */}
                    <span className={`relative z-10 transition-colors duration-200 ${
                      isActive 
                        ? theme === "oled" ? "text-white" : "text-[#1A1A1A]" 
                        : theme === "oled" ? "text-zinc-400 hover:text-white" : "text-[#1A1A1A]/50 hover:text-[#1A1A1A]"
                    }`}>
                      {item.label}
                    </span>

                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className={`absolute bottom-0 left-2 right-2 h-[2px] ${theme === "oled" ? "bg-orange-500" : "bg-[#1A1A1A]"}`}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 32,
                          mass: 0.8
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </LayoutGroup>

          {/* Theme Toggle & Action Button */}
          <div className="flex items-center gap-4">
            <button
              id="theme-toggle-desktop"
              onClick={onThemeToggle}
              className={`p-2.5 rounded-full transition-all duration-150 cursor-pointer flex items-center justify-center border border-transparent ${
                theme === "oled"
                  ? "text-orange-400 hover:bg-white/10 hover:border-white/10"
                  : "text-zinc-700 hover:bg-black/5 hover:border-black/5"
              }`}
              title={theme === "oled" ? "Activer le mode clair" : "Activer le mode OLED"}
            >
              {theme === "oled" ? (
                <Sun className="w-4 h-4 animate-pulse" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            <div className="hidden lg:flex items-center">
              <button
                id="nav-action-devis"
                onClick={() => handleNavClick("contact")}
                className={`px-5 py-2.5 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all duration-150 border ${
                  theme === "oled"
                    ? "oled-primary-cta"
                    : "bg-[#1A1A1A] hover:bg-[#333333] text-[#F9F9F7] border-[#1A1A1A] hover:border-[#333333]"
                }`}
              >
                <span>Obtenir un Devis</span>
                <ArrowRight className="w-3.5 h-3.5 text-current" />
              </button>
            </div>
          </div>

          {/* Mobile Menu Area */}
          <div className="flex items-center gap-1 md:hidden">
            <button
              id="theme-toggle-mobile"
              onClick={onThemeToggle}
              className={`p-2 rounded-full transition-colors flex items-center justify-center ${
                theme === "oled" ? "text-orange-400 hover:bg-white/10" : "text-zinc-700 hover:bg-black/5"
              }`}
              title={theme === "oled" ? "Mode clair" : "Mode OLED"}
            >
              {theme === "oled" ? (
                <Sun className="w-5 h-5 animate-pulse" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${
                theme === "oled" ? "text-white hover:bg-white/10" : "text-[#1A1A1A] hover:bg-black/5"
              }`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer with Smooth AnimatePresence entry */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-nav-drawer"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`md:hidden overflow-hidden border-b ${
                theme === "oled" ? "bg-black border-zinc-900" : "bg-[#F9F9F7] border-[#1A1A1A]"
              }`}
            >
              <div className="px-4 py-4 space-y-1">
                {navItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`mobile-nav-link-${item.id}`}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full text-left px-4 py-3 text-xs uppercase tracking-widest font-bold transition-colors block relative rounded-md ${
                        isActive
                          ? theme === "oled" ? "text-white bg-white/[0.08]" : "text-[#1A1A1A] bg-black/[0.04]"
                          : theme === "oled" ? "text-zinc-400 hover:text-white hover:bg-white/[0.04]" : "text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-black/[0.02]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{item.label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="mobileActiveDot"
                            className={`w-1.5 h-1.5 rounded-full ${theme === "oled" ? "bg-orange-500" : "bg-[#1A1A1A]"}`}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
                <div className="pt-3 border-t border-[#1A1A1A]/10">
                  <button
                    id="mobile-nav-action-devis"
                    onClick={() => handleNavClick("contact")}
                    className={`w-full py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all border ${
                      theme === "oled"
                        ? "oled-primary-cta"
                        : "bg-[#1A1A1A] hover:bg-[#333333] text-[#F9F9F7] border-[#1A1A1A] hover:border-[#333333]"
                    }`}
                  >
                    <span>Obtenir un Devis</span>
                    <ArrowRight className="w-4 h-4 text-current" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
