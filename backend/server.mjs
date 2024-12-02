import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors()); // Ajoute cette ligne pour activer CORS


// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGO_URI, )
  .then(() => console.log('Connexion à MongoDB réussie'))
  .catch((error) => console.error('Erreur de connexion à MongoDB:', error));

// Modèles de données
const classeSchema = new mongoose.Schema({
  nom: String,
});
const Classe = mongoose.model('Classe', classeSchema);

const etudiantSchema = new mongoose.Schema({
  nom: String,
  classe: { type: mongoose.Schema.Types.ObjectId, ref: 'Classe' },
});
const Etudiant = mongoose.model('Etudiant', etudiantSchema);

// Routes de l'API
app.get('/classes', async (req, res) => {
  const classes = await Classe.find();
  res.json(classes);
});

app.post('/etudiants', async (req, res) => {
  const etudiant = new Etudiant(req.body);
  await etudiant.save();
  res.json(etudiant);
});

// Démarrer le serveur
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});

