-- ==========================================
-- EURL TCP - NEON POSTGRESQL SCHEMA DEFINITION
-- Copy and paste this script directly into your Neon SQL Editor.
-- ==========================================

-- Drop tables if they exist to allow clean re-runs
DROP TABLE IF EXISTS quotes CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- 1. Create Categories Table
CREATE TABLE categories (
    id VARCHAR(50) PRIMARY KEY,
    label VARCHAR(100) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    description TEXT
);

-- 2. Create Products Table
CREATE TABLE products (
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

-- 3. Create Devis / Quotes Table (to record quote requests from clients)
CREATE TABLE quotes (
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

-- ==========================================
-- SEED DATA (INITIAL CATALOG matching frontend keys)
-- ==========================================

-- Seed Categories
INSERT INTO categories (id, label, icon, description) VALUES
('molded', 'Moulées de Précision', 'Layers', 'Pièces de précision surmoulées, injectées ou vulcanisées sous haute compression.'),
('profile', 'Profilés Extrudés', 'Cpu', 'Profilés continus étanches et joints extrudés pour applications dynamiques.'),
('bonded', 'Caoutchouc-Métal', 'Wrench', 'Éléments de régulation souples de haute précision pour fluides gazeux ou liquides.'),
('custom', 'Bureau d''Études / Sur Mesure', 'Layers', 'Solutions élastomères spécifiques sur-mesure.');

-- Seed Products
INSERT INTO products (id, name, category, description, hardness, materials, series, tolerances, features, applications, image_url) VALUES
(
    'prod-1',
    'Joints d''Étanchéité Techniques',
    'molded',
    'Joints toriques, joints plats, clapets et bagues d''étanchéité hautes performances moulés sur mesure pour résister aux pressions élevées et aux fluides agressifs.',
    '40 à 90 Shore A',
    ARRAY['NBR', 'EPDM', 'FKM', 'Silicone'],
    'Moyennes et Grandes séries uniquement',
    'ISO 3302-1 Classe M1/M2',
    ARRAY[
        'Résistance chimique selon formulation (huiles, hydrocarbures, acides)',
        'Excellente reprise élastique (déformation rémanente à la compression optimisée)',
        'Finition ébavurée de haute précision pour étanchéité dynamique ou statique'
    ],
    ARRAY['Moteurs industriels', 'Systèmes hydrauliques', 'Vannes et pompes de transfert', 'Équipements de filtration'],
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800'
),
(
    'prod-2',
    'Soufflets de Protection & Manchons',
    'molded',
    'Soufflets d''étanchéité et manchons de passage souples en caoutchouc conçus pour la protection d''organes mécaniques mobiles contre la poussière, l''eau et l''huile.',
    '50 à 75 Shore A',
    ARRAY['EPDM', 'CR (Néoprène)', 'NBR'],
    'Grandes séries par injection',
    'ISO 3302-1 Classe M2',
    ARRAY[
        'Grande résistance à la fatigue en flexion répétée (cycles alternatifs)',
        'Formulation résistante à l''ozone et au vieillissement atmosphérique',
        'Épaisseur de paroi rigoureusement constante pour un déploiement homogène'
    ],
    ARRAY['Transmissions automobiles', 'Vérins pneumatiques et hydrauliques', 'Passages de câbles étanches', 'Lignes d''assemblage'],
    'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800'
),
(
    'prod-3',
    'Amortisseurs & Butées Anti-vibrations',
    'molded',
    'Amortisseurs de choc, plots antivibratoires (Silentblocks) et butées élastiques pour isoler les bruits de structure et absorber l''énergie d''impact.',
    '55 à 80 Shore A',
    ARRAY['NR (Caoutchouc Naturel)', 'SBR', 'EPDM'],
    'Moyennes et Grandes séries',
    'ISO 3302-1 Classe M2 / M3',
    ARRAY[
        'Taux d''amortissement dynamique exceptionnel pour le caoutchouc naturel',
        'Option de surmoulage caoutchouc-métal (adhérisation chimique sur acier/laiton)',
        'Excellente résistance à la déchirure et aux surcharges mécaniques'
    ],
    ARRAY['Supports moteurs', 'Suspensions de machines industrielles', 'Butées d''arrêt de pont roulant', 'Châssis d''équipements ferroviaires'],
    'https://images.unsplash.com/photo-1537462715879-360eeb61a0bc?auto=format&fit=crop&q=80&w=800'
),
(
    'prod-4',
    'Profilés Extrudés & Joints de Vitrage',
    'profile',
    'Profilés d''étanchéité linéaires, cordes de caoutchouc et joints de vitrage produits par extrusion continue puis découpés ou vulcanisés en anneau.',
    '60 à 80 Shore A',
    ARRAY['EPDM', 'NBR', 'CR'],
    'Grandes séries (mètres linéaires élevés)',
    'ISO 3302-1 Classe E1/E2',
    ARRAY[
        'Disponible en caoutchouc compact, cellulaire ou co-extrudé (bi-matière)',
        'Vulcanisation continue garantissant des propriétés géométriques régulières',
        'Soudure d''angle par vulcanisation à chaud pour cadres étanches'
    ],
    ARRAY['Joints d''étanchéité de portières de véhicules', 'Cabines d''engins agricoles', 'Profilés de menuiserie alu', 'Goulottes d''étanchéité industrielles'],
    'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=800'
),
(
    'prod-5',
    'Pièces Caoutchouc-Métal Techniques',
    'bonded',
    'Pièces composites combinant un corps en caoutchouc élastique solidement lié par liaison chimique à des inserts rigides en acier, aluminium, inox ou laiton.',
    '50 à 85 Shore A',
    ARRAY['NR', 'NBR', 'EPDM', 'FKM'],
    'Moyennes et Grandes séries',
    'ISO 3302-1 Classe M2',
    ARRAY[
        'Traitement de surface des inserts (sablage et application d''un primaire d''adhérisation)',
        'Liaison chimique indestructible supérieure à la résistance du caoutchouc lui-même',
        'Intégration de fonctions de fixation directe et d''amortissement combinées'
    ],
    ARRAY['Rotules mécaniques', 'Turbines de pompes d''eau', 'Rouleaux d''entraînement recouverts', 'Amortisseurs de torsion renforcés'],
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800'
),
(
    'prod-6',
    'Membranes Souples Renforcées',
    'custom',
    'Membranes d''étanchéité et de régulation minces, homogènes ou renforcées par un pli textile en polyester ou polyamide pour résister à des pressions cycliques.',
    '50 à 70 Shore A',
    ARRAY['NBR', 'EPDM', 'Viton', 'Silicone'],
    'Moyennes et Grandes séries techniques',
    'ISO 3302-1 Classe M1',
    ARRAY[
        'Épaisseurs minimales contrôlées pour une flexibilité maximale',
        'Possibilité d''incorporer un tissu technique de renfort pour prévenir l''éclatement',
        'Excellente étanchéité aux gaz et résistance à la fatigue de flexion'
    ],
    ARRAY['Régulateurs de pression de gaz', 'Pompes de dosage de fluides', 'Actionneurs pneumatiques', 'Systèmes de freinage'],
    'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=800'
);
