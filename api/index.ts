import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import pg from "pg";
const { Pool } = pg;

// Fallback technical recommendations in case GEMINI_API_KEY is not defined
const fallbackAdvise = (userInput: string): string => {
  const query = userInput.toLowerCase().trim();
  
  // 1. Handling greetings and small talk
  if (query === "bonjour" || query === "salut" || query === "hello" || query === "hey" || query === "bonsoir" || query === "tu es la" || query === "tu es là") {
    return `### ⚙️ Bonjour ! Je suis l'ingénieur-conseil virtuel du Bureau d'Études de Eurl TCP.

Comment puis-je vous aider dans votre projet de pièces techniques en caoutchouc aujourd'hui ? 

Pour que je puisse formuler une recommandation précise, n'hésitez pas à me donner des détails sur :
1. **L'environnement d'utilisation** (contact avec des huiles, de l'eau, exposition UV, acides...)
2. **La plage de température** de travail (en °C)
3. **Le type de pièce** (joint, soufflet, silentblock, pièce surmoulée caoutchouc-métal...)
4. **La quantité estimée** (moyenne ou grande série)

*Je suis prêt à analyser vos contraintes techniques !*`;
  }

  if (query.includes("comment ça va") || query.includes("ca va") || query.includes("tu vas bien") || query.includes("marche") || query.includes("test") || query.includes("fonctionne")) {
    return `### ⚡ Système d'Ingénierie TCP Opérationnel à 100%

Tout fonctionne parfaitement ! Nos algorithmes de co-conception 2D/3D et notre base de données de formulations macromoléculaires sont pleinement opérationnels.

Vous pouvez me soumettre vos cahiers des charges techniques ou me poser des questions sur les élastomères de haute performance (NBR, EPDM, FKM, VMQ, NR). Que souhaitez-vous concevoir aujourd'hui ?`;
  }

  if (query.includes("merci") || query.includes("super") || query.includes("parfait") || query.includes("génial") || query.includes("ok")) {
    return `### 👍 Avec grand plaisir !

Le Bureau d'Études de **Eurl TCP** reste en permanence à vos côtés pour transformer vos concepts en pièces industrielles de précision.

N'hésitez pas à :
- **Utiliser notre Configurateur de Devis** (en bas de page) pour soumettre des volumes de série précis.
- Me poser d'autres questions sur la vulcanisation, le surmoulage d'inserts ou les tolérances **ISO 3302-1**.
- Contacter directement nos ingénieurs par e-mail à **eurl.tcp@gmail.com** pour des analyses de laboratoire personnalisées.`;
  }

  if (query.includes("qui es-tu") || query.includes("qui es tu") || query.includes("aide") || query.includes("help") || query.includes("bureau d'études") || query.includes("bureau d'etude")) {
    return `### 📐 Bureau d'Études Virtuel de Eurl TCP

Je suis une intelligence artificielle d'ingénierie conçue pour assister les bureaux d'études, les ingénieurs-mécaniques et les acheteurs industriels.

**Voici ce que je peux analyser pour vous :**
1. **Formulations macromoléculaires** : Choix optimal entre NBR (huiles), EPDM (extérieur/vapeur), FKM (chimie/haute température), VMQ (médical/alimentaire) et NR (amortissement).
2. **Calcul de moulabilité** : Préconisation entre **Moulage par Injection sous vide** (cadences élevées, formes complexes) et **Vulcanisation par Compression** (inserts lourds, pièces épaisses).
3. **Optimisation géométrique** : Conseils sur les rayons de courbure, épaisseurs uniformes et angles de dépouille (1° à 2°).

Posez-moi simplement votre question de conception mécanique !`;
  }

  // 2. Technical analysis logic
  let material = "NBR (Nitrile)";
  let materialTitle = "NBR (Nitrile / Butadiène-Acrylonitrile)";
  let explanation = "Par défaut, pour les milieux industriels standards avec présence d'huiles ou graisses, le NBR 70 Shore A est l'élastomère de référence en raison de sa faible déformation rémanente à la compression (DRC).";
  let process = "Moulage par Injection Directe sous vide";
  let processDesc = "Recommandé pour les moyennes et grandes séries pour garantir des cycles rapides et des tolérances dimensionnelles ultra-serrées (Classe M1/M2 selon l'ISO 3302-1).";

  // Match keyword constraints
  if (query.includes("eau") || query.includes("potable") || query.includes("ozone") || query.includes("uv") || query.includes("extérieur") || query.includes("intempérie") || query.includes("vapeur") || query.includes("soleil")) {
    material = "EPDM";
    materialTitle = "EPDM (Éthylène-Propylène-Diène Monomère)";
    explanation = "L'EPDM présente une résistance absolue à l'ozone, aux rayons UV, à la vapeur d'eau chaude (jusqu'à 130°C, formulations spéciales 150°C) et aux intempéries. Il est idéal pour les joints d'étanchéité extérieurs, l'automobile et les conduites d'eau sanitaire.";
  } else if (query.includes("huile") || query.includes("essence") || query.includes("carburant") || query.includes("graisse") || query.includes("hydrocarbure") || query.includes("diesel") || query.includes("gazole") || query.includes("moteur")) {
    material = "NBR";
    materialTitle = "NBR (Nitrile / Butadiène-Acrylonitrile)";
    explanation = "Le Nitrile offre une excellente barée aux hydrocarbures, huiles minérales, fluides hydrauliques et carburants de pétrole. Sa plage thermique de -30°C à +100°C couvre la majorité des applications mécaniques industrielles sous capot.";
  } else if (query.includes("haute température") || query.includes("chaleur") || query.includes("fkm") || query.includes("viton") || query.includes("chimique") || query.includes("acide") || query.includes("solvant") || query.includes("agressif")) {
    material = "FKM / Viton®";
    materialTitle = "FKM / Viton® (Caoutchouc Fluorocarboné de Haute Densité)";
    explanation = "Pour des applications haut de gamme soumises à de fortes contraintes chimiques (acides concentrés, carburants premium) ou des températures extrêmes allant de -20°C à +250°C, le FKM est incontournable. Il offre une perméabilité extrêmement faible.";
  } else if (query.includes("silicone") || query.includes("vmq") || query.includes("médical") || query.includes("alimentaire") || query.includes("fda") || query.includes("four") || query.includes("pharmacie")) {
    material = "VMQ (Silicone)";
    materialTitle = "VMQ (Silicone / Vinyl Méthyl Silicone)";
    explanation = "Le VMQ (Silicone) dispose d'une inertie chimique et physiologique absolue, certifiée FDA pour les contacts alimentaires ou médicaux. Sa flexibilité à froid extrême (-60°C) et sa résistance à chaud (+200°C) compensent ses caractéristiques mécaniques plus faibles (tenue à l'abrasion modérée).";
  } else if (query.includes("choc") || query.includes("silent") || query.includes("amortir") || query.includes("vibration") || query.includes("naturel") || query.includes("ressort") || query.includes("dynamique") || query.includes("fatigue") || query.includes("butée")) {
    material = "NR (Caoutchouc Naturel)";
    materialTitle = "NR (Caoutchouc Naturel / Polyisoprène)";
    explanation = "Le caoutchouc naturel offre la meilleure résilience dynamique, une reprise élastique optimale et une résistance à la fatigue par flexion répétée inégalée. Idéal pour les supports de moteurs (Silentblocks), butées d'amortisseurs et pièces d'usure mécanique sévère.";
  }

  // Process adjustments
  if (query.includes("grosse") || query.includes("grande") || query.includes("volume") || query.includes("série") || query.includes("1000") || query.includes("cadence") || query.includes("rapide")) {
    process = "Moulage par Injection Directe sous vide";
    processDesc = "Grâce à nos presses de dernière génération (150 à 450 T), l'injection directe sous vide permet de préchauffer la matière pour des cycles de cuisson extrêmement courts, une absence d'inclusions d'air et des tolérances de Classe M1.";
  } else if (query.includes("petite") || query.includes("pièce épaisse") || query.includes("surmoulage") || query.includes("métal") || query.includes("insert") || query.includes("lourd") || query.includes("gros")) {
    process = "Vulcanisation par Compression à chaud";
    processDesc = "Idéal pour les pièces à forte épaisseur ou pour le surmoulage d'inserts métalliques lourds (traitement chimique d'adhérisation caoutchouc-métal TCP). Ce procédé limite les coûts d'outillage moule pour les moyennes séries.";
  }

  return `### 🔬 Analyse Technique Virtuelle Eurl TCP

Voici les préconisations techniques préliminaires pour votre demande : "${userInput}"

#### 🧪 Choix Moléculaire Recommandé : **${materialTitle}**
* ${explanation}

#### ⚙️ Procédé Industriel Préconisé :
* **${process}**
  * ${processDesc}

#### 📐 Directives de Co-conception (D.F.M.) :
1. **Dépouilles de Démoulage** : Intégrez un angle de dépouille de **1° à 2°** sur les faces verticales pour faciliter l'éjection hors du moule sans déchirure.
2. **Uniformité des Épaisseurs** : Évitez les transitions d'épaisseurs trop brusques pour garantir une cinétique de vulcanisation homogène.
3. **Plan de Joint** : Positionnez-le de préférence sur une face fonctionnelle plane pour un ébavurage propre et esthétique.

---
*Analyse d'ingénierie simulée localement par le moteur TCP. Pour une étude de rhéologie en laboratoire, nos ingénieurs réels basés à Amizour (Béjaïa) sont à votre disposition par e-mail à **eurl.tcp@gmail.com**.*`;
};

