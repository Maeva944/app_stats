CREATE TABLE Technicien(
	id SERIAL PRIMARY KEY,
	Nom VARCHAR(150) NOT NULL,
	Prenom VARCHAR(150),
	matricule INT UNIQUE NOT NULL , 
	VAPS INT NULL, 
	NPS INT NULL, 
	Taux_conversion VARCHAR(10) null,
	Taux_proposition VARCHAR(10) null
);
CREATE TABLE Commentaire(
	id SERIAL PRIMARY KEY,
    contenu TEXT NOT NULL,
    date_commentaire TIMESTAMP DEFAULT NOW(),
    technicien_id INT REFERENCES technicien(id) ON DELETE CASCADE
)