import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Database,
  Plus,
  Trash2,
  LockKeyhole,
  Layers,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  Edit3,
  AlertTriangle
} from "lucide-react";

import { Product, Category } from "../types";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  categories: Category[];
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => Promise<boolean>;
  onAddCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => Promise<boolean>;
  onUpdateProduct: (product: Product) => void;
}

export default function AdminModal({ 
  isOpen, 
  onClose, 
  products, 
  categories, 
  onAddProduct, 
  onDeleteProduct,
  onAddCategory,
  onDeleteCategory,
  onUpdateProduct
}: AdminModalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Product Form states
  const [newProdName, setNewProdName] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("");
  const [newCategoryLabel, setNewCategoryLabel] = useState("");

  // Product image upload states
  const [newProdImageUrl, setNewProdImageUrl] = useState("");
  const [imageInputMethod, setImageInputMethod] = useState<"file" | "url">("file");
  const [isDragging, setIsDragging] = useState(false);

  // States for editing photo of existing products
  const [editingPhotoProductId, setEditingPhotoProductId] = useState<string | null>(null);
  const [editImageInputMethod, setEditImageInputMethod] = useState<"file" | "url">("file");
  const [isEditDragging, setIsEditDragging] = useState(false);

  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);

  const processFile = (file: File, onSuccess: (base64: string) => void) => {
    if (!file.type.startsWith("image/")) {
      triggerToast("Erreur : Le fichier doit être une image !");
      return;
    }
    if (file.size > 2 * 1024 * 1024) { // limit to 2MB for storage
      triggerToast("Erreur : Image trop lourde ! Choisissez une image de moins de 2 Mo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onSuccess(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file, (base64) => {
        setNewProdImageUrl(base64);
        triggerToast("Succès : Image chargée avec succès !");
      });
    }
  };

  const handleEditFileSelected = (file: File, product: Product) => {
    processFile(file, (base64) => {
      const updated = { ...product, imageUrl: base64 };
      onUpdateProduct(updated);
      triggerToast("Succès : Photo de la pièce mise à jour !");
    });
  };

  const handleEditUrlSave = (url: string, product: Product) => {
    const trimmed = url.trim();
    if (!trimmed) return;
    const updated = { ...product, imageUrl: trimmed };
    onUpdateProduct(updated);
    triggerToast("Succès : URL de la photo enregistrée !");
  };

  const activeProdCategory = newProdCategory || (categories.length > 0 ? categories[0].id : "");

  const handleCreateCategory = () => {
    if (!newCategoryLabel.trim()) {
      triggerToast("Erreur : Le nom de la catégorie est obligatoire !");
      return;
    }

    if (editingCategory) {
      const updatedCat: Category = {
        ...editingCategory,
        label: newCategoryLabel.trim()
      };
      onAddCategory(updatedCat);
      triggerToast(`Succès : Catégorie modifiée en "${newCategoryLabel.trim()}" !`);
      setEditingCategory(null);
      setNewCategoryLabel("");
      return;
    }

    const catId = newCategoryLabel.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    
    // Check if category already exists
    if (categories.some(c => c.id === catId)) {
      triggerToast("Erreur : Cette catégorie existe déjà !");
      return;
    }

    const newCat: Category = {
      id: catId,
      label: newCategoryLabel.trim()
    };
    onAddCategory(newCat);
    triggerToast(`Succès : Catégorie "${newCategoryLabel.trim()}" créée !`);
    setNewCategoryLabel("");
    setNewProdCategory(catId);
  };
  const [newProdDescription, setNewProdDescription] = useState("");
  const [newProdHardness, setNewProdHardness] = useState("50 à 80 Shore A");
  const [newProdMaterials, setNewProdMaterials] = useState<string[]>(["NBR", "EPDM"]);
  const [newProdSeries, setNewProdSeries] = useState("Moyennes et Grandes séries");
  const [newProdTolerances, setNewProdTolerances] = useState("ISO 3302-1 Classe M2");
  const [newProdFeatureInput, setNewProdFeatureInput] = useState("");
  const [newProdFeatures, setNewProdFeatures] = useState<string[]>([
    "Formulation résistante aux huiles et carburants",
    "Finition ébavurée de haute précision"
  ]);
  const [newProdApplicationInput, setNewProdApplicationInput] = useState("");
  const [newProdApplications, setNewProdApplications] = useState<string[]>([
    "Moteurs industriels",
    "Systèmes de vannes"
  ]);

  const [toastMsg, setToastMsg] = useState("");
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  };

  const addFeature = () => {
    if (newProdFeatureInput.trim()) {
      setNewProdFeatures(prev => [...prev, newProdFeatureInput.trim()]);
      setNewProdFeatureInput("");
    }
  };

  const removeFeature = (index: number) => {
    setNewProdFeatures(prev => prev.filter((_, i) => i !== index));
  };

  const addApplication = () => {
    if (newProdApplicationInput.trim()) {
      setNewProdApplications(prev => [...prev, newProdApplicationInput.trim()]);
      setNewProdApplicationInput("");
    }
  };

  const removeApplication = (index: number) => {
    setNewProdApplications(prev => prev.filter((_, i) => i !== index));
  };

  const handleToggleMaterial = (mat: string) => {
    setNewProdMaterials(prev =>
      prev.includes(mat) ? prev.filter(m => m !== mat) : [...prev, mat]
    );
  };

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) {
      triggerToast("Erreur : Le nom du produit est obligatoire !");
      return;
    }
    if (!newProdDescription.trim()) {
      triggerToast("Erreur : La description du produit est obligatoire !");
      return;
    }
    if (newProdMaterials.length === 0) {
      triggerToast("Erreur : Veuillez sélectionner au moins un élastomère !");
      return;
    }

    const selectedCat = activeProdCategory;
    if (!selectedCat) {
      triggerToast("Erreur : Veuillez d'abord créer au moins une catégorie !");
      return;
    }

    const productToSave: Product = {
      id: editingProductId || `prod-${Date.now()}`,
      name: newProdName,
      category: selectedCat,
      description: newProdDescription,
      imagePrompt: "industrial_molded_rubber_part",
      specs: {
        hardness: newProdHardness,
        materials: newProdMaterials,
        series: newProdSeries,
        tolerances: newProdTolerances
      },
      features: newProdFeatures.length > 0 ? newProdFeatures : ["Spécifications sur-mesure de précision"],
      applications: newProdApplications.length > 0 ? newProdApplications : ["Applications industrielles polyvalentes"],
      imageUrl: newProdImageUrl || undefined
    };

    if (editingProductId) {
      onUpdateProduct(productToSave);
      triggerToast("Succès : Le produit a été modifié avec succès !");
      setEditingProductId(null);
    } else {
      onAddProduct(productToSave);
      triggerToast("Succès : Le produit a été ajouté au catalogue !");
    }

    // reset fields
    setNewProdName("");
    setNewProdDescription("");
    setNewProdImageUrl("");
    setNewProdHardness("50 à 80 Shore A");
    setNewProdMaterials(["NBR", "EPDM"]);
    setNewProdSeries("Moyennes et Grandes séries");
    setNewProdTolerances("ISO 3302-1 Classe M2");
    setNewProdFeatures([
      "Résistance aux conditions de service sévères",
      "Finition de haute précision conforme aux normes"
    ]);
    setNewProdApplications([
      "Secteur industriel général",
      "Systèmes d'étanchéité"
    ]);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setIsAuthenticated(true);
        setErrorMsg("");
        return;
      } else {
        setErrorMsg(data.error || "Code d'accès incorrect");
        setPasscode("");
      }
    } catch (err) {
      console.error("Erreur d'authentification API :", err);
      setErrorMsg("Impossible de contacter le serveur d'authentification.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#1A1A1A]/80 backdrop-blur-md cursor-zoom-out"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-[#F9F9F7] text-[#1A1A1A] w-full max-w-6xl h-[85vh] sm:h-[80vh] rounded-2xl shadow-2xl border-2 border-[#1A1A1A] overflow-hidden flex flex-col relative z-10 font-sans"
          >
            {/* Header banner */}
            <div className="bg-[#1A1A1A] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#1A1A1A]">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse" />
                <div>
                  <h2 className="font-serif font-black italic tracking-wide text-lg sm:text-xl">
                    Gestion du Catalogue <span className="text-orange-500 not-italic font-sans font-extrabold text-sm ml-1 px-1.5 py-0.5 bg-orange-500/10 rounded">TCP ADMIN</span>
                  </h2>
                  <p className="text-[9px] text-white/40 font-mono tracking-widest uppercase">
                    Administration des Pièces Techniques & Références
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Login Overlay Screen */}
            {!isAuthenticated ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#1A1A1A]/5 relative overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-8 rounded-xl shadow-xl max-w-sm w-full border-2 border-[#1A1A1A] relative z-10 text-center"
                >
                  <div className="w-12 h-12 bg-orange-600/10 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LockKeyhole className="w-6 h-6" />
                  </div>
                  
                  <h3 className="font-serif font-bold text-lg text-[#1A1A1A] mb-1">
                    Accès Réservé
                  </h3>
                  <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
                    Veuillez saisir le code confidentiel d'accès pour modifier et administrer le catalogue de pièces.
                  </p>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <input
                        type="password"
                        placeholder="Entrez le code d'accès..."
                        maxLength={32}
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        className="w-full tracking-[0.25em] text-center text-base font-bold bg-[#1A1A1A]/5 border-2 border-[#1A1A1A]/20 focus:border-[#1A1A1A] rounded-lg py-3 outline-none transition-colors"
                        autoFocus
                      />
                    </div>

                    {errorMsg && (
                      <p className="text-red-500 text-xs font-mono font-bold">
                        {errorMsg}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-white text-xs font-bold uppercase tracking-widest py-3 rounded-lg transition-colors cursor-pointer"
                    >
                      Déverrouiller la Console
                    </button>
                  </form>
                </motion.div>
              </div>
            ) : (
              // ADMIN CONTROL CENTER DASHBOARD (Catalogue only)
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
                  
                  {/* Left Panel: Form to Add / Edit Product */}
                  <div className="lg:col-span-5 bg-white rounded-xl border-2 border-[#1A1A1A] p-5 shadow-sm space-y-4">
                    <div className="border-b border-neutral-100 pb-3 flex items-center gap-2">
                      {editingProductId ? (
                        <Edit3 className="w-5 h-5 text-orange-600" />
                      ) : (
                        <Plus className="w-5 h-5 text-orange-600" />
                      )}
                      <h3 className="font-serif font-black italic text-base">
                        {editingProductId ? "Modifier la Pièce Technique" : "Ajouter une Pièce Technique"}
                      </h3>
                    </div>

                    {toastMsg && (
                      <div className={`p-3 text-xs font-mono font-bold rounded border ${
                        toastMsg.startsWith("Erreur") 
                          ? "bg-red-50 text-red-800 border-red-200" 
                          : "bg-emerald-50 text-emerald-800 border-emerald-200"
                      }`}>
                        {toastMsg}
                      </div>
                    )}

                    <form onSubmit={handleSubmitProduct} className="space-y-4 text-xs">
                      {/* Name */}
                      <div className="space-y-1">
                        <label className="block text-[#1A1A1A]/60 font-mono uppercase tracking-wider font-bold">Nom de la pièce *</label>
                        <input
                          type="text"
                          value={newProdName}
                          onChange={(e) => setNewProdName(e.target.value)}
                          placeholder="ex: Joints Toriques Multilèvres, Profilé U..."
                          className="w-full bg-[#F9F9F7] border border-neutral-300 rounded px-3 py-2 outline-none focus:border-[#1A1A1A] text-sm"
                          required
                        />
                      </div>

                      {/* Category */}
                      <div className="space-y-1">
                        <label className="block text-[#1A1A1A]/60 font-mono uppercase tracking-wider font-bold">Catégorie du Catalogue *</label>
                        <select
                          value={activeProdCategory}
                          onChange={(e) => setNewProdCategory(e.target.value)}
                          className="w-full bg-[#F9F9F7] border border-neutral-300 rounded px-3 py-2 outline-none focus:border-[#1A1A1A] text-sm"
                          required
                        >
                          {categories.length === 0 ? (
                            <option value="">-- Veuillez créer une catégorie d'abord --</option>
                          ) : (
                            categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.label}
                              </option>
                            ))
                          )}
                        </select>
                      </div>

                      {/* Description */}
                      <div className="space-y-1">
                        <label className="block text-[#1A1A1A]/60 font-mono uppercase tracking-wider font-bold">Description Technique *</label>
                        <textarea
                          value={newProdDescription}
                          onChange={(e) => setNewProdDescription(e.target.value)}
                          rows={3}
                          placeholder="ex: Joints profilés d'étanchéité de haute régularité résistant au vieillissement et aux huiles de coupe..."
                          className="w-full bg-[#F9F9F7] border border-neutral-300 rounded px-3 py-2 outline-none focus:border-[#1A1A1A] text-sm"
                          required
                        />
                      </div>

                      {/* Specs section */}
                      <div className="grid grid-cols-2 gap-3 bg-neutral-50 p-3 rounded border border-neutral-200">
                        <div className="space-y-1">
                          <label className="block text-[#1A1A1A]/50 font-mono text-[10px] uppercase font-bold">Dureté (Shore A)</label>
                          <input
                            type="text"
                            value={newProdHardness}
                            onChange={(e) => setNewProdHardness(e.target.value)}
                            placeholder="ex: 50 à 80 Shore A"
                            className="w-full bg-white border border-neutral-300 rounded px-2 py-1 outline-none focus:border-[#1A1A1A]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[#1A1A1A]/50 font-mono text-[10px] uppercase font-bold">Tolérances</label>
                          <input
                            type="text"
                            value={newProdTolerances}
                            onChange={(e) => setNewProdTolerances(e.target.value)}
                            placeholder="ex: ISO 3302-1 M2"
                            className="w-full bg-white border border-neutral-300 rounded px-2 py-1 outline-none focus:border-[#1A1A1A]"
                          />
                        </div>
                        <div className="col-span-2 space-y-1">
                          <label className="block text-[#1A1A1A]/50 font-mono text-[10px] uppercase font-bold">Volume de Série minimum</label>
                          <input
                            type="text"
                            value={newProdSeries}
                            onChange={(e) => setNewProdSeries(e.target.value)}
                            placeholder="ex: Moyennes et Grandes séries"
                            className="w-full bg-white border border-neutral-300 rounded px-2 py-1 outline-none focus:border-[#1A1A1A]"
                          />
                        </div>
                      </div>

                      {/* Elastomers Multi-Select Checkboxes */}
                      <div className="space-y-1.5">
                        <label className="block text-[#1A1A1A]/60 font-mono uppercase tracking-wider font-bold">Polymères supportés *</label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {["NBR", "EPDM", "FKM", "Silicone", "NR", "SBR"].map((mat) => {
                            const isChecked = newProdMaterials.includes(mat);
                            return (
                              <button
                                type="button"
                                key={mat}
                                onClick={() => handleToggleMaterial(mat)}
                                className={`px-2 py-1.5 border font-mono font-bold rounded text-[10px] text-center transition-all cursor-pointer ${
                                  isChecked
                                    ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                                    : "bg-white text-neutral-500 border-neutral-300 hover:border-neutral-500"
                                }`}
                              >
                                {mat}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Photo du produit (Image input / upload) */}
                      <div className="space-y-2 border-t border-dashed border-neutral-200 pt-3">
                        <label className="block text-[#1A1A1A]/60 font-mono uppercase tracking-wider font-bold">Photo du Produit</label>
                        
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => { setImageInputMethod("file"); }}
                            className={`flex-1 py-1 text-[10px] font-mono font-bold border rounded transition-all cursor-pointer ${
                              imageInputMethod === "file"
                                ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                                : "bg-white text-neutral-500 border-neutral-300 hover:border-neutral-500"
                            }`}
                          >
                            Fichier image (Max 2Mo)
                          </button>
                          <button
                            type="button"
                            onClick={() => { setImageInputMethod("url"); }}
                            className={`flex-1 py-1 text-[10px] font-mono font-bold border rounded transition-all cursor-pointer ${
                              imageInputMethod === "url"
                                ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                                : "bg-white text-neutral-500 border-neutral-300 hover:border-neutral-500"
                            }`}
                          >
                            Saisir une URL
                          </button>
                        </div>

                        {imageInputMethod === "file" ? (
                          <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => {
                              e.preventDefault();
                              setIsDragging(false);
                              const file = e.dataTransfer.files?.[0];
                              if (file) {
                                processFile(file, (base64) => {
                                  setNewProdImageUrl(base64);
                                  triggerToast("Succès : Photo prête !");
                                });
                              }
                            }}
                            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                              isDragging ? "border-orange-500 bg-orange-50" : "border-neutral-300 hover:border-[#1A1A1A]"
                            }`}
                          >
                            <input
                              type="file"
                              id="new-product-file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleFileChange}
                            />
                            <label htmlFor="new-product-file" className="cursor-pointer flex flex-col items-center gap-1.5">
                              <Upload className="w-6 h-6 text-neutral-400" />
                              <span className="font-mono text-[11px] text-neutral-600 font-bold">
                                Déposez ou <span className="text-orange-600 underline">parcourez</span> une image
                              </span>
                              <span className="text-[9px] text-neutral-400">Taille maximale : 2 Mo (PNG, JPG)</span>
                            </label>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newProdImageUrl.startsWith("data:") ? "" : newProdImageUrl}
                              onChange={(e) => setNewProdImageUrl(e.target.value)}
                              placeholder="ex: https://images.unsplash.com/photo-..."
                              className="flex-1 bg-[#F9F9F7] border border-neutral-300 rounded px-3 py-2 outline-none focus:border-[#1A1A1A] text-xs"
                            />
                          </div>
                        )}

                        {/* Image preview & removal */}
                        {newProdImageUrl && (
                          <div className="relative w-24 h-24 border border-neutral-200 rounded overflow-hidden group bg-neutral-100 flex items-center justify-center">
                            <img src={newProdImageUrl} alt="Aperçu" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <button
                              type="button"
                              onClick={() => setNewProdImageUrl("")}
                              className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-90 transition-colors shadow cursor-pointer"
                              title="Supprimer la photo"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Points Forts (Features) */}
                      <div className="space-y-1.5">
                        <label className="block text-[#1A1A1A]/60 font-mono uppercase tracking-wider font-bold">Points Forts (Avantages)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newProdFeatureInput}
                            onChange={(e) => setNewProdFeatureInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addFeature();
                              }
                            }}
                            placeholder="ex: Tenue extrême aux hydrocarbures"
                            className="flex-1 bg-[#F9F9F7] border border-neutral-300 rounded px-2 py-1 outline-none focus:border-[#1A1A1A]"
                          />
                          <button
                            type="button"
                            onClick={addFeature}
                            className="px-3 py-1 bg-[#1A1A1A] text-white rounded font-bold hover:bg-orange-600 transition-colors cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                        {newProdFeatures.length > 0 && (
                          <ul className="space-y-1 pt-1 bg-neutral-50 p-2 rounded border border-neutral-100 max-h-24 overflow-y-auto">
                            {newProdFeatures.map((feat, idx) => (
                              <li key={idx} className="flex justify-between items-center text-[10px] text-neutral-700 bg-white border border-neutral-200 px-2 py-1 rounded">
                                <span className="truncate max-w-[85%]">{feat}</span>
                                <button
                                  type="button"
                                  onClick={() => removeFeature(idx)}
                                  className="text-red-500 font-bold hover:text-red-700 font-mono px-1 cursor-pointer"
                                >
                                  ×
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {/* Applications */}
                      <div className="space-y-1.5">
                        <label className="block text-[#1A1A1A]/60 font-mono uppercase tracking-wider font-bold">Domaines d'Application</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newProdApplicationInput}
                            onChange={(e) => setNewProdApplicationInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addApplication();
                              }
                            }}
                            placeholder="ex: Machines d'emballage"
                            className="flex-1 bg-[#F9F9F7] border border-neutral-300 rounded px-2 py-1 outline-none focus:border-[#1A1A1A]"
                          />
                          <button
                            type="button"
                            onClick={addApplication}
                            className="px-3 py-1 bg-[#1A1A1A] text-white rounded font-bold hover:bg-orange-600 transition-colors cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                        {newProdApplications.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1 bg-neutral-50 p-2 rounded border border-neutral-100 max-h-24 overflow-y-auto">
                            {newProdApplications.map((app, idx) => (
                              <span key={idx} className="flex items-center gap-1 text-[10px] text-neutral-700 bg-white border border-neutral-200 px-2 py-0.5 rounded">
                                <span>{app}</span>
                                <button
                                  type="button"
                                  onClick={() => removeApplication(idx)}
                                  className="text-red-500 font-bold hover:text-red-700 font-mono cursor-pointer"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Submit button */}
                      <div className="flex gap-2 mt-2">
                        {editingProductId && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProductId(null);
                              // reset fields
                              setNewProdName("");
                              setNewProdDescription("");
                              setNewProdImageUrl("");
                              setNewProdHardness("50 à 80 Shore A");
                              setNewProdMaterials(["NBR", "EPDM"]);
                              setNewProdSeries("Moyennes et Grandes séries");
                              setNewProdTolerances("ISO 3302-1 Classe M2");
                              setNewProdFeatures([
                                "Résistance aux conditions de service sévères",
                                "Finition de haute précision conforme aux normes"
                              ]);
                              setNewProdApplications([
                                "Secteur industriel général",
                                "Systèmes d'étanchéité"
                              ]);
                              triggerToast("Édition annulée.");
                            }}
                            className="flex-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 font-bold uppercase tracking-wider py-3 rounded-lg transition-colors cursor-pointer text-xs"
                          >
                            Annuler
                          </button>
                        )}
                        <button
                          type="submit"
                          className="flex-[2] bg-[#1A1A1A] hover:bg-orange-600 text-white font-bold uppercase tracking-wider py-3 rounded-lg transition-colors cursor-pointer text-xs flex items-center justify-center gap-2"
                        >
                          {editingProductId ? (
                            <>
                              <Edit3 className="w-4 h-4 text-orange-400" />
                              <span>Enregistrer les modifications</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 text-orange-400" />
                              <span>Ajouter au Catalogue</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Right Panel: Categories Management & Current Catalog list */}
                  <div className="lg:col-span-7 space-y-6">
                    
                    {/* Category Management Card */}
                    <div className="bg-white rounded-xl border-2 border-[#1A1A1A] p-5 shadow-sm space-y-4">
                      <div className="border-b border-neutral-100 pb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Layers className="w-5 h-5 text-orange-600" />
                          <h3 className="font-serif font-black italic text-base">Gestion des Catégories</h3>
                        </div>
                        <span className="text-xs text-neutral-500 font-mono">
                          {categories.length} catégories
                        </span>
                      </div>

                      {/* Add / Edit category form */}
                      <div className="space-y-2">
                        {editingCategory && (
                          <div className="text-[10px] text-orange-600 font-bold font-mono uppercase bg-orange-50 border border-orange-100 px-2 py-1 rounded inline-block animate-fadeIn">
                            Mode Édition : Modification de "{editingCategory.label}"
                          </div>
                        )}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder={editingCategory ? "Nouveau nom de la catégorie..." : "Nom de la nouvelle catégorie... (ex: Pièces Marines)"}
                            value={newCategoryLabel}
                            onChange={(e) => setNewCategoryLabel(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleCreateCategory();
                              }
                            }}
                            className="flex-1 bg-[#F9F9F7] border border-neutral-300 rounded px-3 py-2 outline-none focus:border-[#1A1A1A] text-xs"
                          />
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={handleCreateCategory}
                              className="px-4 py-2 bg-[#1A1A1A] hover:bg-orange-600 text-white rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0"
                            >
                              {editingCategory ? (
                                <>
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Enregistrer</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Créer</span>
                                </>
                              )}
                            </button>
                            {editingCategory && (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingCategory(null);
                                  setNewCategoryLabel("");
                                }}
                                className="px-3 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded text-xs font-bold transition-all cursor-pointer shrink-0"
                              >
                                Annuler
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Deletion Warning Box */}
                      {deletingCategoryId && (() => {
                        const cat = categories.find(c => c.id === deletingCategoryId);
                        if (!cat) return null;
                        const count = products.filter(p => p.category === cat.id).length;
                        return (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3.5 my-2 text-xs text-red-950 space-y-2.5 animate-fadeIn">
                            <div className="font-bold flex items-center gap-2 text-red-700">
                              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 animate-bounce" />
                              <span className="tracking-wide">ATTENTION : SUPPRESSION DE CATÉGORIE</span>
                            </div>
                            <p className="leading-relaxed">
                              Êtes-vous sûr de vouloir supprimer la catégorie <strong className="text-neutral-900 bg-white px-1.5 py-0.5 rounded border border-neutral-200">"{cat.label}"</strong> ?
                              <br />
                              <span className="text-red-700 inline-block mt-1 font-semibold">
                                ⚠️ Cela supprimera également définitivement les <strong className="underline font-bold">{count} produit(s)</strong> associés à cette catégorie.
                              </span>
                            </p>
                            <div className="flex gap-2 justify-end pt-1">
                              <button
                                type="button"
                                onClick={() => setDeletingCategoryId(null)}
                                className="px-3 py-1.5 bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-300 rounded font-bold cursor-pointer transition-colors text-xs"
                              >
                                Annuler
                              </button>
                              <button
                                type="button"
                                onClick={async () => {
                                  const success = await onDeleteCategory(cat.id);
                                  if (success) {
                                    triggerToast(`Succès : La catégorie "${cat.label}" et tous ses produits ont été supprimés.`);
                                  }
                                  setDeletingCategoryId(null);
                                }}
                                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded font-bold cursor-pointer transition-colors text-xs"
                              >
                                Supprimer la catégorie et ses produits
                              </button>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Categories list */}
                      <div className="flex flex-wrap gap-2 pt-2 max-h-[150px] overflow-y-auto">
                        {categories.map((cat) => {
                          const count = products.filter(p => p.category === cat.id).length;
                          const isSelectedForDeletion = deletingCategoryId === cat.id;

                          return (
                            <div
                              key={cat.id}
                              className={`flex items-center gap-2 border rounded-lg px-2.5 py-1.5 text-xs transition-colors shrink-0 ${
                                isSelectedForDeletion 
                                  ? "bg-red-50 border-red-400 text-red-800 ring-2 ring-red-200" 
                                  : "bg-[#F9F9F7] border-neutral-300 text-[#1A1A1A]"
                              }`}
                            >
                              <span className="font-medium">{cat.label}</span>
                              <span className={`text-[9px] font-mono px-1 py-0.5 rounded-full font-bold ${
                                isSelectedForDeletion ? "bg-red-200 text-red-800" : "bg-neutral-200/50 text-neutral-500"
                              }`}>
                                {count}
                              </span>

                              <div className="flex items-center gap-1 ml-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingCategory(cat);
                                    setNewCategoryLabel(cat.label);
                                    setDeletingCategoryId(null); // Clear deleting selection when editing
                                    triggerToast(`Mode édition de la catégorie : "${cat.label}"`);
                                  }}
                                  className={`p-0.5 rounded cursor-pointer transition-colors ${
                                    isSelectedForDeletion ? "text-red-700 hover:text-red-900" : "text-orange-600 hover:text-orange-800"
                                  }`}
                                  title="Modifier le nom de la catégorie"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setDeletingCategoryId(cat.id);
                                    setEditingCategory(null); // Clear editing mode when selecting for deletion
                                  }}
                                  className={`p-0.5 rounded text-sm font-bold font-mono leading-none cursor-pointer transition-colors ${
                                    isSelectedForDeletion ? "text-red-800 font-extrabold" : "text-red-500 hover:text-red-700"
                                  }`}
                                  title="Supprimer la catégorie"
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          );
                        })}
                        {categories.length === 0 && (
                          <div className="text-neutral-400 text-xs italic">
                            Aucune catégorie définie. Veuillez en créer une ci-dessus.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Catalog list with Deletion */}
                    <div className="bg-white rounded-xl border-2 border-[#1A1A1A] p-5 shadow-sm space-y-4">
                      <div className="border-b border-neutral-100 pb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Database className="w-5 h-5 text-orange-600" />
                          <h3 className="font-serif font-black italic text-base">Pièces Actuellement au Catalogue</h3>
                        </div>
                        <span className="text-xs text-neutral-500 font-mono">
                          {products.length} articles
                        </span>
                      </div>

                      <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-1">
                        {products.map((p) => (
                          <div key={p.id} className="border border-neutral-200 rounded-lg p-3 hover:border-[#1A1A1A] transition-all bg-[#F9F9F7]/40 flex flex-col gap-3">
                            <div className="flex justify-between items-start gap-4">
                              {/* Product Thumbnail */}
                              <div className="w-16 h-16 rounded border border-neutral-300 overflow-hidden bg-white shrink-0 relative flex items-center justify-center">
                                {p.imageUrl ? (
                                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                ) : (
                                  <div className="text-neutral-300 flex flex-col items-center">
                                    <ImageIcon className="w-6 h-6 text-neutral-300" />
                                    <span className="text-[7px] font-mono uppercase text-neutral-400 mt-1">Aucun</span>
                                  </div>
                                )}
                              </div>

                              <div className="space-y-1 flex-1 text-left">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-serif font-bold text-sm text-[#1A1A1A]">{p.name}</h4>
                                  <span className="text-[9px] font-mono uppercase bg-[#1A1A1A]/10 text-[#1A1A1A] px-1.5 py-0.5 rounded font-bold">
                                    {categories.find(c => c.id === p.category)?.label || p.category}
                                  </span>
                                </div>
                                <p className="text-neutral-500 text-[11px] leading-relaxed line-clamp-2">{p.description}</p>
                                
                                <div className="flex items-center gap-4 text-[10px] font-mono text-neutral-400 pt-1 flex-wrap">
                                  <div>
                                    <span className="font-bold">Dureté:</span> <span className="text-neutral-600">{p.specs.hardness}</span>
                                  </div>
                                  <div>
                                    <span className="font-bold">Polymères:</span> <span className="text-neutral-600">{p.specs.materials.join(", ")}</span>
                                  </div>
                                </div>

                                {/* Manage Photo button */}
                                <button
                                  type="button"
                                  onClick={() => setEditingPhotoProductId(editingPhotoProductId === p.id ? null : p.id)}
                                  className="mt-2 text-[10px] font-mono font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer hover:underline"
                                >
                                  <Upload className="w-3.5 h-3.5" />
                                  <span>{p.imageUrl ? "Changer / Supprimer la photo" : "Ajouter une photo"}</span>
                                </button>
                              </div>

                              {deletingProductId === p.id ? (
                                <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-lg p-1 animate-fadeIn shrink-0">
                                  <span className="text-[10px] font-bold text-red-700 px-1 font-mono uppercase">Sûr ?</span>
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      const success = await onDeleteProduct(p.id);
                                      if (success) {
                                        triggerToast(`Succès : "${p.name}" a été supprimé !`);
                                      } else {
                                        triggerToast(`Erreur : Impossible de supprimer "${p.name}" !`);
                                      }
                                      setDeletingProductId(null);
                                    }}
                                    className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white rounded cursor-pointer transition-colors"
                                  >
                                    Oui
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeletingProductId(null)}
                                    className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded cursor-pointer transition-colors"
                                  >
                                    Non
                                  </button>
                                </div>
                              ) : (
                                <div className="flex gap-1.5 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingProductId(p.id);
                                      setNewProdName(p.name);
                                      setNewProdCategory(p.category || "");
                                      setNewProdDescription(p.description);
                                      setNewProdImageUrl(p.imageUrl || "");
                                      setNewProdHardness(p.specs.hardness);
                                      setNewProdMaterials(p.specs.materials);
                                      setNewProdSeries(p.specs.series);
                                      setNewProdTolerances(p.specs.tolerances);
                                      setNewProdFeatures(p.features || []);
                                      setNewProdApplications(p.applications || []);
                                      triggerToast(`Mode édition activé pour : "${p.name}"`);
                                    }}
                                    className="p-2 rounded bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors cursor-pointer"
                                    title="Modifier les informations"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeletingProductId(p.id)}
                                    className="p-2 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                                    title="Supprimer du catalogue"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Inline Photo Editor Panel */}
                            {editingPhotoProductId === p.id && (
                              <div className="mt-2 pt-3 border-t border-dashed border-neutral-200 space-y-3 bg-white p-3 rounded border border-neutral-200 text-left w-full">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-mono font-bold text-[#1A1A1A]/70 uppercase">Photo de : {p.name}</span>
                                  <button
                                    type="button"
                                    onClick={() => setEditingPhotoProductId(null)}
                                    className="text-[10px] text-neutral-400 hover:text-neutral-600 font-bold"
                                  >
                                    Fermer
                                  </button>
                                </div>
                                
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setEditImageInputMethod("file")}
                                    className={`flex-1 py-1 text-[10px] font-mono font-bold border rounded transition-all cursor-pointer ${
                                      editImageInputMethod === "file"
                                        ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                                        : "bg-white text-neutral-500 border-neutral-200"
                                    }`}
                                  >
                                    Fichier image (Max 2Mo)
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditImageInputMethod("url")}
                                    className={`flex-1 py-1 text-[10px] font-mono font-bold border rounded transition-all cursor-pointer ${
                                      editImageInputMethod === "url"
                                        ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                                        : "bg-white text-neutral-500 border-neutral-200"
                                    }`}
                                  >
                                    URL d'image
                                  </button>
                                </div>

                                {editImageInputMethod === "file" ? (
                                  <div
                                    onDragOver={(e) => { e.preventDefault(); setIsEditDragging(true); }}
                                    onDragLeave={() => setIsEditDragging(false)}
                                    onDrop={(e) => {
                                      e.preventDefault();
                                      setIsEditDragging(false);
                                      const file = e.dataTransfer.files?.[0];
                                      if (file) handleEditFileSelected(file, p);
                                    }}
                                    className={`border-2 border-dashed rounded-lg p-3 text-center transition-colors cursor-pointer ${
                                      isEditDragging ? "border-orange-500 bg-orange-50" : "border-neutral-300 hover:border-[#1A1A1A]"
                                    }`}
                                  >
                                    <input
                                      type="file"
                                      id={`edit-file-input-${p.id}`}
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleEditFileSelected(file, p);
                                      }}
                                    />
                                    <label htmlFor={`edit-file-input-${p.id}`} className="cursor-pointer flex flex-col items-center gap-1">
                                      <Upload className="w-4 h-4 text-neutral-400" />
                                      <span className="text-[10px] font-mono text-neutral-600">
                                        Glissez ou <span className="text-orange-600 underline font-bold">sélectionnez</span>
                                      </span>
                                    </label>
                                  </div>
                                ) : (
                                  <div className="space-y-1.5">
                                    <input
                                      type="text"
                                      placeholder="Saisissez l'URL de la photo..."
                                      id={`edit-url-input-${p.id}`}
                                      defaultValue={p.imageUrl || ""}
                                      onBlur={(e) => {
                                        handleEditUrlSave(e.target.value, p);
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          e.preventDefault();
                                          handleEditUrlSave((e.target as HTMLInputElement).value, p);
                                        }
                                      }}
                                      className="w-full bg-[#F9F9F7] border border-neutral-300 rounded px-2 py-1 text-[11px] outline-none focus:border-[#1A1A1A]"
                                    />
                                    <p className="text-[8px] text-neutral-400 font-mono">Appuyez sur Entrée ou cliquez en dehors pour enregistrer.</p>
                                  </div>
                                )}

                                {p.imageUrl && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = { ...p };
                                      delete updated.imageUrl;
                                      onUpdateProduct(updated);
                                      triggerToast("Succès : Photo retirée !");
                                      setEditingPhotoProductId(null);
                                    }}
                                    className="w-full py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-[10px] font-mono font-bold uppercase rounded cursor-pointer transition-colors"
                                  >
                                    Retirer la photo actuelle
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        ))}

                      {products.length === 0 && (
                        <div className="text-center py-12 text-neutral-400">
                          Aucune pièce dans le catalogue. Utilisez le formulaire de gauche pour en ajouter.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