const app = express();
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

const PORT = 3000;

// Endpoint 0: Verify admin passcode securely
app.post("/api/admin/verify", (req, res) => {
  const { passcode } = req.body;
  
  const correctPasscode = process.env.ADMIN_PASSCODE;
  if (!correctPasscode) {
    console.warn("[Security Alert] ADMIN_PASSCODE is not defined in the environment variables.");
    return res.status(500).json({ success: false, error: "Le système d'administration n'est pas configuré sur le serveur." });
  }

  if (typeof passcode !== "string" || passcode.trim() === "") {
    return res.status(400).json({ success: false, error: "Code d'accès invalide ou vide." });
  }

  if (passcode === correctPasscode) {
    return res.json({ success: true });
  }
  return res.status(401).json({ success: false, error: "Code d'accès incorrect" });
});

// Endpoint 1: Assistant technique Bureau d'Études (Gemini Integration)
app.post("/api/bureau-etudes", async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Le message est requis." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  
  // Check if key exists or has default placeholder value
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    console.log("GEMINI_API_KEY non configurée. Utilisation du moteur de conseil technique local.");
    const responseText = fallbackAdvise(message);
    return res.json({ response: responseText });
  }

  try {
    // Lazy initialization of Gemini SDK
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const systemInstruction = `Vous êtes l'ingénieur conseil principal du Bureau d'Études technique de Eurl TCP. 
Eurl TCP est un fabricant algérien de premier plan d'articles techniques en caoutchouc de haute précision, situé à : Eurl TCP, JWV4+FHW, Amizour 06008, Béjaïa, Algérie. Nos installations modernes combinent le moulage par injection directe sous vide de dernière génération et la vulcanisation par compression à chaud.

Votre mission est de guider de manière extrêmement professionnelle, technique et chaleureuse les clients industriels, les ingénieurs-concepteurs et les acheteurs dans le choix optimal de l'élastomère, du procédé industriel et des tolérances pour leurs projets sur-mesure (spécialisé dans les moyennes et grandes séries).

Voici votre base de connaissances interne exhaustive de l'entreprise à intégrer dans vos analyses :

========================================================================
1. CATALOGUE PRODUITS DE EURL TCP
========================================================================
- Joints d'Étanchéité Techniques : Joints toriques, joints plats, clapets, bagues d'étanchéité. Dureté : 40 à 90 Shore A. Matériaux : NBR, EPDM, FKM, Silicone. Tolérances ultra-serrées : ISO 3302-1 Classe M1/M2.
- Soufflets de Protection & Manchons : Pour protections mobiles d'organes mécaniques, étanches à la poussière, à l'eau et aux huiles. Excellente tenue à la flexion répétée. Dureté : 50 à 75 Shore A. Matériaux : EPDM, CR (Néoprène), NBR. Tolérances : ISO 3302-1 Classe M2.
- Amortisseurs & Butées Anti-vibrations : Plots antivibratoires (Silentblocks), butées élastiques d'absorption d'énergie. Amortissement dynamique remarquable. Option d'adhérisation chimique caoutchouc-métal sur acier/laiton. Dureté : 55 à 80 Shore A. Matériaux : NR (Caoutchouc Naturel), SBR, EPDM. Tolérances : ISO 3302-1 Classe M2/M3.
- Profilés Extrudés & Joints de Vitrage : Profilés d'étanchéité linéaires compacts, cellulaires ou co-extrudés (bi-matière). Vulcanisation continue. Dureté : 60 à 80 Shore A. Matériaux : EPDM, NBR, CR. Tolérances : ISO 3302-1 Classe E1/E2.
- Pièces Caoutchouc-Métal Techniques : Pièces composites avec inserts rigides (acier, aluminium, inox, laiton). Traitement de sablage + primaire d'adhérisation chimique indestructible. Dureté : 50 à 85 Shore A. Matériaux : NR, NBR, EPDM, FKM. Tolérances : ISO 3302-1 Classe M2.
- Membranes Souples Renforcées : Membranes minces de régulation de pression (gaz, liquides) avec incorporation d'un pli textile de renfort (polyester, polyamide). Dureté : 50 à 70 Shore A. Matériaux : NBR, EPDM, FKM/Viton, VMQ Silicone. Tolérances de précision : ISO 3302-1 Classe M1.

========================================================================
2. CARACTÉRISTIQUES DÉTAILLÉES DES ÉLASTOMÈRES
========================================================================
- NBR (Nitrile / Butadiène-Acrylonitrile) :
  * Plage : -30°C à +100°C (pointes à 120°C).
  * Dureté : 40 à 90 Shore A.
  * Points forts : Résistance remarquable aux huiles minérales, carburants, graisses hydrauliques, excellente Déformation Rémanente à la Compression (DRC).
  * Points faibles : Sensible à l'ozone, aux rayons UV et aux intempéries (usage extérieur non recommandé sans additifs), faible face aux solvants polaires (cétones/esters).
  * Applications : Joints de moteurs, membranes carburateur, durites d'admission d'air gras, racleurs.

- EPDM (Éthylène-Propylène-Diène Monomère) :
  * Plage : -40°C à +130°C (vapeur d'eau jusqu'à 150°C).
  * Dureté : 30 à 90 Shore A.
  * Points forts : Résistance exceptionnelle à l'ozone, aux rayons UV, aux intempéries et au vieillissement thermique. Très bonne tenue à l'eau chaude, vapeur, acides dilués et liquides de frein (synthétiques). Excellent comportement aux températures négatives.
  * Points faibles : Incompatible avec les huiles minérales, graisses de pétrole et hydrocarbures.
  * Applications : Joints de vitrage/carrosserie, flexibles sanitaires, membranes de vases d'expansion.

- FKM / Viton® (Caoutchouc Fluorocarboné) :
  * Plage : -20°C à +250°C.
  * Dureté : 50 à 90 Shore A.
  * Points forts : Résistance thermique extrême sans dégradation, inertie chimique quasi universelle face aux hydrocarbures, carburants premium, acides et solvants agressifs. Faible perméabilité.
  * Points faibles : Sensible aux solvants polaires (cétones), devient cassant sous -20°C, coût de matière première très élevé.
  * Applications : Joints d'échappement, aéronautique, industrie chimique lourde, vannes pétrochimiques.

- VMQ (Silicone / Vinyl Méthyl Silicone) :
  * Plage : -60°C à +200°C (formulations spéciales à +250°C).
  * Dureté : 30 à 80 Shore A.
  * Points forts : Inertie physiologique et biocompatibilité totale (certifications alimentaires FDA, médicales). Plage thermique la plus large du marché. Excellente tenue à l'ozone et aux arcs électriques.
  * Points faibles : Faibles propriétés mécaniques (faible tenue à la déchirure, abrasion, coupure), perméable aux gaz, gonflement élevé dans les hydrocarbures.
  * Applications : Joints de fours/autoclaves, tuyaux agroalimentaires, dispositifs médicaux.

- NR (Caoutchouc Naturel / Polyisoprène) :
  * Plage : -50°C à +80°C.
  * Dureté : 35 à 90 Shore A.
  * Points forts : Élastomère le plus résilient avec la meilleure reprise élastique. Résistance exceptionnelle à la fatigue dynamique, à la déchirure et à l'abrasion mécanique.
  * Points faibles : Faible tenue à l'ozone, aux UV, aux huiles, solvants et carburants. Ramollit vite au-dessus de 80°C.
  * Applications : Silentblocks, supports moteurs antivibratoires, pièces d'usure de convoyeurs, pneus pleins.

- CR (Néoprène / Chloroprène) :
  * Plage : -30°C à +120°C.
  * Bon compromis de résistance à la mer, aux intempéries et à la flamme (auto-extinguibilité relative).

========================================================================
3. PARC DE MACHINES ET PROCÉDÉS INDUSTRIELS DE EURL TCP
========================================================================
- Moulage par Injection Directe (Presses de 150 à 450 Tonnes, injectables jusqu'à 3000 cm³) :
  * Idéal pour les grandes et très grandes séries.
  * Offre des cycles de vulcanisation courts (matière préchauffée injectée sous forte pression), élimination des inclusions d'air par cloche sous vide, tolérances géométriques très étroites (Classe M1), absence de bavure importante, excellente répétabilité automatique.
- Vulcanisation par Compression (Plateaux chauffants jusqu'à 800 x 800 mm, pression jusqu'à 350 Tonnes) :
  * Idéal pour les moyennes séries techniques et pièces massives/épaisses.
  * Coûts d'outillage (moules) plus abordables. Excellent contrôle de l'orientation des fibres de renfort et parfait pour les opérations complexes de liaison chimique de surmoulage sur de grands inserts métalliques rigides.

========================================================================
4. DIRECTIVES DE CO-CONCEPTION ET CONSEILS DE DESIGN
========================================================================
- Dépouilles : Toujours recommander un angle de dépouille de 1° à 2° minimum pour faciliter l'éjection et le démoulage des pièces en caoutchouc sans déchirure.
- Plan de joint : Conseiller de situer le plan de joint sur des arêtes non fonctionnelles pour cacher les traces d'ébavurage.
- Épaisseurs : Recommander d'uniformiser au maximum l'épaisseur des parois pour garantir une vulcanisation homogène (éviter les cœurs sous-cuits ou les surfaces sur-cuites).

========================================================================
5. DIRECTIVES DE RÉPONSE ET DE CONTACT
========================================================================
- Structurez vos réponses en français de manière claire, aérée et extrêmement professionnelle avec des sections distinctes (Analyse, Choix de l'Élastomère, Choix du Procédé de Fabrication, Conseils de Co-conception, Conclusion/Action).
- Invitez chaleureusement l'interlocuteur à utiliser notre outil interactif d'estimation de devis en ligne disponible sur la plateforme ou à prendre contact directement avec nos bureaux :
  * Adresse physique : Eurl TCP, JWV4+FHW, Amizour 06008, Béjaïa, Algérie.
  * E-mail direct : eurl.tcp@gmail.com
  * Téléphone direct : +213 775 55 46 46`;

    // Structure chat format for Gemini 3.5
    // Format chat history for contents
    const contents = [];
    
    if (history && Array.isArray(history)) {
      for (const turn of history) {
        contents.push({
          role: turn.role === "user" ? "user" : "model",
          parts: [{ text: turn.content }]
        });
      }
    }
    
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    const replyText = response.text || "Désolé, notre bureau d'études n'a pas pu formuler de réponse. Veuillez réessayer ou contacter nos ingénieurs directement.";
    return res.json({ response: replyText });

  } catch (err: any) {
    console.error("Erreur d'appel à la Gemini API :", err);
    // Fallback gracefully on rate limits, network errors or API issues
    const fallbackText = fallbackAdvise(message);
    return res.json({ 
      response: fallbackText, 
      warning: "Note : Retour temporaire au moteur de conseil technique local en raison d'une indisponibilité réseau." 
    });
  }
});

