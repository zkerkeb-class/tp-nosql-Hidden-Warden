import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "L'utilisateur est obligatoire"],
    },
    name: {
        type: String,
        required: [true, "Le nom de l'équipe est obligatoire"],
        trim: true,
    },
    pokemons: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'pokemon' }],
        validate: {
            validator: (arr) => arr.length <= 6,
            message: "Une équipe ne peut pas contenir plus de 6 Pokémon",
        },
    },
}, { timestamps: true });

export default mongoose.model('Team', teamSchema);
