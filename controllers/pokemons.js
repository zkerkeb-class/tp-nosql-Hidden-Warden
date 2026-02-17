import Pokemon from '../schemas/pokemons.js';

const PokemonsController = {
    // Récupère tous les pokémons (avec filtres optionnels par type et nom)
    getAllPokemons: async (req, res) => {
        try {
            const filter = {};
            
            // Filtre par type si présent
            if (req.query.type) {
                filter.type = req.query.type;
            }
            
            // Recherche par nom (partiel, insensible à la casse) si présent
            if (req.query.name) {
                filter['name.english'] = { $regex: req.query.name, $options: 'i' };
            }
            
            // Tri si les paramètres de tri sont présents
            if (req.query.sort) {
                const sortField = req.query.sort;
                const sortOrder = req.query.order === 'desc' ? -1 : 1;
                const pokemonsList = await Pokemon.find(filter).sort({ [sortField]: sortOrder });
                return res.json(pokemonsList);
            }

            //Paginer les résultats
            if (req.query.page || req.query.limit) {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 20;
                const skip = (page - 1) * limit;
                const pokemonsList = await Pokemon.find(filter).skip(skip).limit(limit);
                return res.json(pokemonsList);
            }


            const pokemonsList = await Pokemon.find(filter);
            res.json(pokemonsList);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching Pokemons', error: error.message });
        }
    },

    // Récupère un pokémon par son ID
    getPokemonById: async (req, res) => {
        try {
            const pokemonId = req.params.id;
            const pokemon = await Pokemon.findOne({ id: pokemonId });
            if (pokemon) {
                res.json(pokemon);
            } else {
                res.status(404).json({ message: 'Pokémon not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error fetching Pokemon', error: error.message });
        }
    },

    // Crée un nouveau pokémon
    createPokemon: async (req, res) => {
        try {
            const newPokemon = new Pokemon(req.body);
            await newPokemon.save();
            res.status(201).json(newPokemon);
        } catch (error) {
            res.status(400).json({ message: 'Error creating Pokemon', error: error.message });
        }
    },

    // Met à jour un pokémon existant
    updatePokemon: async (req, res) => {
        try {
            const pokemonId = req.params.id;
            const updatedPokemon = await Pokemon.findOneAndUpdate(
                { id: pokemonId },
                req.body,
                { new: true }
            );
            if (updatedPokemon) {
                res.json(updatedPokemon);
            } else {
                res.status(404).json({ message: 'Pokémon not found' });
            }
        } catch (error) {
            res.status(400).json({ message: 'Error updating Pokemon', error: error.message });
        }
    },

    // Supprime un pokémon
    deletePokemon: async (req, res) => {
        try {
            const pokemonId = req.params.id;
            const deletedPokemon = await Pokemon.findOneAndDelete({ id: pokemonId });
            if (deletedPokemon) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: 'Pokémon not found' });
            }
        } catch (error) {
            res.status(400).json({ message: 'Error deleting Pokemon', error: error.message });
        }
    }
};

export default PokemonsController;