// Database Setup (PostgreSQL - Neon)
const databaseUrl = process.env.DATABASE_URL;
let pool: pg.Pool | null = null;
let dbConnected = false;

if (databaseUrl && databaseUrl.trim() !== "") {
  try {
    pool = new Pool({
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false // Required for Neon secure serverless / cloud connections
      }
    });
    console.log("Pool PostgreSQL initialisé. Tentative de connexion...");
  } catch (err: any) {
    console.error("Erreur de création du Pool PostgreSQL :", err.message);
  }
} else {
  console.log("DATABASE_URL non configuré. Mode stockage local (In-Memory) activé.");
}

// Fallback storage arrays if PostgreSQL is not connected
let localCategories = [
  { id: "molded", label: "Moulées de Précision", icon: "Layers", description: "Pièces de précision surmoulées, injectées ou vulcanisées sous haute compression." },
  { id: "profile", label: "Profilés Extrudés", icon: "Cpu", description: "Profilés continus étanches et joints extrudés pour applications dynamiques." },
  { id: "bonded", label: "Caoutchouc-Métal", icon: "Wrench", description: "Éléments de régulation souples de haute précision pour fluides gazeux ou liquides." },
  { id: "custom", label: "Bureau d'Études / Sur Mesure", icon: "Layers", description: "Solutions élastomères spécifiques sur-mesure." },
];

