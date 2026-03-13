import { Router } from 'express';
import Team from '../schemas/teams.js';
import Pokemon from '../schemas/pokemons.js';
import auth from '../middleware/auth.js';

const router = Router();

// Convertit un tableau d'IDs numériques en ObjectIds MongoDB.
// Retourne null si un ou plusieurs Pokémon sont introuvables.
async function resolverPokemons(numericIds) {
    const docs = await Pokemon.find({ id: { $in: numericIds } }).select('_id id');
    if (docs.length !== numericIds.length) {
        const trouves = docs.map((d) => d.id);
        const manquants = numericIds.filter((id) => !trouves.includes(id));
        return { erreur: `Pokémon introuvable(s) : ${manquants.join(', ')}` };
    }
    return { objectIds: docs.map((d) => d._id) };
}

// POST /api/teams — créer une équipe
router.post('/', auth, async (req, res) => {
    const { name, pokemons = [] } = req.body;

    if (pokemons.length > 6) {
        return res.status(400).json({ erreur: "Une équipe ne peut pas contenir plus de 6 Pokémon" });
    }

    let objectIds = [];
    if (pokemons.length > 0) {
        const resultat = await resolverPokemons(pokemons);
        if (resultat.erreur) return res.status(400).json({ erreur: resultat.erreur });
        objectIds = resultat.objectIds;
    }

    const team = await Team.create({
        user: req.user.id,
        name,
        pokemons: objectIds,
    });

    res.status(201).json(team);
});

// GET /api/teams — lister mes équipes
router.get('/', auth, async (req, res) => {
    const teams = await Team.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(teams);
});

// GET /api/teams/:id — détail d'une équipe avec les Pokémon complets
router.get('/:id', auth, async (req, res) => {
    const team = await Team.findById(req.params.id).populate('pokemons');
    if (!team) {
        return res.status(404).json({ erreur: "Équipe introuvable" });
    }
    if (team.user.toString() !== req.user.id) {
        return res.status(403).json({ erreur: "Accès interdit" });
    }
    res.json(team);
});

// PUT /api/teams/:id — modifier une équipe
router.put('/:id', auth, async (req, res) => {
    const team = await Team.findById(req.params.id);
    if (!team) {
        return res.status(404).json({ erreur: "Équipe introuvable" });
    }
    if (team.user.toString() !== req.user.id) {
        return res.status(403).json({ erreur: "Accès interdit" });
    }

    const { name, pokemons } = req.body;
    const update = {};

    if (name !== undefined) update.name = name;

    if (pokemons !== undefined) {
        if (pokemons.length > 6) {
            return res.status(400).json({ erreur: "Une équipe ne peut pas contenir plus de 6 Pokémon" });
        }
        if (pokemons.length > 0) {
            const resultat = await resolverPokemons(pokemons);
            if (resultat.erreur) return res.status(400).json({ erreur: resultat.erreur });
            update.pokemons = resultat.objectIds;
        } else {
            update.pokemons = [];
        }
    }

    const updated = await Team.findByIdAndUpdate(
        req.params.id,
        update,
        { new: true, runValidators: true }
    ).populate('pokemons');

    res.json(updated);
});

// DELETE /api/teams/:id — supprimer une équipe
router.delete('/:id', auth, async (req, res) => {
    const team = await Team.findById(req.params.id);
    if (!team) {
        return res.status(404).json({ erreur: "Équipe introuvable" });
    }
    if (team.user.toString() !== req.user.id) {
        return res.status(403).json({ erreur: "Accès interdit" });
    }

    await team.deleteOne();
    res.status(204).send();
});

export default router;
