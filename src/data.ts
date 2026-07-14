import { Product, MaterialInfo, Machine, Category } from "./types";

export const INITIAL_CATEGORIES: Category[] = [
  { id: "molded", label: "Moulées de Précision" },
  { id: "profile", label: "Profilés Extrudés" },
  { id: "bonded", label: "Caoutchouc-Métal" },
  { id: "custom", label: "Bureau d'Études / Sur Mesure" },
];

export const PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Joints d'Étanchéité Techniques",
    category: "molded",
    description: "Joints toriques, joints plats, clapets et bagues d'étanchéité hautes performances moulés sur mesure pour résister aux pressions élevées et aux fluides agressifs.",
    imagePrompt: "precision_rubber_o_rings",
    specs: {
      hardness: "40 à 90 Shore A",
      materials: ["NBR", "EPDM", "FKM", "Silicone"],
      series: "Moyennes et Grandes séries uniquement",
      tolerances: "ISO 3302-1 Classe M1/M2"
    },
    features: [
      "Résistance chimique selon formulation (huiles, hydrocarbures, acides)",
      "Excellente reprise élastique (déformation rémanente à la compression optimisée)",
      "Finition ébavurée de haute précision pour étanchéité dynamique ou statique"
    ],
    applications: ["Moteurs industriels", "Systèmes hydrauliques", "Vannes et pompes de transfert", "Équipements de filtration"],
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "prod-2",
    name: "Soufflets de Protection & Manchons",
    category: "molded",
    description: "Soufflets d'étanchéité et manchons de passage souples en caoutchouc conçus pour la protection d'organes mécaniques mobiles contre la poussière, l'eau et l'huile.",
    imagePrompt: "rubber_bellows_industrial",
    specs: {
      hardness: "50 à 75 Shore A",
      materials: ["EPDM", "CR (Néoprène)", "NBR"],
      series: "Grandes séries par injection",
      tolerances: "ISO 3302-1 Classe M2"
    },
    features: [
      "Grande résistance à la fatigue en flexion répétée (cycles alternatifs)",
      "Formulation résistante à l'ozone et au vieillissement atmosphérique",
      "Épaisseur de paroi rigoureusement constante pour un déploiement homogène"
    ],
    applications: ["Transmissions automobiles", "Vérins pneumatiques et hydrauliques", "Passages de câbles étanches", "Lignes d'assemblage"],
    imageUrl: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "prod-3",
    name: "Amortisseurs & Butées Anti-vibrations",
    category: "molded",
    description: "Amortisseurs de choc, plots antivibratoires (Silentblocks) et butées élastiques pour isoler les bruits de structure et absorber l'énergie d'impact.",
    imagePrompt: "rubber_metal_silent_block",
    specs: {
      hardness: "55 à 80 Shore A",
      materials: ["NR (Caoutchouc Naturel)", "SBR", "EPDM"],
      series: "Moyennes et Grandes séries",
      tolerances: "ISO 3302-1 Classe M2 / M3"
    },
    features: [
      "Taux d'amortissement dynamique exceptionnel pour le caoutchouc naturel",
      "Option de surmoulage caoutchouc-métal (adhérisation chimique sur acier/laiton)",
      "Excellente résistance à la déchirure et aux surcharges mécaniques"
    ],
    applications: ["Supports moteurs", "Suspensions de machines industrielles", "Butées d'arrêt de pont roulant", "Châssis d'équipements ferroviaires"],
    imageUrl: "https://images.unsplash.com/photo-1537462715879-360eeb61a0bc?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "prod-4",
    name: "Profilés Extrudés & Joints de Vitrage",
    category: "profile",
    description: "Profilés d'étanchéité linéaires, cordes de caoutchouc et joints de vitrage produits par extrusion continue puis découpés ou vulcanisés en anneau.",
    imagePrompt: "rubber_extrusion_profiles",
    specs: {
      hardness: "60 à 80 Shore A",
      materials: ["EPDM", "NBR", "CR"],
      series: "Grandes séries (mètres linéaires élevés)",
      tolerances: "ISO 3302-1 Classe E1/E2"
    },
    features: [
      "Disponible en caoutchouc compact, cellulaire ou co-extrudé (bi-matière)",
      "Vulcanisation continue garantissant des propriétés géométriques régulières",
      "Soudure d'angle par vulcanisation à chaud pour cadres étanches"
    ],
    applications: ["Joints d'étanchéité de portières de véhicules", "Cabines d'engins agricoles", "Profilés de menuiserie alu", "Goulottes d'étanchéité industrielles"],
    imageUrl: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "prod-5",
    name: "Pièces Caoutchouc-Métal Techniques",
    category: "bonded",
    description: "Pièces composites combinant un corps en caoutchouc élastique solidement lié par liaison chimique à des inserts rigides en acier, aluminium, inox ou laiton.",
    imagePrompt: "rubber_metal_bonded_parts",
    specs: {
      hardness: "50 à 85 Shore A",
      materials: ["NR", "NBR", "EPDM", "FKM"],
      series: "Moyennes et Grandes séries",
      tolerances: "ISO 3302-1 Classe M2"
    },
    features: [
      "Traitement de surface des inserts (sablage et application d'un primaire d'adhérisation)",
      "Liaison chimique indestructible supérieure à la résistance du caoutchouc lui-même",
      "Intégration de fonctions de fixation directe et d'amortissement combinées"
    ],
    applications: ["Rotules mécaniques", "Turbines de pompes d'eau", "Rouleaux d'entraînement recouverts", "Amortisseurs de torsion renforcés"],
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "prod-6",
    name: "Membranes Souples Renforcées",
    category: "custom",
    description: "Membranes d'étanchéité et de régulation minces, homogènes ou renforcées par un pli textile en polyester ou polyamide pour résister à des pressions cycliques.",
    imagePrompt: "rubber_diaphragms_actuators",
    specs: {
      hardness: "50 à 70 Shore A",
      materials: ["NBR", "EPDM", "Viton", "Silicone"],
      series: "Moyennes et Grandes séries techniques",
      tolerances: "ISO 3302-1 Classe M1"
    },
    features: [
      "Épaisseurs minimales contrôlées pour une flexibilité maximale",
      "Possibilité d'incorporer un tissu technique de renfort pour prévenir l'éclatement",
      "Excellente étanchéité aux gaz et résistance à la fatigue de flexion"
    ],
    applications: ["Régulateurs de pression de gaz", "Pompes de dosage de fluides", "Actionneurs pneumatiques", "Systèmes de freinage"],
    imageUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=800"
  }
];

