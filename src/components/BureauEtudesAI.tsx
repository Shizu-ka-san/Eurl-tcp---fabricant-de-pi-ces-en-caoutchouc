import React, { useState, useRef, useEffect } from "react";
import Markdown from "react-markdown";
import { ChatMessage } from "../types";
import { 
  Send, 
  Cpu, 
  Terminal, 
  Sparkles, 
  RefreshCw, 
  Layers, 
  Check, 
  Wrench, 
  AlertCircle, 
  User, 
  Compass, 
  HelpCircle, 
  ShieldAlert, 
  Workflow, 
  Database,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface BureauEtudesAIProps {
  theme?: "light" | "oled";
}

export default function BureauEtudesAI({ theme = "light" }: BureauEtudesAIProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      content: "### Bienvenue au Bureau d'Études Technique de Eurl TCP !\n\nJe suis votre ingénieur-conseil virtuel spécialisé dans la conception d'articles en caoutchouc industriels de haute précision.\n\nJe peux vous guider avec rigueur sur :\n1. **Le choix de l'élastomère idéal** pour résister à vos fluides, produits chimiques et plages thermiques (NBR, EPDM, FKM/Viton®, Silicone, etc.).\n2. **La préconisation du procédé optimal** (moulage par injection sous vide à haute cadence ou vulcanisation par compression de pièces massives).\n3. **La co-conception de vos pièces sur-mesure** (gestion des plans de joint, dépouilles de démoulage de 1° à 2°, uniformisation des épaisseurs).\n\nPosez-moi votre question ci-dessous ou cliquez sur l'une de nos suggestions d'ingénierie !",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [thoughtStep, setThoughtStep] = useState(0);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    { text: "Quel caoutchouc pour résister aux hydrocarbures à 110°C ?", label: "Résistance Huiles" },
    { text: "Quand privilégier le moulage par injection vs la compression ?", label: "Procédé Optimal" },
    { text: "Quelles sont les tolérances standards selon l'ISO 3302-1 ?", label: "Tolérances ISO" },
    { text: "Conseils pour le surmoulage d'inserts métalliques acier/EPDM ?", label: "Surmoulage Métal" },
  ];

  const thoughtSteps = [
    "Analyse physico-chimique des contraintes énoncées...",
    "Consultation des abaques d'élastomères (NBR, EPDM, FKM, Silicone)...",
    "Calcul de l'aptitude au moulage (Injection sous vide vs Compression)...",
    "Vérification des tolérances dimensionnelles (ISO 3302-1 Classe M1/M2)...",
    "Rédaction de la recommandation d'ingénierie personnalisée..."
  ];

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isLoading]);

  // Handle sequential simulated thought steps during loading
  useEffect(() => {
    if (isLoading) {
      setThoughtStep(0);
      const interval = setInterval(() => {
        setThoughtStep((prev) => (prev < thoughtSteps.length - 1 ? prev + 1 : prev));
      }, 1400);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: "msg-" + Date.now(),
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);
    setErrorMessage(null);

    // Format history for backend (excluding the initial greeting)
    const historyPayload = messages
      .filter((m) => m.id !== "welcome")
      .map((m) => ({
        role: m.role,
        content: m.content,
      }));

    try {
      const response = await fetch("/api/bureau-etudes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload,
        }),
      });

      if (!response.ok) {
        throw new Error("Le serveur n'a pas pu traiter votre demande d'avis.");
      }

      const data = await response.json();
      
      const modelMessage: ChatMessage = {
        id: "msg-reply-" + Date.now(),
        role: "model",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (err: any) {
      console.error(err);
      setErrorMessage("Échec de connexion avec le bureau d'études virtuel. Essai d'envoi en cours...");
      
      // Automatic simulated fallback after short delay
      setTimeout(() => {
        const fallbackText = "### [Mode Local Autif - Hors-ligne]\n\nNous rencontrons des difficultés de liaison avec notre serveur d'ingénierie IA. \n\n**Préconisation technique d'urgence :**\n- **Milieux huileux, gras, hydrocarbures :** Utilisez du **NBR (Nitrile)** d'une dureté de 70 Shore A (résistance optimale à la compression DRC).\n- **Milieux humides, vapeurs, UV, vieillissement extérieur :** Utilisez de l'**EPDM** (parfaitement inerte face à l'ozone).\n- **Hautes températures (> 150°C) ou chimie agressive :** Privilégiez le **FKM / Viton®**.\n- **Applications alimentaires ou médicales :** Privilégiez le **VMQ (Silicone)**.\n\nNous vous invitons à lancer notre **Configurateur de Devis** juste ci-dessous afin de soumettre directement votre plan d'ingénierie à nos experts réels sous 24h.";
        
        setMessages((prev) => [
          ...prev,
          {
            id: "msg-fallback-" + Date.now(),
            role: "model",
            content: fallbackText,
            timestamp: new Date(),
          },
        ]);
        setIsLoading(false);
        setErrorMessage(null);
      }, 1000);
      return;
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputText);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "model",
        content: "### Bienvenue au Bureau d'Études Technique de Eurl TCP !\n\nJe suis votre ingénieur-conseil virtuel spécialisé dans la conception d'articles en caoutchouc industriels de haute précision.\n\nJe peux vous guider avec rigueur sur :\n1. **Le choix de l'élastomère idéal** pour résister à vos fluides, produits chimiques et plages thermiques (NBR, EPDM, FKM/Viton®, Silicone, etc.).\n2. **La préconisation du procédé optimal** (moulage par injection sous vide à haute cadence ou vulcanisation par compression de pièces massives).\n3. **La co-conception de vos pièces sur-mesure** (gestion des plans de joint, dépouilles de démoulage de 1° à 2°, uniformisation des épaisseurs).\n\nPosez-moi votre question ci-dessous ou cliquez sur l'une de nos suggestions d'ingénierie !",
        timestamp: new Date(),
      },
    ]);
    setErrorMessage(null);
  };

  const isOled = theme === "oled";

  return (
    <section 
      id="bureau-etudes" 
      className={`py-24 relative transition-colors duration-300 ${
        isOled ? "bg-[#000000] text-zinc-100" : "bg-transparent text-[#1A1A1A]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Title with premium layout */}
        <div className={`text-left max-w-3xl space-y-4 mb-16 border-l-4 pl-6 ${
          isOled ? "border-zinc-700" : "border-[#1A1A1A]"
        }`}>
          <span className={`text-[10px] uppercase tracking-[0.3em] font-mono font-black ${
            isOled ? "text-orange-500" : "text-orange-600"
          }`}>
            R&D & CONCEPTION VIRTUELLE DE POINTE
          </span>
          <h2 className={`font-serif italic text-3xl sm:text-5xl tracking-tight mt-1 ${
            isOled ? "text-white" : "text-[#1A1A1A]"
          }`}>
            Notre Bureau d'Études Virtuel
          </h2>
          <p className={`text-base leading-relaxed font-light ${
            isOled ? "text-zinc-400" : "text-[#1A1A1A]/75"
          }`}>
            Collaborez instantanément avec notre intelligence d'ingénierie. Obtenez des diagnostics de formulation moléculaire, des recommandations de moules de précision et d'aide à la co-conception dimensionnelle.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
          
          {/* Left Panel: Specifications Dashboard */}
          <div className={`lg:col-span-4 p-6 flex flex-col justify-between text-left relative overflow-hidden rounded-xl border ${
            isOled 
              ? "bg-[#050505] border-zinc-800 shadow-[0_4px_30px_rgba(0,0,0,0.8)]" 
              : "bg-white border-[#1A1A1A]/10 shadow-sm"
          }`}>
            
            {/* Background geometric accents for oled */}
            {isOled && (
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-600/5 rounded-full blur-3xl pointer-events-none" />
            )}

            <div className="space-y-8 relative z-10">
              <div className={`flex items-center gap-2.5 pb-5 border-b ${
                isOled ? "border-zinc-800" : "border-[#1A1A1A]/10"
              }`}>
                <Terminal className={`w-5 h-5 ${isOled ? "text-orange-500" : "text-[#1A1A1A]"}`} />
                <span className={`font-mono text-xs font-black uppercase tracking-wider ${
                  isOled ? "text-zinc-300" : "text-[#1A1A1A]"
                }`}>
                  Données Système TCP
                </span>
              </div>

              {/* Status parameters list */}
              <div className="space-y-6 font-mono text-xs">
                
                <div className="space-y-2">
                  <span className={`block uppercase tracking-widest font-black text-[9px] ${
                    isOled ? "text-zinc-500" : "text-[#1A1A1A]/50"
                  }`}>
                    Normes Prises en Charge :
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <span className={`border px-2 py-1 font-bold text-[10px] rounded-md ${
                      isOled 
                        ? "bg-[#0f0f11] border-zinc-800 text-zinc-300" 
                        : "bg-[#F9F9F7] border-[#1A1A1A]/10 text-[#1A1A1A]"
                    }`}>
                      ISO 3302-1 M1
                    </span>
                    <span className={`border px-2 py-1 font-bold text-[10px] rounded-md ${
                      isOled 
                        ? "bg-[#0f0f11] border-zinc-800 text-zinc-300" 
                        : "bg-[#F9F9F7] border-[#1A1A1A]/10 text-[#1A1A1A]"
                    }`}>
                      FDA (Alimentaire)
                    </span>
                    <span className={`border px-2 py-1 font-bold text-[10px] rounded-md ${
                      isOled 
                        ? "bg-[#0f0f11] border-zinc-800 text-zinc-300" 
                        : "bg-[#F9F9F7] border-[#1A1A1A]/10 text-[#1A1A1A]"
                    }`}>
                      WRAS / KTW (Eau)
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <span className={`block uppercase tracking-widest font-black text-[9px] ${
                    isOled ? "text-zinc-500" : "text-[#1A1A1A]/50"
                  }`}>
                    Technologie Modélisée :
                  </span>
                  <div className="space-y-2 font-bold">
                    <div className="flex items-center gap-2.5">
                      <Layers className={`w-4 h-4 ${isOled ? "text-orange-500" : "text-orange-600"}`} />
                      <span className={isOled ? "text-zinc-300" : "text-[#1A1A1A]/90"}>Vulcanisation par Compression</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Wrench className={`w-4 h-4 ${isOled ? "text-orange-500" : "text-orange-600"}`} />
                      <span className={isOled ? "text-zinc-300" : "text-[#1A1A1A]/90"}>Injection Directe sous Vide</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Workflow className={`w-4 h-4 ${isOled ? "text-orange-500" : "text-orange-600"}`} />
                      <span className={isOled ? "text-zinc-300" : "text-[#1A1A1A]/90"}>Adhérisation Caoutchouc-Métal</span>
                    </div>
                  </div>
                </div>

                <div className={`border-t pt-5 ${
                  isOled ? "border-zinc-800" : "border-[#1A1A1A]/10"
                }`}>
                  <span className={`block uppercase tracking-widest font-black text-[9px] mb-1.5 ${
                    isOled ? "text-zinc-500" : "text-[#1A1A1A]/50"
                  }`}>
                    Garantie d'Adhérence :
                  </span>
                  <p className={`text-xs leading-relaxed font-sans font-light ${
                    isOled ? "text-zinc-400" : "text-[#1A1A1A]/70"
                  }`}>
                    Sablage mécanique automatisé et application d'un primaire de liaison chimique réticulant à chaud pour une fusion indestructible acier/caoutchouc.
                  </p>
                </div>
              </div>
            </div>

            {/* Quality badge list */}
            <div className={`pt-6 border-t space-y-3 mt-8 relative z-10 ${
              isOled ? "border-zinc-800" : "border-[#1A1A1A]/10"
            }`}>
              <span className={`block font-mono text-[9px] uppercase tracking-widest font-black ${
                isOled ? "text-zinc-500" : "text-[#1A1A1A]/50"
              }`}>
                Contrôle de Traçabilité :
              </span>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className={`p-0.5 rounded-full ${isOled ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}>
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span className={isOled ? "text-zinc-300" : "text-[#1A1A1A]/85"}>Matières premières certifiées 100%</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className={`p-0.5 rounded-full ${isOled ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}>
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span className={isOled ? "text-zinc-300" : "text-[#1A1A1A]/85"}>Contrôles de dureté par lot</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Chat Station */}
          <div className={`lg:col-span-8 flex flex-col justify-between overflow-hidden rounded-xl border relative ${
            isOled 
              ? "bg-[#050505] border-zinc-800 shadow-[0_4px_30px_rgba(0,0,0,0.8)]" 
              : "bg-white border-[#1A1A1A]/10 shadow-sm"
          } h-[620px]`}>
            
            {/* Chat Header */}
            <div className={`px-6 py-4 border-b flex items-center justify-between ${
              isOled ? "bg-[#0b0b0d] border-zinc-800" : "bg-[#F9F9F7] border-[#1A1A1A]/10"
            }`}>
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <div>
                  <span className={`font-serif font-bold text-sm block ${
                    isOled ? "text-zinc-100" : "text-[#1A1A1A]"
                  }`}>
                    Ingénieur Conseil Virtuel TCP
                  </span>
                  <span className={`text-[10px] font-mono block ${
                    isOled ? "text-zinc-500" : "text-[#1A1A1A]/50"
                  }`}>
                    Moteur d'intelligence R&D actif (Gemini 3.5)
                  </span>
                </div>
              </div>
              <button
                id="btn-reset-chat"
                onClick={handleResetChat}
                className={`px-3 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer border rounded-md ${
                  isOled 
                    ? "bg-[#0f0f11] hover:bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white" 
                    : "bg-white hover:bg-[#1A1A1A]/5 border-[#1A1A1A]/10 text-[#1A1A1A]/70 hover:text-[#1A1A1A]"
                }`}
                title="Effacer l'historique"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Effacer</span>
              </button>
            </div>

            {/* Message Area with custom scrollbar styling */}
            <div 
              ref={chatContainerRef}
              className={`flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin ${
                isOled ? "bg-[#030303] scrollbar-thumb-zinc-800" : "bg-[#F9F9F7]/30 scrollbar-thumb-gray-200"
              }`}
            >
              <AnimatePresence initial={false}>
                {messages.map((msg) => {
                  const isUser = msg.role === "user";
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.25 }}
                      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex items-start gap-3 max-w-[88%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border text-xs font-mono font-black ${
                          isUser 
                            ? isOled 
                              ? "bg-zinc-800 border-zinc-700 text-white" 
                              : "bg-[#1A1A1A] border-black text-white"
                            : isOled
                              ? "bg-orange-950/40 border-orange-800/30 text-orange-400"
                              : "bg-orange-50 border-orange-100 text-orange-600"
                        }`}>
                          {isUser ? <User className="w-4 h-4" /> : <Cpu className="w-4 h-4" />}
                        </div>

                        {/* Content Card */}
                        <div
                          className={`p-4 border rounded-xl text-left ${
                            isUser
                              ? isOled
                                ? "bg-zinc-900/90 border-zinc-800 text-zinc-100"
                                : "bg-[#1A1A1A] border-black text-[#F9F9F7]"
                              : isOled
                                ? "bg-[#0b0b0d] border-zinc-800 text-zinc-200"
                                : "bg-white border-[#1A1A1A]/10 text-[#1A1A1A]"
                          }`}
                        >
                          {/* Label */}
                          <div className={`flex items-center gap-2 mb-2 opacity-50 text-[9px] font-mono uppercase tracking-wider font-bold ${
                            isUser ? "text-zinc-400" : "text-[#1A1A1A]/60"
                          }`}>
                            <span>{isUser ? "Cahier des charges" : "Ingénierie R&D TCP"}</span>
                            <span>•</span>
                            <span>
                              {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>

                          {/* Content text */}
                          {isUser ? (
                            <p className="text-sm whitespace-pre-line leading-relaxed font-sans">{msg.content}</p>
                          ) : (
                            <div className={`markdown-body text-sm font-sans leading-relaxed ${
                              isOled ? "prose prose-invert max-w-none text-zinc-200" : "text-[#1A1A1A]/95"
                            }`}>
                              <Markdown>{msg.content}</Markdown>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Advanced sequential thought loader */}
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start gap-3 max-w-[85%]">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                      isOled ? "bg-orange-950/40 border-orange-800/30 text-orange-400" : "bg-orange-50 border-orange-100 text-orange-600"
                    }`}>
                      <Cpu className="w-4 h-4 animate-spin" />
                    </div>
                    <div className={`p-4 border rounded-xl text-left ${
                      isOled ? "bg-[#0b0b0d] border-zinc-800" : "bg-white border-[#1A1A1A]/10"
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                        </span>
                        <span className={`text-[9px] font-mono uppercase tracking-wider font-bold ${
                          isOled ? "text-zinc-500" : "text-[#1A1A1A]/50"
                        }`}>
                          Calculs en cours...
                        </span>
                      </div>
                      
                      {/* Thought progress indicator */}
                      <p className={`text-xs font-mono ${isOled ? "text-orange-400" : "text-orange-600"} mb-3 transition-all duration-300`}>
                        {thoughtSteps[thoughtStep]}
                      </p>

                      <div className="flex gap-1.5 py-1">
                        <span className={`w-2.5 h-2.5 rounded-full animate-bounce ${isOled ? "bg-orange-500" : "bg-black"}`} style={{ animationDelay: "0ms" }} />
                        <span className={`w-2.5 h-2.5 rounded-full animate-bounce ${isOled ? "bg-orange-500" : "bg-black"}`} style={{ animationDelay: "150ms" }} />
                        <span className={`w-2.5 h-2.5 rounded-full animate-bounce ${isOled ? "bg-orange-500" : "bg-black"}`} style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Error state */}
              {errorMessage && (
                <div className={`p-4 flex items-start gap-3 rounded-xl border ${
                  isOled ? "bg-rose-950/20 border-rose-900/30 text-rose-400" : "bg-rose-50 border-rose-100 text-rose-700"
                }`}>
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <strong className="font-bold block">Dysfonctionnement temporaire</strong>
                    <p className="font-light">{errorMessage}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions wrapper */}
            {messages.length === 1 && (
              <div className={`px-6 py-4 border-t ${
                isOled ? "bg-[#0b0b0d] border-zinc-800" : "bg-[#F9F9F7] border-[#1A1A1A]/10"
              }`}>
                <span className={`block text-[9px] font-mono uppercase tracking-widest text-left mb-2.5 font-bold ${
                  isOled ? "text-zinc-500" : "text-[#1A1A1A]/50"
                }`}>
                  Questions d'Ingénierie Fréquentes :
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {suggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      id={`btn-suggestion-${idx}`}
                      onClick={() => handleSendMessage(sug.text)}
                      className={`px-3 py-2 text-xs font-medium text-left transition-all border rounded-lg cursor-pointer flex items-center justify-between group ${
                        isOled 
                          ? "bg-[#111115] hover:bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white" 
                          : "bg-white hover:bg-zinc-50 border-[#1A1A1A]/10 text-[#1A1A1A]/80 hover:text-[#1A1A1A]"
                      }`}
                    >
                      <span>{sug.label}</span>
                      <ArrowRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all ${
                        isOled ? "text-orange-500" : "text-orange-600"
                      }`} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form Footer */}
            <form
              id="chat-input-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText);
              }}
              className={`p-4 border-t flex items-center gap-3 ${
                isOled ? "bg-[#08080a] border-zinc-800" : "bg-white border-[#1A1A1A]/10"
              }`}
            >
              <input
                id="chat-text-input"
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Spécifiez vos contraintes (température, fluides, abrasion)..."
                className={`flex-1 rounded-lg px-4 py-3.5 text-sm transition-all focus:outline-none focus:ring-1 ${
                  isOled 
                    ? "bg-[#121214] border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:border-zinc-700 focus:ring-zinc-700" 
                    : "bg-[#F9F9F7] border-[#1A1A1A]/10 text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:border-[#1A1A1A] focus:ring-[#1A1A1A]"
                }`}
                disabled={isLoading}
              />
              <button
                id="btn-chat-send"
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className={`p-3.5 rounded-lg transition-all cursor-pointer shrink-0 border ${
                  isOled
                    ? "bg-orange-600 border-orange-500 hover:bg-orange-700 text-white disabled:bg-zinc-900 disabled:border-zinc-800 disabled:text-zinc-700"
                    : "bg-[#1A1A1A] border-black hover:bg-[#333333] text-[#F9F9F7] disabled:bg-[#1A1A1A]/10 disabled:border-transparent disabled:text-[#1A1A1A]/30"
                }`}
                aria-label="Envoyer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>

        </div>

      </div>
    </section>
  );
}
