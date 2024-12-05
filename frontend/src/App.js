import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import logo from './logo360.png'; // Assure-toi que le chemin est correct

function App() {
  // Déclaration des états pour les classes, étudiants, carnet, et éléments à éditer
  const [classes, setClasses] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [carnet, setCarnet] = useState([]);
  const [classeToEdit, setClasseToEdit] = useState(null);
  const [etudiantToEdit, setEtudiantToEdit] = useState(null);

  // useEffect pour récupérer les données lors du chargement du composant
  useEffect(() => {
    async function fetchData() {
      try {
        // Récupération des classes
        const resultClasses = await axios.get('http://localhost:5000/classes');
        setClasses(resultClasses.data);

        // Récupération des partages du carnet de classe
        const resultCarnet = await axios.get('http://localhost:5000/carnet');
        setCarnet(resultCarnet.data);
      } catch (error) {
        console.error('Erreur de réseau:', error);
      }
    }
    fetchData();
  }, []);

  // Fonction pour ajouter une classe
  const ajouterClasse = async (nom) => {
    try {
      const result = await axios.post('http://localhost:5000/classes', { nom });
      setClasses([...classes, result.data]);
    } catch (error) {
      console.error('Erreur de réseau:', error);
    }
  };
  // Fonction pour modifier une classe
  const modifierClasse = async (id, nom) => {
    try {
      const result = await axios.put(`http://localhost:5000/classes/${id}`, { nom });
      setClasses(classes.map(classe => (classe._id === id ? result.data : classe)));
    } catch (error) {
      console.error('Erreur de réseau:', error);
    }
  };

  // Fonction pour supprimer une classe
  const supprimerClasse = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/classes/${id}`);
      setClasses(classes.filter(classe => classe._id !== id));
    } catch (error) {
      console.error('Erreur de réseau:', error);
    }
  };

  // Fonction pour ajouter un étudiant
  const ajouterEtudiant = async (nom, classeId) => {
    if (!classeId) {
      console.error('Classe ID manquant');
      alert('Veuillez sélectionner une classe.');
      return;
    }
    try {
      const result = await axios.post('http://localhost:5000/etudiants', { nom, classe: classeId });
      setEtudiants([...etudiants, result.data]);
    } catch (error) {
      console.error('Erreur de réseau:', error);
    }
  };

  // Fonction pour modifier un étudiant
  const modifierEtudiant = async (id, nom) => {
    try {
      const result = await axios.put(`http://localhost:5000/etudiants/${id}`, { nom });
      setEtudiants(etudiants.map(etudiant => (etudiant._id === id ? result.data : etudiant)));
    } catch (error) {
      console.error('Erreur de réseau:', error);
    }
  };

  // Fonction pour supprimer un étudiant
  const supprimerEtudiant = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/etudiants/${id}`);
      setEtudiants(etudiants.filter(etudiant => etudiant._id !== id));
    } catch (error) {
      console.error('Erreur de réseau:', error);
    }
  };
  // Fonction pour ajouter un partage au carnet de classe
  const ajouterPartage = async (texte, photo, video, fichier, etudiantId) => {
    try {
      const result = await axios.post('http://localhost:5000/carnet', { texte, photo, video, fichier, etudiant: etudiantId });
      setCarnet([...carnet, result.data]);
    } catch (error) {
      console.error('Erreur de réseau:', error);
    }
  };

  // Fonction pour supprimer un partage
  const supprimerPartage = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/carnet/${id}`);
      setCarnet(carnet.filter(partage => partage._id !== id));
    } catch (error) {
      console.error('Erreur de réseau:', error);
    }
  };

  // Fonction pour supprimer des fichiers du partage
  const supprimerFichier = async (partageId, type) => {
    try {
      const result = await axios.put(`http://localhost:5000/carnet/${partageId}`, { [type]: "" });
      setCarnet(carnet.map(partage => (partage._id === partageId ? result.data : partage)));
    } catch (error) {
      console.error('Erreur de réseau:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>MaClasse360</h1>
        <p>Education</p>
      </header>

      <h2>Ajouter une classe</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.target;
          const nom = form.nom.value;
          ajouterClasse(nom);
        }}
      >
        <input type="text" name="nom" placeholder="Nom de la classe" required />
        <button type="submit">Ajouter</button>
      </form>

      <h2>Classes</h2>
      <ul>
        {classes.map((classe) => (
          <li key={classe._id}>
            {classe.nom}
            <button onClick={() => setClasseToEdit(classe)}>Modifier</button>
            <button onClick={() => supprimerClasse(classe._id)}>Supprimer</button>
          </li>
        ))}
      </ul>

      {classeToEdit && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target;
            const nom = form.nom.value;
            modifierClasse(classeToEdit._id, nom);
            setClasseToEdit(null);
          }}
        >
          <h3>Modifier la classe</h3>
          <input type="text" name="nom" defaultValue={classeToEdit.nom} required />
          <button type="submit">Mettre à jour</button>
        </form>
      )}

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
        <select name="classeId" required>
          <option value="">Sélectionner une classe</option>
          {classes.map((classe) => (
            <option key={classe._id} value={classe._id}>{classe.nom}</option>
          ))}
        </select>
        <button type="submit">Ajouter</button>
      </form>

      <h2>Étudiants</h2>
      <ul>
        {etudiants.map((etudiant) => (
          <li key={etudiant._id}>
            {etudiant.nom}
            <button onClick={() => setEtudiantToEdit(etudiant)}>Modifier</button>
            <button onClick={() => supprimerEtudiant(etudiant._id)}>Supprimer</button>
          </li>
        ))}
      </ul>

      {etudiantToEdit && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target;
            const nom = form.nom.value;
            modifierEtudiant(etudiantToEdit._id, nom);
            setEtudiantToEdit(null);
          }}
        >
          <h3>Modifier l'étudiant</h3>
          <input type="text" name="nom" defaultValue={etudiantToEdit.nom} required />
          <button type="submit">Mettre à jour</button>
        </form>
      )}

      <h2>Carnet de classe</h2>
      <ul>
        {carnet.map((partage) => (
          <li key={partage._id}>
            {partage.texte && <p>{partage.texte}</p>}
            {partage.photo && (
              <>
                <img src={partage.photo} aria-hidden alt="Photo" />
                <button onClick={() => supprimerFichier(partage._id, 'photo')}>Supprimer la photo</button>
              </>
            )}
                   <>   
                <video src={partage.video} controls />
                <button onClick={() => supprimerFichier(partage._id, 'video')}>Supprimer la vidéo</button>
              </>
            
           {partage.video && (
              <>
                <a href={partage.fichier} download>Télécharger fichier</a>
                <button onClick={() => supprimerFichier(partage._id, 'fichier')}>Supprimer le fichier</button>
              </>
            )}
            {partage.etudiant && <p>Posté par : {partage.etudiant.nom}</p>}
            <button onClick={() => supprimerPartage(partage._id)}>Supprimer ce partage</button>
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
          <option value="">Sélectionner un étudiant</option>
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
