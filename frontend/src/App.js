import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [classes, setClasses] = useState([]);
  const [etudiants, setEtudiants] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await axios.get('http://localhost:5000/classes');
        setClasses(result.data);
      } catch (error) {
        console.error('Erreur de réseau:', error);
      }
    }
    fetchData();
  }, []);

  const ajouterEtudiant = async (nom, classeId) => {
    try {
      const result = await axios.post('http://localhost:5000/etudiants', { nom, classe: classeId });
      setEtudiants([...etudiants, result.data]);
    } catch (error) {
      console.error('Erreur de réseau:', error);
    }
  };

  return (
    <div className="App">
      <h1>MaClasse360</h1>
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
    </div>
  );
}

export default App;
