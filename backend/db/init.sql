
CREATE DATABASE app_carglass;
use app_carglass; 

-- Création de la table Technicien
CREATE TABLE Technicien (
    matricule INT PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    prenom VARCHAR(150),
    photo VARCHAR(500)
);

-- Création de la table Statistiques
CREATE TABLE Statistiques (
    id SERIAL PRIMARY KEY,
    matricule INT REFERENCES Technicien(matricule) ON DELETE CASCADE,
    categorie VARCHAR(100) NOT NULL,  -- Ex: "VAPS", "NPS", "Qualite_Technique"
    valeur NUMERIC,                   -- Valeur principale de la statistique
    details JSONB,                     -- Stocke les sous-catégories (ex: VAPS détaillé par type)
    UNIQUE (matricule, categorie)      -- Empêche la duplication des catégories
);

-- Insertion de techniciens fictifs
INSERT INTO Technicien (matricule, nom, prenom, photo) VALUES
(1001, 'Dupont', 'Jean', 'https://site.com/photos/1001.jpg'),
(1002, 'Durand', 'Paul', 'https://site.com/photos/1002.jpg'),
(1003, 'Martin', 'Sophie', 'https://site.com/photos/1003.jpg'),
(1004, 'Bernard', 'Lucas', 'https://site.com/photos/1004.jpg'),
(1005, 'Thomas', 'Camille', 'https://site.com/photos/1005.jpg'),
(1006, 'Petit', 'Nicolas', 'https://site.com/photos/1006.jpg'),
(1007, 'Morel', 'Emma', 'https://site.com/photos/1007.jpg');

-- Insertion de statistiques fictives (VAPS)
INSERT INTO Statistiques (matricule, categorie, valeur, details) VALUES
(1001, 'VAPS', 85, '{"ballais": 10, "filtres": 20, "desinfection": 30, "batterie": 25}'),
(1002, 'VAPS', 78, '{"ballais": 8, "filtres": 15, "desinfection": 35, "batterie": 20}'),
(1003, 'VAPS', 92, '{"ballais": 12, "filtres": 25, "desinfection": 40, "batterie": 15}'),
(1004, 'VAPS', 70, '{"ballais": 7, "filtres": 10, "desinfection": 20, "batterie": 18}'),
(1005, 'VAPS', 88, '{"ballais": 9, "filtres": 22, "desinfection": 32, "batterie": 24}'),
(1006, 'VAPS', 80, '{"ballais": 11, "filtres": 18, "desinfection": 29, "batterie": 21}'),
(1007, 'VAPS', 75, '{"ballais": 6, "filtres": 14, "desinfection": 27, "batterie": 19}');

-- Insertion de statistiques fictives (Qualité Technique)
INSERT INTO Statistiques (matricule, categorie, valeur, details) VALUES
(1001, 'Qualite_Technique', 4.5, '{"globale": 4.5, "parebrise": 4.2, "lateral": 4.8, "arriere": 4.3}'),
(1002, 'Qualite_Technique', 4.0, '{"globale": 4.0, "parebrise": 3.9, "lateral": 4.5, "arriere": 4.1}'),
(1003, 'Qualite_Technique', 4.8, '{"globale": 4.8, "parebrise": 4.7, "lateral": 4.9, "arriere": 4.6}'),
(1004, 'Qualite_Technique', 3.9, '{"globale": 3.9, "parebrise": 3.8, "lateral": 4.2, "arriere": 3.7}'),
(1005, 'Qualite_Technique', 4.6, '{"globale": 4.6, "parebrise": 4.3, "lateral": 4.7, "arriere": 4.5}'),
(1006, 'Qualite_Technique', 4.2, '{"globale": 4.2, "parebrise": 4.0, "lateral": 4.4, "arriere": 4.1}'),
(1007, 'Qualite_Technique', 4.1, '{"globale": 4.1, "parebrise": 3.9, "lateral": 4.3, "arriere": 4.0}');

-- Insertion de statistiques fictives (NPS)
INSERT INTO Statistiques (matricule, categorie, valeur, details) VALUES
(1001, 'NPS', 90, '{"notes_0_6": 2, "notes_7_8": 10, "notes_9_10": 88, "commentaires": ["Super service !", "Très bon travail."]}'),
(1002, 'NPS', 85, '{"notes_0_6": 3, "notes_7_8": 12, "notes_9_10": 80, "commentaires": ["Rapide et efficace.", "Service impeccable."]}'),
(1003, 'NPS', 92, '{"notes_0_6": 1, "notes_7_8": 8, "notes_9_10": 91, "commentaires": ["Excellent accueil.", "Travail parfait."]}'),
(1004, 'NPS', 75, '{"notes_0_6": 5, "notes_7_8": 15, "notes_9_10": 70, "commentaires": ["Service correct.", "Peut mieux faire."]}'),
(1005, 'NPS', 88, '{"notes_0_6": 2, "notes_7_8": 9, "notes_9_10": 85, "commentaires": ["Très satisfait.", "Bonne expérience."]}'),
(1006, 'NPS', 80, '{"notes_0_6": 4, "notes_7_8": 14, "notes_9_10": 78, "commentaires": ["Personnel sympa.", "Bon service."]}'),
(1007, 'NPS', 83, '{"notes_0_6": 3, "notes_7_8": 11, "notes_9_10": 79, "commentaires": ["Satisfait dans l'ensemble.", "Efficace et rapide."]}');
