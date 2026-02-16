// Charger les variables d'environnement en PREMIER (avant tout autre import)
// dotenv lit le fichier .env et rend les variables accessibles via process.env
import 'dotenv/config';

import express from 'express';
import cors from 'cors';

import './connect.js'; // Se connecter à la base de données (MongoDB)
import Pokemon from './schemas/pokemons.js'; // Charger le modèle Pokemon (définit le schéma de données)

const app = express();

app.use(cors()); // Permet les requêtes cross-origin (ex: frontend sur un autre port)

app.use('/assets', express.static('assets')); // Permet d'accéder aux fichiers dans le dossier "assets" via l'URL /assets/...

app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/api/pokemons', async (req, res) => {
    const pokemonsList = await Pokemon.find(); // Récupère tous les pokémons de la base de données
    res.json(pokemonsList); // Envoie la liste des pokémons au client
})

app.get('/api/pokemons/:id', async (req, res) => {
    const pokemonId = req.params.id; // Récupère l'ID du pokémon depuis les paramètres de l'URL
    const pokemon = await Pokemon.findOne({ id: pokemonId }); // Trouve le pokémon avec l'ID correspondant dans la base de données
    if (pokemon) {
        res.json(pokemon); // Si le pokémon est trouvé, envoie ses données au client
    } else {
        res.status(404).json({ message: 'Pokémon not found' }); // Si le pokémon n'est pas trouvé, envoie une réponse 404 avec un message d'erreur
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT || 3000}`);
});
