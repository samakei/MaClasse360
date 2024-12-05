import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import CarnetDeClasse from './models/CarnetDeClasse.js';

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
// Routes de l'API pour les classes
app.get('/classes', async (req, res) => {
  const classes = await Classe.find();
  res.json(classes);
});

app.post('/classes', async (req, res) => {
  const classe = new Classe(req.body);
  await classe.save();
  res.json(classe);
});

app.put('/classes/:id', async (req, res) => {
  try {
    const updatedClasse = await Classe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedClasse);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la classe:', error);
    res.status(500).send('Erreur interne du serveur');
  }
});

app.delete('/classes/:id', async (req, res) => {
  try {
    await Classe.findByIdAndDelete(req.params.id);
    res.send('Classe supprimée avec succès');
  } catch (error) {
    console.error('Erreur lors de la suppression de la classe:', error);
    res.status(500).send('Erreur interne du serveur');
  }
  
});
// Routes de l'API pour les partages dans le carnet de classe
app.get('/carnet', async (req, res) => {
  const carnet = await CarnetDeClasse.find().populate('etudiant');
  res.json(carnet);
});

app.post('/carnet', async (req, res) => {
  const partage = new CarnetDeClasse(req.body);
  await partage.save();
  res.json(partage);
});

app.put('/carnet/:id', async (req, res) => {
  try {
    const updatedPartage = await CarnetDeClasse.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPartage);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du partage:', error);
    res.status(500).send('Erreur interne du serveur');
  }
});

app.delete('/carnet/:id', async (req, res) => {
  try {
    await CarnetDeClasse.findByIdAndDelete(req.params.id);
    res.send('Partage supprimé avec succès');
  } catch (error) {
    console.error('Erreur lors de la suppression du partage:', error);
    res.status(500).send('Erreur interne du serveur');
  }
});
// Démarrer le serveur
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
// Routes de l'API pour les étudiants
app.get('/etudiants', async (req, res) => {
  const etudiants = await Etudiant.find().populate('classe');
  res.json(etudiants);
});

app.post('/etudiants', async (req, res) => {
  try {
    const etudiant = new Etudiant(req.body);
    await etudiant.save();
    res.json(etudiant);
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'étudiant :', error);
    res.status(500).send('Erreur interne du serveur');
  }
});

app.put('/etudiants/:id', async (req, res) => {
  try {
    const updatedEtudiant = await Etudiant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEtudiant);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'étudiant:', error);
    res.status(500).send('Erreur interne du serveur');
  }
});

app.delete('/etudiants/:id', async (req, res) => {
  try {
    await Etudiant.findByIdAndDelete(req.params.id);
    res.send('Étudiant supprimé avec succès');
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'étudiant:', error);
    res.status(500).send('Erreur interne du serveur');
  }
});