let localProducts = [
  {
    id: "prod-1",
    name: "Joints d'Étanchéité Techniques",
    category: "molded",
    description: "Joints toriques, joints plats, clapets et bagues d'étanchéité hautes performances moulés sur mesure pour résister aux pressions élevées et aux fluides agressifs.",
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

// Self-healing database initialization function
async function initializeDatabase() {
  if (!pool) return;
  try {
    console.log("Vérification et création des tables PostgreSQL Neon...");
    
    // 1. Create Categories Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(50) PRIMARY KEY,
        label VARCHAR(100) NOT NULL,
        icon VARCHAR(50) NOT NULL,
        description TEXT
      );
    `);

    // 2. Create Products Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        category VARCHAR(50) REFERENCES categories(id) ON DELETE SET NULL,
        description TEXT NOT NULL,
        hardness VARCHAR(100) NOT NULL,
        materials TEXT[] NOT NULL,
        series VARCHAR(150) NOT NULL,
        tolerances VARCHAR(100) NOT NULL,
        features TEXT[] NOT NULL,
        applications TEXT[] NOT NULL,
        image_url TEXT
      );
    `);

    // Ensure the image_url column exists in case the table already existed from an older deployment
    await pool.query(`
      ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;
    `);

    // 3. Create Quotes Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS quotes (
        id SERIAL PRIMARY KEY,
        quote_id VARCHAR(50) UNIQUE NOT NULL,
        client_name VARCHAR(150) NOT NULL,
        client_email VARCHAR(150) NOT NULL,
        client_phone VARCHAR(50),
        client_company VARCHAR(150),
        piece_name VARCHAR(150),
        estimated_qty INTEGER,
        polymer VARCHAR(100),
        hardness VARCHAR(100),
        process VARCHAR(100),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    dbConnected = true;
    console.log("Vérification des tables Neon effectuée avec succès.");

    // Check if Categories table is empty, if so, seed it
    const catCheck = await pool.query("SELECT COUNT(*) FROM categories");
    if (parseInt(catCheck.rows[0].count) === 0) {
      console.log("Seeding des catégories par défaut dans Neon...");
      await pool.query(`
        INSERT INTO categories (id, label, icon, description) VALUES
        ('molded', 'Moulées de Précision', 'Layers', 'Pièces de précision surmoulées, injectées ou vulcanisées sous haute compression.'),
        ('profile', 'Profilés Extrudés', 'Cpu', 'Profilés continus étanches et joints extrudés pour applications dynamiques.'),
        ('bonded', 'Caoutchouc-Métal', 'Wrench', 'Éléments de régulation souples de haute précision pour fluides gazeux ou liquides.'),
        ('custom', 'Bureau d''Études / Sur Mesure', 'Layers', 'Solutions élastomères spécifiques sur-mesure.');
      `);
    }

    // Check if Products table is empty, if so, seed it
    const prodCheck = await pool.query("SELECT COUNT(*) FROM products");
    if (parseInt(prodCheck.rows[0].count) === 0) {
      console.log("Seeding du catalogue initial de produits dans Neon...");
      for (const p of localProducts) {
        await pool.query(`
          INSERT INTO products (id, name, category, description, hardness, materials, series, tolerances, features, applications, image_url)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `, [p.id, p.name, p.category, p.description, p.specs.hardness, p.specs.materials, p.specs.series, p.specs.tolerances, p.features, p.applications, p.imageUrl]);
      }
    }

    console.log("Base de données Neon PostgreSQL initialisée et synchronisée !");
  } catch (err: any) {
    dbConnected = false;
    console.error("Erreur d'initialisation des tables PostgreSQL :", err.message);
  }
}

