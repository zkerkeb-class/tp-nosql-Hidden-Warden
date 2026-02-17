import { Router } from 'express';
import PokemonsController from '../controllers/pokemons.js';

const router = Router();

router.get('/', PokemonsController.getAllPokemons);
router.get('/:id', PokemonsController.getPokemonById);
router.post('/', PokemonsController.createPokemon);
router.put('/:id', PokemonsController.updatePokemon);
router.delete('/:id', PokemonsController.deletePokemon);

export default router;