export const MATERIALS: MaterialInfo[] = [
  {
    id: "mat-nbr",
    name: "NBR",
    fullName: "Nitrile (Caoutchouc Butadiène-Acrylonitrile)",
    tempRange: "-30°C à +100°C (courtes pointes à 120°C)",
    hardnessRange: "40 à 90 Shore A",
    strengths: [
      "Excellente résistance aux huiles minérales, graisses et carburants",
      "Bonnes propriétés mécaniques (abrasion, traction)",
      "Excellente déformation rémanente à la compression (DRC)"
    ],
    weaknesses: [
      "Sensible à l'ozone, aux UV et aux intempéries (vieillissement extérieur)",
      "Faible résistance aux solvants polaires (cétones, esters)"
    ],
    color: "emerald",
    commonApplications: ["Joints toriques de circuits d'huile", "Membranes de carburateurs", "Durites d'admission d'air gras", "Racleurs industriels"]
  },
  {
    id: "mat-epdm",
    name: "EPDM",
    fullName: "Éthylène-Propylène-Diène Monomère",
    tempRange: "-40°C à +130°C (vapeur jusqu'à 150°C)",
    hardnessRange: "30 à 90 Shore A",
    strengths: [
      "Résistance exceptionnelle à l'ozone, aux UV et au vieillissement",
      "Excellente tenue à l'eau chaude, à la vapeur et aux liquides de frein",
      "Très bon comportement aux températures négatives"
    ],
    weaknesses: [
      "Incompatible avec les huiles minérales, graisses de pétrole et hydrocarbures",
      "Faible résistance aux solvants pétroliers"
    ],
    color: "blue",
    commonApplications: ["Joints de carrosserie et vitrage", "Flexibles d'eau chaude sanitaire", "Membranes de vases d'expansion", "Passe-fils extérieurs"]
  },
  {
    id: "mat-fkm",
    name: "FKM / Viton®",
    fullName: "Caoutchouc Fluorocarboné",
    tempRange: "-20°C à +250°C",
    hardnessRange: "50 à 90 Shore A",
    strengths: [
      "Résistance thermique extrême (ne se dégrade pas à haute température)",
      "Inertie chimique quasi universelle face aux acides, bases et hydrocarbures",
      "Faible perméabilité aux gaz"
    ],
    weaknesses: [
      "Sensible aux solvants polaires (cétones, esters, solvants d'acides forts)",
      "Devient cassant aux températures très basses (sous -20°C)",
      "Coût élevé de la matière première"
    ],
    color: "orange",
    commonApplications: ["Joints moteurs aéronautiques", "Équipements pétrochimiques", "Systèmes d'échappement et de dépollution", "Tuyauteries chimiques agressives"]
  },
  {
    id: "mat-vmq",
    name: "VMQ (Silicone)",
    fullName: "Vinyl Méthyl Silicone",
    tempRange: "-60°C à +200°C (formulations spéciales à +250°C)",
    hardnessRange: "30 à 80 Shore A",
    strengths: [
      "Inertie physiologique et biocompatibilité totale (parfait pour le contact médical/alimentaire)",
      "Plage thermique d'utilisation la plus large du marché",
      "Excellente tenue aux intempéries, à l'ozone et à l'arc électrique"
    ],
    weaknesses: [
      "Faibles propriétés mécaniques (faible résistance à la déchirure, à l'abrasion et à la coupure)",
      "Perméable aux gaz",
      "Gonflement élevé dans les huiles minérales et hydrocarbures"
    ],
    color: "rose",
    commonApplications: ["Joints de fours et autoclaves", "Tuyaux pour liquides alimentaires", "Pièces de dispositifs médicaux", "Éléments d'isolation thermique souples"]
  },
  {
    id: "mat-nr",
    name: "NR",
    fullName: "Caoutchouc Naturel (Polyisoprène)",
    tempRange: "-50°C à +80°C",
    hardnessRange: "35 à 90 Shore A",
    strengths: [
      "Élastomère le plus élastique avec la meilleure reprise élastique",
      "Résistance à la fatigue dynamique et à l'abrasion exceptionnelle",
      "Très haute résistance à la déchirure et à la traction"
    ],
    weaknesses: [
      "Faible résistance aux huiles, carburants et agents atmosphériques (ozone/UV)",
      "Vieillit et ramollit rapidement au-delà de 80°C"
    ],
    color: "lime",
    commonApplications: ["Supports moteurs élastiques (Silentblocks)", "Pneus industriels pleins", "Bandes de convoyeurs de granulats", "Membranes de pompes d'aspiration de solides"]
  }
];