// Perform database initialization asynchronously
if (pool) {
  initializeDatabase().catch(err => {
    console.error("Échec critique de l'initialisation DB :", err);
  });
}

// ========================================================
// ENDPOINTS CATALOGUE : CATÉGORIES & PRODUITS
// ========================================================

// Endpoint 2: Fetch Categories
app.get("/api/categories", async (req, res) => {
  if (dbConnected && pool) {
    try {
      const result = await pool.query("SELECT * FROM categories");
      return res.json(result.rows);
    } catch (err: any) {
      console.error("Erreur GET /api/categories :", err.message);
      // graceful fallback to local memory
    }
  }
  return res.json(localCategories);
});

// Endpoint 3: Create / Upsert Category
app.post("/api/categories", async (req, res) => {
  const { id, label, icon, description } = req.body;
  if (!id || !label) {
    return res.status(400).json({ error: "L'identifiant (id) et le libellé (label) sont requis." });
  }

  const catToSave = { id, label, icon: icon || "Layers", description: description || "" };

  if (dbConnected && pool) {
    try {
      await pool.query(`
        INSERT INTO categories (id, label, icon, description)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id) DO UPDATE
        SET label = EXCLUDED.label, icon = EXCLUDED.icon, description = EXCLUDED.description
      `, [catToSave.id, catToSave.label, catToSave.icon, catToSave.description]);
      return res.json(catToSave);
    } catch (err: any) {
      console.error("Erreur de sauvegarde de la catégorie sur Neon :", err.message);
    }
  }

  // fallback / update in memory
  const existingIdx = localCategories.findIndex(c => c.id === id);
  if (existingIdx >= 0) {
    localCategories[existingIdx] = catToSave;
  } else {
    localCategories.push(catToSave);
  }
  return res.json(catToSave);
});

