import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import logo from './logo360.png'; // Assure-toi que le chemin est correct




function App() {
  const [classes, setClasses] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [carnet, setCarnet] = useState([]);
  
  useEffect(() => {
    async function fetchData() {
      const resultClasses = await axios.get('http://localhost:5000/classes');
      setClasses(resultClasses.data);

      const resultCarnet = await axios.get('http://localhost:5000/carnet');
      setCarnet(resultCarnet.data);
    }
    fetchData();
  }, []);

  const ajouterEtudiant = async (nom, classeId) => {
    const result = await axios.post('http://localhost:5000/etudiants', { nom, classe: classeId });
    setEtudiants([...etudiants, result.data]);
  };

  const ajouterPartage = async (texte, photo, video, fichier, etudiantId) => {
    const result = await axios.post('http://localhost:5000/carnet', { texte, photo, video, fichier, etudiant: etudiantId });
    setCarnet([...carnet, result.data]);
  };

  return (
    <div className="App">
     
      <header className="App-header"> <img src={logo} className="App-logo" alt="logo" />
       <h1>MaClasse360</h1>
       </header>

      <h2>Classes</h2>
      <ul>
        {classes.map((classe) => (
          <li key={classe._id}>{classe.nom}</li>
        ))}
      </ul>

      <h2>Ajouter un étudiant</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.target;
          const nom = form.nom.value;
          const classeId = form.classeId.value;
          ajouterEtudiant(nom, classeId);
        }}
      >
        <input type="text" name="nom" placeholder="Nom de l'étudiant" required />
        <select name="classeId">
          {classes.map((classe) => (
            <option key={classe._id} value={classe._id}>{classe.nom}</option>
          ))}
        </select>
        <button type="submit">Ajouter</button>
      </form>

      <h2>Carnet de classe</h2>
      <ul>
        {carnet.map((partage) => (
          <li key={partage._id}>
            {partage.texte && <p>{partage.texte}</p>}
            {partage.photo && <img src={partage.photo} alt="" />}
            {partage.video && <video src={partage.video} controls />}
            {partage.fichier && <a href={partage.fichier} download>Télécharger fichier</a>}
            {partage.etudiant && <p>Posté par : {partage.etudiant.nom}</p>}
          </li>
        ))}
      </ul>

      <h2>Ajouter un partage</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.target;
          const texte = form.texte.value;
          const photo = form.photo.value;
          const video = form.video.value;
          const fichier = form.fichier.value;
          const etudiantId = form.etudiantId.value;
          ajouterPartage(texte, photo, video, fichier, etudiantId);
        }}
      >
        <textarea name="texte" placeholder="Texte"></textarea>
        <input type="text" name="photo" placeholder="URL de la photo" />
        <input type="text" name="video" placeholder="URL de la vidéo" />
        <input type="text" name="fichier" placeholder="URL du fichier" />
        <select name="etudiantId">
          {etudiants.map((etudiant) => (
            <option key={etudiant._id} value={etudiant._id}>{etudiant.nom}</option>
          ))}
        </select>
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
}

export default App;