export const MACHINES: Machine[] = [
  {
    id: "mach-1",
    name: "Presses à Injecter Caoutchouc de Dernière Génération",
    type: "injection",
    capacity: "Forces de fermeture de 150 à 450 Tonnes - Volumes injectables jusqu'à 3000 cm³",
    features: [
      "Régulation thermique ultra-précise par zones",
      "Systèmes d'aspiration sous vide pour éliminer les inclusions d'air",
      "Alimentation automatique en bande de caoutchouc froid calibrée",
      "Automatisation des plateaux démouleurs pour cycles à haute cadence"
    ],
    description: "Le moulage par injection est la méthode de choix pour la fabrication à haute productivité de pièces complexes, garantissant une régularité géométrique absolue d'une pièce à l'autre.",
    benefits: [
      "Idéal pour les grandes et très grandes séries de pièces (réduction drastique des coûts unitaires)",
      "Absence de bavures importantes et excellente maîtrise des cotes de précision",
      "Cycles de vulcanisation courts grâce à la matière préchauffée injectée sous haute pression"
    ]
  },
  {
    id: "mach-2",
    name: "Presses de Moulage par Compression sous Vide",
    type: "compression",
    capacity: "Plateaux chauffants jusqu'à 800 x 800 mm - Pression hydraulique jusqu'à 350 Tonnes",
    features: [
      "Cloches de mise sous vide intégrées pour éviter l'oxydation thermique",
      "Enregistrement numérique continu des cycles de vulcanisation (pression/température)",
      "Adaptation facile pour le surmoulage d'inserts métalliques ou de tissus techniques",
      "Conception modulaire permettant de multiples cavités"
    ],
    description: "Le moulage par compression consiste à introduire une ébauche de caoutchouc pré-pesée directement dans l'empreinte du moule chaud avant sa fermeture. C'est le procédé idéal pour les moyennes séries et les pièces massives.",
    benefits: [
      "Coûts d'outillage (moules) plus abordables, rendant les moyennes séries économiquement viables",
      "Parfait pour les pièces volumineuses ou de forte épaisseur exigeant un long temps de cuisson",
      "Excellent contrôle de l'orientation des fibres lors du moulage de pièces composites armées"
    ]
  }
];