// Endpoint 4: Delete Category
app.delete("/api/categories/:id", async (req, res) => {
  const { id } = req.params;
  
  if (dbConnected && pool) {
    try {
      // Delete all products associated with this category
      await pool.query("DELETE FROM products WHERE category = $1", [id]);
      // Then delete the category
      await pool.query("DELETE FROM categories WHERE id = $1", [id]);
      return res.json({ success: true, message: `Catégorie ${id} et tous ses produits ont été supprimés.` });
    } catch (err: any) {
      console.error("Erreur DELETE /api/categories :", err.message);
      return res.status(500).json({ error: `Impossible de supprimer la catégorie : ${err.message}` });
    }
  }

  localProducts = localProducts.filter(p => p.category !== id);
  localCategories = localCategories.filter(c => c.id !== id);
  return res.json({ success: true, message: `Catégorie ${id} supprimée localement avec ses produits.` });
});

// Endpoint 5: Fetch Products
app.get("/api/products", async (req, res) => {
  if (dbConnected && pool) {
    try {
      const result = await pool.query("SELECT * FROM products ORDER BY id DESC");
      const mapped = result.rows.map(row => ({
        id: row.id,
        name: row.name,
        category: row.category,
        description: row.description,
        specs: {
          hardness: row.hardness,
          materials: row.materials,
          series: row.series,
          tolerances: row.tolerances
        },
        features: row.features,
        applications: row.applications,
        imageUrl: row.image_url || undefined
      }));
      return res.json(mapped);
    } catch (err: any) {
      console.error("Erreur GET /api/products :", err.message);
      // fallback
    }
  }
  return res.json(localProducts);
});

