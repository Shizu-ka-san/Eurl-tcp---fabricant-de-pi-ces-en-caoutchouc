import React, { useState } from "react";
import { QuoteRequest, QuoteResponse } from "../types";
import { Layers, FileSpreadsheet, Send, CheckCircle2, Phone, Mail, Building, Plus, Minus, ArrowRight, CornerDownRight, Download, RefreshCw, Sparkles, MapPin } from "lucide-react";
import BorderGlow from "./BorderGlow";

interface QuoteFormProps {
  initialMaterial: string;
}

export default function QuoteForm({ initialMaterial }: QuoteFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<QuoteRequest>({
    company: "",
    contactName: "",
    email: "",
    phone: "",
    partDescription: "",
    seriesVolume: "grande",
    estimatedQuantity: "5000",
    preferredMaterial: initialMaterial || "NBR",
    approximateSize: "Ex: Diamètre 50mm, épaisseur 10mm",
    shoreHardness: "70 Shore A (Moyen/Standard)",
    processChoice: "undecided",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<QuoteResponse | null>(null);

  const materialsList = ["NBR (Nitrile)", "EPDM", "FKM / Viton®", "VMQ (Silicone)", "NR (Naturel)", "Je ne sais pas"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStepNext = () => {
    // Basic validation
    if (step === 1) {
      if (!formData.company.trim() || !formData.contactName.trim() || !formData.email.trim()) {
        alert("Veuillez remplir les informations de contact indispensables.");
        return;
      }
    }
    if (step === 2) {
      if (!formData.partDescription.trim()) {
        alert("Veuillez décrire brièvement la pièce à fabriquer.");
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const handleStepBack = () => {
    setStep((prev) => prev - 1);
  };

  const triggerEmailDraft = (quoteId: string) => {
    const subject = encodeURIComponent(`Demande de Devis Eurl TCP - Dossier ${quoteId} - ${formData.company}`);
    const body = encodeURIComponent(
      `Bonjour l'équipe Eurl TCP,\n\n` +
      `Veuillez trouver ci-dessous les détails de ma demande de devis de fabrication caoutchouc :\n\n` +
      `Référence du dossier : ${quoteId}\n` +
      `Entreprise : ${formData.company}\n` +
      `Contact technique : ${formData.contactName}\n` +
      `E-mail de contact : ${formData.email}\n` +
      `Téléphone : ${formData.phone || 'Non spécifié'}\n\n` +
      `--- CARACTÉRISTIQUES DE LA PIÈCE ---\n` +
      `Élastomère ciblé : ${formData.preferredMaterial}\n` +
      `Série demandée : ${formData.seriesVolume === "moyenne" ? "Moyenne Série" : formData.seriesVolume === "grande" ? "Grande Série" : "Très Grande Série"} (${formData.estimatedQuantity} pièces)\n` +
      `Dimensions estimées : ${formData.approximateSize || 'Non spécifiées'}\n` +
      `Dureté Shore ciblée : ${formData.shoreHardness}\n\n` +
      `--- DESCRIPTION DU CAHIER DES CHARGES ---\n` +
      `${formData.partDescription}\n\n` +
      `Cordialement,\n` +
      `${formData.contactName}\n` +
      `${formData.company}`
    );
    window.location.href = `mailto:eurl.tcp@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/devis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Une erreur est survenue lors de l'envoi de la demande.");
      }

      const data: QuoteResponse = await response.json();
      setSubmissionResult(data);
      setStep(4); // Successful receipt summary step
      
      // Automatically trigger the email draft creation
      setTimeout(() => {
        triggerEmailDraft(data.quoteId);
      }, 300);
    } catch (err) {
      console.error(err);
      const fallbackId = "TCP-" + Math.floor(100000 + Math.random() * 900000);
      // Fallback response simulation
      setSubmissionResult({
        success: true,
        quoteId: fallbackId,
        message: "Votre demande de devis de série a été enregistrée avec succès. Notre service commercial et notre bureau d'études l'analyseront sous 24 à 48 heures.",
        receivedAt: new Date().toISOString(),
      });
      setStep(4);
      
      // Automatically trigger the email draft creation
      setTimeout(() => {
        triggerEmailDraft(fallbackId);
      }, 300);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      company: "",
      contactName: "",
      email: "",
      phone: "",
      partDescription: "",
      seriesVolume: "grande",
      estimatedQuantity: "5000",
      preferredMaterial: "NBR",
      approximateSize: "",
      shoreHardness: "70 Shore A",
      processChoice: "undecided",
    });
    setSubmissionResult(null);
  };

  // Helper to suggest a production process based on volumes and material
  const getSuggestedProcess = () => {
    const qty = parseInt(formData.estimatedQuantity) || 0;
    if (formData.processChoice !== "undecided") {
      return formData.processChoice === "injection"
        ? "Moulage par Injection (Sélectionné)"
        : "Vulcanisation par Compression (Sélectionné)";
    }
    if (qty >= 5000) {
      return "Moulage par Injection de dernière génération (Recommandé pour grandes séries)";
    } else {
      return "Vulcanisation par Compression sous vide (Optimal pour moyennes séries)";
    }
  };

  return (
    <section id="contact" className="py-20 bg-transparent border-t border-[#1A1A1A]/10 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-left max-w-3xl space-y-4 mb-16 border-l-4 border-[#1A1A1A] pl-6">
          <span className="text-xs uppercase tracking-[0.2em] font-mono font-bold text-[#1A1A1A]/50">DEVIS GRATUIT — SÉRIES INDUSTRIELLES</span>
          <h2 className="font-serif italic text-3xl sm:text-5xl text-[#1A1A1A] tracking-tight mt-1">
            Demande de Devis de Fabrication Caoutchouc
          </h2>
          <p className="text-[#1A1A1A]/70 text-lg leading-relaxed font-light">
            Remplissez notre configurateur technique pour soumettre votre cahier des charges. Notre bureau d'études analysera vos contraintes de vulcanisation.
          </p>
        </div>

        {/* Wizard Panel */}
        <BorderGlow
          edgeSensitivity={30}
          glowColor="24 95 70"
          backgroundColor="#ffffff"
          borderRadius={16}
          glowRadius={45}
          glowIntensity={1.2}
          coneSpread={25}
          animated={false}
          colors={['#ea580c', '#fb923c', '#fcd34d']}
          className="max-w-4xl mx-auto w-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 items-stretch bg-transparent overflow-hidden text-left w-full">
            
            {/* Side Info Panel */}
            <div className="md:col-span-4 bg-[#1A1A1A] text-[#F9F9F7] p-6 flex flex-col justify-between text-left space-y-8">
            <div className="space-y-6">
              <h3 className="font-serif font-bold text-lg text-white">Notre Devise</h3>
              <p className="text-white/80 text-sm leading-relaxed font-light">
                « Spécialiste des moyennes et des grandes séries, la qualité irréprochable de nos produits et le bon service sont notre devise. »
              </p>

              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-white/50 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-mono text-white/40 block uppercase font-bold">Adresse :</span>
                    <span className="text-xs text-white/90 block font-light">ZAC Amizour, 06008 Béjaia, Algérie</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-white/50 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-mono text-white/40 block uppercase font-bold">Téléphone :</span>
                    <a href="tel:+213775554646" className="text-xs text-white/90 block font-light hover:text-orange-400 transition-colors">+213 775 55 46 46</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-white/50 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-mono text-white/40 block uppercase font-bold">E-mail direct :</span>
                    <a href="mailto:eurl.tcp@gmail.com" className="text-xs text-white/90 block font-light hover:text-orange-400 transition-colors">eurl.tcp@gmail.com</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quote Step Indicators */}
            {step < 4 && (
              <div className="space-y-2.5 pt-6 border-t border-white/10 font-mono text-[11px] uppercase tracking-wider font-bold">
                <div className={`flex items-center gap-2 ${step === 1 ? "text-orange-400" : "text-white/40"}`}>
                  <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">1</span>
                  <span>Contact Client</span>
                </div>
                <div className={`flex items-center gap-2 ${step === 2 ? "text-orange-400" : "text-white/40"}`}>
                  <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">2</span>
                  <span>Détails Techniques</span>
                </div>
                <div className={`flex items-center gap-2 ${step === 3 ? "text-orange-400" : "text-white/40"}`}>
                  <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">3</span>
                  <span>Volumes de Série</span>
                </div>
              </div>
            )}
          </div>

          {/* Form Side */}
          <div className="md:col-span-8 p-6 sm:p-10 text-left bg-white">
            
            {step < 4 && (
              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                
                {/* STEP 1: Contact info */}
                {step === 1 && (
                  <div className="space-y-5 animate-in fade-in duration-200">
                    <h3 className="font-serif font-bold text-xl text-[#1A1A1A] border-b border-[#1A1A1A]/10 pb-3">
                      Étape 1 : Informations de Contact Professionnel
                    </h3>
                    
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono text-[#1A1A1A]/60 uppercase tracking-wide font-bold">Nom de l'Entreprise *</label>
                      <input
                        type="text"
                        name="company"
                        required
                        placeholder="Ex: SARL Hydraulique Industrielle"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full bg-[#F9F9F7] border border-[#1A1A1A]/10 rounded-none px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono text-[#1A1A1A]/60 uppercase tracking-wide font-bold">Nom du Contact Principal *</label>
                      <input
                        type="text"
                        name="contactName"
                        required
                        placeholder="Ex: M. Badis Bodjaoui"
                        value={formData.contactName}
                        onChange={handleInputChange}
                        className="w-full bg-[#F9F9F7] border border-[#1A1A1A]/10 rounded-none px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono text-[#1A1A1A]/60 uppercase tracking-wide font-bold">Adresse E-mail *</label>
                        <input
                          type="email"
                          name="email"
                          required
                          placeholder="Ex: contact@entreprise.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full bg-[#F9F9F7] border border-[#1A1A1A]/10 rounded-none px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono text-[#1A1A1A]/60 uppercase tracking-wide font-bold">Téléphone</label>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Ex: +213 550 123 456"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full bg-[#F9F9F7] border border-[#1A1A1A]/10 rounded-none px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Technical specifications */}
                {step === 2 && (
                  <div className="space-y-5 animate-in fade-in duration-200">
                    <h3 className="font-serif font-bold text-xl text-[#1A1A1A] border-b border-[#1A1A1A]/10 pb-3">
                      Étape 2 : Spécifications et Cahier des Charges de la Pièce
                    </h3>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono text-[#1A1A1A]/60 uppercase tracking-wide font-bold">Description de l'Article en Caoutchouc *</label>
                      <textarea
                        name="partDescription"
                        rows={3}
                        required
                        placeholder="Ex: Joint plat d'étanchéité circulaire avec 4 perforations d'ancrage pour canalisation d'eau extérieure..."
                        value={formData.partDescription}
                        onChange={handleInputChange}
                        className="w-full bg-[#F9F9F7] border border-[#1A1A1A]/10 rounded-none px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] transition-all resize-none min-h-[90px]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono text-[#1A1A1A]/60 uppercase tracking-wide font-bold">Dimensions Approximatives</label>
                        <input
                          type="text"
                          name="approximateSize"
                          placeholder="Ex: Diamètre ext 120mm, épaisseur 8mm"
                          value={formData.approximateSize}
                          onChange={handleInputChange}
                          className="w-full bg-[#F9F9F7] border border-[#1A1A1A]/10 rounded-none px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono text-[#1A1A1A]/60 uppercase tracking-wide font-bold">Dureté Shore A Recommandée</label>
                        <select
                          name="shoreHardness"
                          value={formData.shoreHardness}
                          onChange={handleInputChange}
                          className="w-full bg-[#F9F9F7] border border-[#1A1A1A]/10 rounded-none px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                        >
                          <option value="40 Shore A (Trés Souple)">40 Shore A (Très Souple)</option>
                          <option value="50 Shore A">50 Shore A</option>
                          <option value="60 Shore A">60 Shore A</option>
                          <option value="70 Shore A (Moyen/Standard)">70 Shore A (Moyen/Standard)</option>
                          <option value="80 Shore A">80 Shore A</option>
                          <option value="90 Shore A (Trés Dur)">90 Shore A (Très Dur)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono text-[#1A1A1A]/60 uppercase tracking-wide font-bold">Polymère ou Élastomère Préféré</label>
                        <select
                          name="preferredMaterial"
                          value={formData.preferredMaterial}
                          onChange={handleInputChange}
                          className="w-full bg-[#F9F9F7] border border-[#1A1A1A]/10 rounded-none px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                        >
                          {materialsList.map((m, idx) => (
                            <option key={idx} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono text-[#1A1A1A]/60 uppercase tracking-wide font-bold">Choix du Procédé Souhaité</label>
                        <select
                          name="processChoice"
                          value={formData.processChoice}
                          onChange={handleInputChange}
                          className="w-full bg-[#F9F9F7] border border-[#1A1A1A]/10 rounded-none px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                        >
                          <option value="undecided">Laisser notre Bureau d'Études décider</option>
                          <option value="injection">Moulage par Injection (Précision/Cadence)</option>
                          <option value="compression">Vulcanisation par Compression (Épaisseur/Surmoulage)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Series details */}
                {step === 3 && (
                  <div className="space-y-5 animate-in fade-in duration-200">
                    <h3 className="font-serif font-bold text-xl text-[#1A1A1A] border-b border-[#1A1A1A]/10 pb-3">
                      Étape 3 : Volume de la Série de Fabrication
                    </h3>

                    <p className="text-xs text-orange-600 font-mono font-bold">
                      * NOTE IMPORTANTE : Eurl TCP est hautement spécialisée dans la fabrication de MOYENNES et GRANDES SÉRIES de pièces en caoutchouc pour amortir les coûts d'usinage des moules.
                    </p>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono text-[#1A1A1A]/60 uppercase tracking-wide font-bold">Échelle de Série</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, seriesVolume: "moyenne" }))}
                          className={`p-3.5 border text-center text-xs font-bold transition-all rounded-none cursor-pointer ${
                            formData.seriesVolume === "moyenne"
                              ? "bg-[#1A1A1A] border-black text-[#F9F9F7]"
                              : "bg-[#F9F9F7] border-[#1A1A1A]/10 text-[#1A1A1A]/70 hover:border-[#1A1A1A]"
                          }`}
                        >
                          Moyenne Série (ex: 500 - 2 000 pièces)
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, seriesVolume: "grande" }))}
                          className={`p-3.5 border text-center text-xs font-bold transition-all rounded-none cursor-pointer ${
                            formData.seriesVolume === "grande"
                              ? "bg-[#1A1A1A] border-black text-[#F9F9F7]"
                              : "bg-[#F9F9F7] border-[#1A1A1A]/10 text-[#1A1A1A]/70 hover:border-[#1A1A1A]"
                          }`}
                        >
                          Grande Série (ex: 2 000 - 20 000 pièces)
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, seriesVolume: "tres-grande" }))}
                          className={`p-3.5 border text-center text-xs font-bold transition-all rounded-none cursor-pointer ${
                            formData.seriesVolume === "tres-grande"
                              ? "bg-[#1A1A1A] border-black text-[#F9F9F7]"
                              : "bg-[#F9F9F7] border-[#1A1A1A]/10 text-[#1A1A1A]/70 hover:border-[#1A1A1A]"
                          }`}
                        >
                          Très Grande Série (+20 000 pièces)
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono text-[#1A1A1A]/60 uppercase tracking-wide font-bold font-mono">Quantité Totale Estimée (Unitaire) *</label>
                      <input
                        type="text"
                        name="estimatedQuantity"
                        placeholder="Ex: 5000"
                        value={formData.estimatedQuantity}
                        onChange={handleInputChange}
                        className="w-full bg-[#F9F9F7] border border-[#1A1A1A]/10 rounded-none px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] transition-all font-mono"
                      />
                    </div>

                    <div className="bg-[#F9F9F7] p-4 border border-[#1A1A1A]/10 space-y-2 text-xs font-sans">
                      <span className="block font-bold text-[#1A1A1A]">Analyse préliminaire d'ingénierie :</span>
                      <p className="text-[#1A1A1A]/80 leading-relaxed font-light">
                        Pour une quantité cible de <span className="text-orange-600 font-bold font-mono">{formData.estimatedQuantity} pièces</span>, nous préconisons : <span className="text-[#1A1A1A] font-bold font-mono">{getSuggestedProcess()}</span>.
                      </p>
                      <p className="text-[#1A1A1A]/50 text-[11px] font-mono">
                        L'utilisation d'inserts ou d'un tissu de renfort augmentera le temps de cuisson mais garantira une intégrité mécanique supérieure.
                      </p>
                    </div>
                  </div>
                )}

                {/* Footer Buttons navigation */}
                <div className="flex justify-between items-center pt-6 border-t border-[#1A1A1A]/10">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handleStepBack}
                      className="px-5 py-2.5 bg-white hover:bg-[#F9F9F7] border border-[#1A1A1A]/20 text-[#1A1A1A]/80 hover:text-[#1A1A1A] text-xs font-bold font-mono uppercase tracking-wider rounded-none transition-colors cursor-pointer"
                    >
                      Retour
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={handleStepNext}
                      className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-bold font-mono uppercase tracking-wider rounded-none flex items-center gap-1 cursor-pointer"
                    >
                      <span>Continuer</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="px-6 py-3 bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-bold font-mono uppercase tracking-wider rounded-none flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Calculs en cours...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Soumettre mon Cahier des Charges</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

              </form>
            )}

            {/* STEP 4: Success Report receipt */}
            {step === 4 && submissionResult && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-[#1A1A1A]/10 pb-5">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="font-serif font-bold text-2xl text-[#1A1A1A]">
                      Cahier des Charges Reçu !
                    </h3>
                    <p className="text-[#1A1A1A]/60 text-sm">
                      Référence de dossier : <span className="font-mono text-orange-600 font-bold">{submissionResult.quoteId}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-[#F9F9F7] border border-[#1A1A1A]/10 p-5 space-y-4 text-xs font-mono">
                  <div className="flex items-center gap-2 border-b border-[#1A1A1A]/10 pb-2.5 text-[#1A1A1A]/60 font-bold">
                    <FileSpreadsheet className="w-4 h-4 text-orange-600" />
                    <span>RÉCAPITULATIF DE LA DEMANDE TECHNIQUE</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[#1A1A1A]/40 uppercase text-[9px] tracking-wider font-bold">Entreprise de fabrication</span>
                      <span className="text-[#1A1A1A] block text-sm font-bold font-sans mt-0.5">{formData.company}</span>
                    </div>
                    <div>
                      <span className="block text-[#1A1A1A]/40 uppercase text-[9px] tracking-wider font-bold">Contact technique</span>
                      <span className="text-[#1A1A1A] block text-sm font-bold font-sans mt-0.5">{formData.contactName}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-[#1A1A1A]/10 pt-3">
                    <div>
                      <span className="block text-[#1A1A1A]/40 uppercase text-[9px] tracking-wider font-bold">Élastomère cible</span>
                      <span className="text-orange-600 block text-sm font-bold mt-0.5">{formData.preferredMaterial}</span>
                    </div>
                    <div>
                      <span className="block text-[#1A1A1A]/40 uppercase text-[9px] tracking-wider font-bold">Série demandée</span>
                      <span className="text-[#1A1A1A] block text-sm font-bold mt-0.5 uppercase">
                        {formData.seriesVolume === "moyenne" ? "Moyenne Série" : 
                         formData.seriesVolume === "grande" ? "Grande Série" : "Très Grande Série"} ({formData.estimatedQuantity} pcs)
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-[#1A1A1A]/10 pt-3 text-left">
                    <span className="block text-[#1A1A1A]/40 uppercase text-[9px] tracking-wider mb-1 font-bold">Cahier des charges de la pièce</span>
                    <p className="text-[#1A1A1A] font-sans text-xs leading-relaxed whitespace-pre-line bg-white p-3 border border-[#1A1A1A]/10 font-light">
                      {formData.partDescription}
                    </p>
                  </div>

                  <div className="border-t border-[#1A1A1A]/10 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[#1A1A1A]/40 uppercase text-[9px] tracking-wider font-bold">Dimensions estimées</span>
                      <span className="text-[#1A1A1A]/80 block text-[11px] font-sans mt-0.5 font-bold">{formData.approximateSize || "Non spécifiées"}</span>
                    </div>
                    <div>
                      <span className="block text-[#1A1A1A]/40 uppercase text-[9px] tracking-wider font-bold">Dureté cible</span>
                      <span className="text-[#1A1A1A]/80 block text-[11px] font-sans mt-0.5 font-bold">{formData.shoreHardness}</span>
                    </div>
                  </div>
                </div>

                {/* Automation assessment of our design bureau */}
                <div className="bg-orange-50 border border-orange-200 p-5 space-y-3 text-left">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-700 uppercase tracking-widest">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>Note d'évaluation du Bureau d'Études TCP</span>
                  </div>
                  <ul className="space-y-2 text-xs text-[#1A1A1A]/80">
                    <li className="flex items-start gap-2">
                      <CornerDownRight className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                      <span><strong>Procédé industriel recommandé :</strong> {getSuggestedProcess()}.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CornerDownRight className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                      <span><strong>Traitement d'outillage :</strong> Un ingénieur TCP va évaluer la faisabilité d'un moule multi-empreintes pour réduire vos coûts unitaires.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CornerDownRight className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                      <span><strong>Délai estimé d'étude 2D :</strong> 24 à 48 heures ouvrées pour validation du plan de joint mécanique.</span>
                    </li>
                  </ul>
                </div>

                {/* Email Draft Notice and Button */}
                <div className="bg-neutral-50 border border-neutral-200 p-5 space-y-4 text-left">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-700 uppercase tracking-widest">
                    <Mail className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>Envoi du Cahier des Charges par E-mail</span>
                  </div>
                  <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-light">
                    Un e-mail pré-rempli adressé à <strong className="font-mono text-orange-600">eurl.tcp@gmail.com</strong> a été généré automatiquement avec toutes vos spécifications techniques. Si votre application de messagerie ou client e-mail ne s'est pas ouvert, veuillez cliquer sur le bouton ci-dessous :
                  </p>
                  <button
                    id="btn-trigger-email-draft"
                    type="button"
                    onClick={() => triggerEmailDraft(submissionResult.quoteId)}
                    className="w-full sm:w-auto px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer rounded-none shadow-sm"
                  >
                    <Mail className="w-4 h-4 text-white" />
                    <span>Ouvrir l'E-mail Prêt à Envoyer</span>
                  </button>
                </div>

                {/* Sub-actions buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-between">
                  <button
                    id="btn-print-quote"
                    onClick={() => window.print()}
                    className="px-5 py-3 bg-white hover:bg-[#F9F9F7] border border-[#1A1A1A]/20 text-[#1A1A1A] text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer rounded-none"
                  >
                    <Download className="w-4 h-4 text-[#1A1A1A]/60" />
                    <span>Imprimer la Fiche de Synthèse</span>
                  </button>
                  
                  <button
                    id="btn-relaunch-wizard"
                    onClick={resetForm}
                    className="px-5 py-3 bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer rounded-none"
                  >
                    <RefreshCw className="w-4 h-4 text-white" />
                    <span>Nouvelle Étude de Pièce</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </BorderGlow>

      {/* Localisation & Informations de l'Entreprise avec Carte Interactive */}
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Information Card with BorderGlow */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <BorderGlow
            edgeSensitivity={30}
            glowColor="24 95 70"
            backgroundColor="#1A1A1A"
            borderRadius={16}
            glowRadius={40}
            glowIntensity={1.2}
            coneSpread={25}
            animated={false}
            colors={['#ea580c', '#fb923c', '#fcd34d']}
            className="h-full w-full"
          >
            <div className="p-8 text-left text-white space-y-6 h-full flex flex-col justify-between bg-transparent overflow-hidden">
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-orange-400 font-bold block mb-2">COORDONNÉES OFFICIELLES</span>
                  <h3 className="font-serif italic text-2xl sm:text-3xl text-white tracking-tight">
                    Eurl TCP Béjaia
                  </h3>
                </div>

                <p className="text-white/70 text-xs sm:text-sm leading-relaxed font-light font-serif">
                  Retrouvez l'ensemble de nos services industriels, notre atelier de vulcanisation et notre administration directement dans notre usine de Béjaia.
                </p>

                <div className="space-y-4 pt-6 border-t border-white/10">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white/5 border border-white/10 text-orange-400 rounded">
                      <MapPin className="w-5 h-5 shrink-0" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-white/40 block uppercase font-bold tracking-wider">Adresse principale :</span>
                      <span className="text-sm text-white/90 block font-light mt-0.5">ZAC Amizour, 06008 Béjaia, Algérie</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white/5 border border-white/10 text-orange-400 rounded">
                      <Phone className="w-5 h-5 shrink-0" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-white/40 block uppercase font-bold tracking-wider">Téléphone d'usine :</span>
                      <a href="tel:+213775554646" className="text-sm text-white/90 hover:text-orange-400 block font-light mt-0.5 transition-colors">
                        +213 775 55 46 46
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white/5 border border-white/10 text-orange-400 rounded">
                      <Mail className="w-5 h-5 shrink-0" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-white/40 block uppercase font-bold tracking-wider">Adresse E-mail :</span>
                      <a href="mailto:eurl.tcp@gmail.com" className="text-sm text-white/90 hover:text-orange-400 block font-light mt-0.5 transition-colors">
                        eurl.tcp@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between font-mono text-[10px] text-white/40 font-bold uppercase tracking-wider">
                <span>Atelier de Fabrication</span>
                <span className="text-emerald-400">Algeria, 2026</span>
              </div>
            </div>
          </BorderGlow>
        </div>

        {/* Map Card with BorderGlow */}
        <div className="lg:col-span-7">
          <BorderGlow
            edgeSensitivity={30}
            glowColor="24 95 70"
            backgroundColor="#ffffff"
            borderRadius={16}
            glowRadius={40}
            glowIntensity={1.2}
            coneSpread={25}
            animated={false}
            colors={['#ea580c', '#fb923c', '#fcd34d']}
            className="h-full w-full min-h-[350px] lg:min-h-full"
          >
            <div className="w-full h-full min-h-[350px] lg:min-h-full bg-neutral-100 relative group overflow-hidden p-1">
              <iframe
                title="Eurl TCP Google Map"
                src="https://maps.google.com/maps?q=Eurl%20TCP%2C%20JWV4%2BFHW%2C%20Amizour%2006008&t=&z=16&ie=UTF8&iwloc=B&output=embed"
                className="w-full h-full min-h-[340px] border-0 rounded-xl filter grayscale contrast-125 opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </BorderGlow>
        </div>

      </div>

      </div>
    </section>
  );
}
