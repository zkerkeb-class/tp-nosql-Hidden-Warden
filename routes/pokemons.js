import { Router } from 'express';
import PokemonsController from '../controllers/pokemons.js';
import auth from '../middleware/auth.js';

const router = Router();

// Routes publiques (pas d'authentification requise)
router.get('/', PokemonsController.getAllPokemons);
router.get('/:id', PokemonsController.getPokemonById);

// Routes protégées (authentification requise)
router.post('/', auth, PokemonsController.createPokemon);
router.put('/:id', auth, PokemonsController.updatePokemon);
router.delete('/:id', auth, PokemonsController.deletePokemon);

export default router;