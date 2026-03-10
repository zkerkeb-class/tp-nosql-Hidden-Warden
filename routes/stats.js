import { Router } from 'express';
import Pokemon from '../schemas/pokemons.js';

const router = Router();

// GET /api/stats — statistiques globales via le pipeline d'agrégation
router.get('/', async (req, res) => {
    const [byType, topAttack, topHP] = await Promise.all([
        // Nombre de Pokémon et moyenne des HP par type
        Pokemon.aggregate([
            { $unwind: '$type' },
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 },
                    avgHP: { $avg: '$base.HP' },
                },
            },
            { $sort: { count: -1 } },
            {
                $project: {
                    _id: 0,
                    type: '$_id',
                    count: 1,
                    avgHP: { $round: ['$avgHP', 1] },
                },
            },
        ]),

        // Pokémon avec le plus d'attaque
        Pokemon.aggregate([
            { $sort: { 'base.Attack': -1 } },
            { $limit: 1 },
            {
                $project: {
                    _id: 0,
                    id: 1,
                    name: '$name.english',
                    attack: '$base.Attack',
                },
            },
        ]),

        // Pokémon avec le plus de HP
        Pokemon.aggregate([
            { $sort: { 'base.HP': -1 } },
            { $limit: 1 },
            {
                $project: {
                    _id: 0,
                    id: 1,
                    name: '$name.english',
                    hp: '$base.HP',
                },
            },
        ]),
    ]);

    res.json({
        byType,
        topAttack: topAttack[0],
        topHP: topHP[0],
    });
});

export default router;