// Endpoint 6: Create or Update (Upsert) Product
app.post("/api/products", async (req, res) => {
  const p = req.body;
  if (!p.id || !p.name || !p.description) {
    return res.status(400).json({ error: "L'id, le nom et la description sont obligatoires." });
  }

  const { hardness, materials, series, tolerances } = p.specs || {};
  const productToSave = {
    id: p.id,
    name: p.name,
    category: p.category || "molded",
    description: p.description,
    specs: {
      hardness: hardness || "70 Shore A",
      materials: materials || ["NBR"],
      series: series || "Moyennes et Grandes séries",
      tolerances: tolerances || "ISO 3302-1 Classe M2"
    },
    features: p.features || ["Spécifications de précision"],
    applications: p.applications || ["Applications industrielles polyvalentes"],
    imageUrl: p.imageUrl || null
  };

  if (dbConnected && pool) {
    try {
      await pool.query(`
        INSERT INTO products (id, name, category, description, hardness, materials, series, tolerances, features, applications, image_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO UPDATE
        SET name = EXCLUDED.name,
            category = EXCLUDED.category,
            description = EXCLUDED.description,
            hardness = EXCLUDED.hardness,
            materials = EXCLUDED.materials,
            series = EXCLUDED.series,
            tolerances = EXCLUDED.tolerances,
            features = EXCLUDED.features,
            applications = EXCLUDED.applications,
            image_url = EXCLUDED.image_url
      `, [
        productToSave.id,
        productToSave.name,
        productToSave.category,
        productToSave.description,
        productToSave.specs.hardness,
        productToSave.specs.materials,
        productToSave.specs.series,
        productToSave.specs.tolerances,
        productToSave.features,
        productToSave.applications,
        productToSave.imageUrl
      ]);
      return res.json(productToSave);
    } catch (err: any) {
      console.error("Erreur d'enregistrement du produit sur Neon :", err.message);
    }
  }

  // fallback/update in memory
  const existingIdx = localProducts.findIndex(item => item.id === p.id);
  if (existingIdx >= 0) {
    localProducts[existingIdx] = productToSave;
  } else {
    localProducts.unshift(productToSave);
  }
  return res.json(productToSave);
});

