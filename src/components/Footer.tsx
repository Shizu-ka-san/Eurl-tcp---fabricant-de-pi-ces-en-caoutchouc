import React from "react";
import { Hammer, ShieldCheck, Mail, Phone, Calendar, Clock, Globe, Lock } from "lucide-react";
import TcpLogo from "./TcpLogo";

interface FooterProps {
  onNavigate: (section: string) => void;
  onAdminClick: () => void;
}

export default function Footer({ onNavigate, onAdminClick }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="main-footer" className="bg-[#1A1A1A] text-white/60 py-16 border-t border-white/10 text-left relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-10">
        
         {/* Left Column: Brand Motto */}
        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center gap-2.5">
            <TcpLogo className="w-11 h-11" holeColor="#1A1A1A" />
            <div>
              <span className="font-serif font-bold text-base tracking-wider text-white block">
                Eurl TCP
              </span>
              <span className="text-[9px] text-white/40 font-mono tracking-widest block uppercase font-bold">
                Manufacture Caoutchouc
              </span>
            </div>
          </div>
          
          <p className="text-white/70 text-xs sm:text-sm leading-relaxed font-light">
            Eurl TCP est une entreprise spécialisée dans la fabrication de divers types d'articles en caoutchouc en moyennes et grandes séries industrielles.
          </p>

          <p className="text-white/90 font-serif text-sm italic pl-3 border-l-2 border-white/40 font-light">
            « La qualité de nos produits et le bon service sont notre devise. »
          </p>
        </div>

        {/* Center Column: Quick Navigation */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="font-mono font-bold text-xs text-white uppercase tracking-[0.2em]">
            PLAN DU SITE INDUSTRIEL
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs font-light">
            <button
              id="footer-link-accueil"
              onClick={() => onNavigate("accueil")}
              className="hover:text-white transition-colors text-left cursor-pointer"
            >
              Accueil
            </button>
            <button
              id="footer-link-produits"
              onClick={() => onNavigate("produits")}
              className="hover:text-white transition-colors text-left cursor-pointer"
            >
              Notre Catalogue
            </button>
            <button
              id="footer-link-technologie"
              onClick={() => onNavigate("technologie")}
              className="hover:text-white transition-colors text-left cursor-pointer"
            >
              Technologie de Presses
            </button>
            <button
              id="footer-link-materiaux"
              onClick={() => onNavigate("materiaux")}
              className="hover:text-white transition-colors text-left cursor-pointer"
            >
              Guide Élastomères
            </button>
            <button
              id="footer-link-bureau"
              onClick={() => onNavigate("bureau-etudes")}
              className="hover:text-white transition-colors text-left cursor-pointer"
            >
              Bureau d'Études IA
            </button>
            <button
              id="footer-link-devis"
              onClick={() => onNavigate("contact")}
              className="hover:text-white transition-colors text-left cursor-pointer"
            >
              Demander un Devis
            </button>
          </div>

          <div className="pt-2 flex items-center gap-2 font-mono text-[10px] text-white/40 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Tolérance ISO 3302-1 respectée</span>
          </div>
        </div>

        {/* Right Column: Contact Details & Hours */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="font-mono font-bold text-xs text-white uppercase tracking-[0.2em]">
            HORAIRES & EXPÉDITION
          </h4>
          
          <ul className="space-y-3.5 text-xs text-white/70 font-light">
            <li className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-white/50 shrink-0 mt-0.5" />
              <div>
                <span className="block font-bold text-white font-mono uppercase text-[10px] tracking-wider">Bureaux & Atelier :</span>
                <span className="block text-white/50 font-light mt-0.5">Dimanche à Jeudi : 08:00 - 16:30</span>
                <span className="block text-white/50 font-light">Fermé Vendredi et Samedi</span>
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <Globe className="w-4 h-4 text-white/50 shrink-0 mt-0.5" />
              <div>
                <span className="block font-bold text-white font-mono uppercase text-[10px] tracking-wider">Zone de Livraison :</span>
                <span className="block text-white/50 font-light mt-0.5">Expéditions nationales et internationales</span>
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-white/50 shrink-0 mt-0.5" />
              <div>
                <span className="block font-bold text-white font-mono uppercase text-[10px] tracking-wider">Contact Direct :</span>
                <a href="mailto:eurl.tcp@gmail.com" className="block text-white/50 font-light mt-0.5 hover:text-orange-400 transition-colors">eurl.tcp@gmail.com</a>
                <a href="tel:+213775554646" className="block text-white/50 font-light hover:text-orange-400 transition-colors mt-0.5">+213 775 55 46 46</a>
              </div>
            </li>
          </ul>
        </div>

      </div>

      {/* Sub-footer copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/40 font-mono">
        <div className="flex items-center gap-1.5">
          <span>&copy; {currentYear} Eurl TCP - Manufacture de Caoutchouc de Précision. Tous droits réservés.</span>
          <button
            onClick={onAdminClick}
            className="text-white/10 hover:text-orange-500 hover:scale-110 active:scale-95 transition-all duration-300 p-1 rounded-full cursor-pointer focus:outline-none"
            title="Console Admin"
          >
            <Lock className="w-3 h-3" />
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <span className="hover:text-white transition-colors cursor-pointer">Mentions Légales</span>
          <span>&bull;</span>
          <span className="hover:text-white transition-colors cursor-pointer">Politique de Qualité</span>
          <span>&bull;</span>
          <a
            href="https://github.com/Shizu-ka-san"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors underline decoration-dotted underline-offset-4"
          >
            Créé par Shizu-ka-san
          </a>
        </div>
      </div>
    </footer>
  );
}
