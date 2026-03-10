import { Router } from 'express';
import User from '../schemas/users.js';
import Pokemon from '../schemas/pokemons.js';
import auth from '../middleware/auth.js';

const router = Router();

// POST /api/favorites/:pokemonId — ajouter un favori
router.post('/:pokemonId', auth, async (req, res) => {
    const pokemonId = parseInt(req.params.pokemonId);

    if (isNaN(pokemonId)) {
        return res.status(400).json({ error: 'Invalid pokemon ID' });
    }

    const pokemon = await Pokemon.findOne({ id: pokemonId });
    if (!pokemon) {
        return res.status(404).json({ error: 'Pokemon not found' });
    }

    const user = await User.findByIdAndUpdate(
        req.user.id,
        { $addToSet: { favorites: pokemonId } },
        { new: true }
    );

    res.json({ favorites: user.favorites });
});

// DELETE /api/favorites/:pokemonId — retirer un favori
router.delete('/:pokemonId', auth, async (req, res) => {
    const pokemonId = parseInt(req.params.pokemonId);

    if (isNaN(pokemonId)) {
        return res.status(400).json({ error: 'Invalid pokemon ID' });
    }

    const user = await User.findByIdAndUpdate(
        req.user.id,
        { $pull: { favorites: pokemonId } },
        { new: true }
    );

    res.json({ favorites: user.favorites });
});

// GET /api/favorites — lister mes Pokémon favoris
router.get('/', auth, async (req, res) => {
    const user = await User.findById(req.user.id);

    const pokemons = await Pokemon.find({ id: { $in: user.favorites } });

    res.json(pokemons);
});

export default router;
