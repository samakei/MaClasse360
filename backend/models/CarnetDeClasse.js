import mongoose from 'mongoose';

const carnetSchema = new mongoose.Schema({
  texte: String, // texte
  photo: String, // URL de la photo
  video: String, // URL de la vidéo
  fichier: String, // URL du fichier
  etudiant: { type: mongoose.Schema.Types.ObjectId, ref: 'Etudiant' },
  date: { type: Date, default: Date.now }
});

const CarnetDeClasse = mongoose.model('CarnetDeClasse', carnetSchema);

export default CarnetDeClasse;
