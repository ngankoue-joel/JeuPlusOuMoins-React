import React, { useState, useEffect } from 'react';
import './JeuPlusOuMoins.css'; // Assurez-vous que le chemin d'accès est correct

const JeuPlusOuMoins = () => {
  const [nombreMystere, setNombreMystere] = useState(Math.floor(Math.random() * 100) + 1);
  const [nombre, setNombre] = useState('');
  const [message, setMessage] = useState('Devinez le nombre entre 1 et 100');
  const [tentatives, setTentatives] = useState(0);
  const [username, setUsername] = useState('');
  const [difficulte, setDifficulte] = useState('facile');
  const [leaderboard, setLeaderboard] = useState(JSON.parse(sessionStorage.getItem('leaderboard')) || []);

  useEffect(() => {
    const maxTentatives = calculerMaxTentatives(difficulte);
    setTentatives(maxTentatives);
  }, [difficulte]);

  const calculerMaxTentatives = (difficulte) => {
    const b = 100; // La plus grande valeur
    const a = 1;   // La plus petite valeur
    const baseLog = Math.log2(b - a);
    switch (difficulte) {
      case 'facile':
        return Math.ceil(baseLog) + 1;
      case 'normal':
        return Math.ceil(baseLog);
      case 'difficile':
        return Math.floor(baseLog);
      case 'tres difficile':
        return Math.floor((baseLog + 1) / 2);
      default:
        return Math.ceil(baseLog);
    }
  };

  const verifierNombre = (e) => {
    e.preventDefault();
    const num = parseInt(nombre);
    if (num === nombreMystere) {
      setMessage(`Bravo ! Le nombre était ${nombreMystere}. Vous avez trouvé en ${tentatives} tentatives.`);
      enregistrerScore();
      setNombreMystere(Math.floor(Math.random() * 100) + 1); // Générer un nouveau nombre mystère
    } else if (num < nombreMystere) {
      setMessage('Plus grand !');
    } else {
      setMessage('Plus petit !');
    }
    setTentatives(tentatives - 1);
  };

  const enregistrerScore = () => {
    const score = { username, difficulte, tentatives };
    const scoresExistant = leaderboard.filter(score => score.username === username && score.difficulte === difficulte);
    if (scoresExistant.length === 0 || scoresExistant.every(scoreExistant => scoreExistant.tentatives > tentatives)) {
      setLeaderboard([...leaderboard, score]);
      sessionStorage.setItem('leaderboard', JSON.stringify([...leaderboard, score]));
    }
  };

  return (
    <div className="jeu-container">
      <h2>Jeu du Plus ou Moins</h2>
      <p className="jeu-message">{message}</p>
      <form onSubmit={verifierNombre}>
        <input
          type="number"
          className="jeu-input"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          min="1"
          max="100"
        />
        <button className="jeu-button" type="submit">Vérifier</button>
      </form>
      <div>
        <label>Username: </label>
        <input
          type="text"
          className="jeu-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Difficulté: </label>
        <select
          className="jeu-difficulty"
          value={difficulte}
          onChange={(e) => setDifficulte(e.target.value)}
        >
          <option value="facile">Facile</option>
          <option value="normal">Normal</option>
          <option value="difficile">Difficile</option>
          <option value="tres difficile">Très Difficile</option>
        </select>
      </div>
      <div>
        <h3>Leaderboard</h3>
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Difficulté</th>
              <th>Tentatives</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.sort((a, b) => a.tentatives - b.tentatives).map((score, index) => (
              <tr key={index}>
                <td>{score.username}</td>
                <td>{score.difficulte}</td>
                <td>{score.tentatives}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JeuPlusOuMoins;