// Endpoint 7: Delete Product
app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;

  if (dbConnected && pool) {
    try {
      await pool.query("DELETE FROM products WHERE id = $1", [id]);
      return res.json({ success: true, message: `Produit ${id} supprimé.` });
    } catch (err: any) {
      console.error("Erreur DELETE /api/products :", err.message);
      return res.status(500).json({ error: `Impossible de supprimer le produit de la base de données : ${err.message}` });
    }
  }

  localProducts = localProducts.filter(item => item.id !== id);
  return res.json({ success: true, message: `Produit ${id} supprimé localement.` });
});

// Endpoint 8: Real Quote requests & contact log (saves to PostgreSQL)
app.post("/api/devis", async (req, res) => {
  const quoteData = req.body;
  console.log("Nouvelle demande de devis reçue chez Eurl TCP :", quoteData);
  
  const quoteId = "TCP-" + Math.floor(100000 + Math.random() * 900000);

  if (dbConnected && pool) {
    try {
      const qtyInt = parseInt(quoteData.estimatedQuantity) || null;
      await pool.query(`
        INSERT INTO quotes (quote_id, client_name, client_email, client_phone, client_company, piece_name, estimated_qty, polymer, hardness, process, description)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [
        quoteId,
        quoteData.contactName || "Anonyme",
        quoteData.email || "",
        quoteData.phone || null,
        quoteData.company || "Particulier/Autre",
        quoteData.approximateSize || "Pièce Caoutchouc",
        qtyInt,
        quoteData.preferredMaterial || "NBR",
        quoteData.shoreHardness || "70 Shore A",
        quoteData.processChoice || "undecided",
        quoteData.partDescription || ""
      ]);
      console.log(`Demande de devis ${quoteId} sauvegardée dans la base de données Neon PostgreSQL.`);
    } catch (err: any) {
      console.error("Impossible de sauvegarder la demande de devis dans Neon :", err.message);
    }
  }
  
  return res.json({
    success: true,
    quoteId: quoteId,
    message: "Votre demande de devis a été enregistrée avec succès. Notre service commercial et notre bureau d'études l'analyseront sous 24 à 48 heures.",
    receivedAt: new Date().toISOString()
  });
});

// Vite integration middleware for development
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  }).then((vite) => {
    app.use(vite.middlewares);
  }).catch((err) => {
    console.error("Échec de l'initialisation de Vite middleware :", err);
  });
} else {
  // Production static files serving
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

if (!process.env.VERCEL) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Serveur Eurl TCP en ligne sur http://localhost:${PORT} (Mode: ${process.env.NODE_ENV || "development"})`);
  });
}

export default app;
