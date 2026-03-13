import mongoose from "mongoose";

const TYPES_AUTORISES = [
    'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice',
    'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug',
    'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy',
];

const statField = (nom) => ({
    type: Number,
    required: [true, `Le champ ${nom} est obligatoire`],
    min: [1, `${nom} doit être compris entre 1 et 255`],
    max: [255, `${nom} doit être compris entre 1 et 255`],
});

const pokemonSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: [true, "L'identifiant est obligatoire"],
        unique: true,
        min: [1, "L'identifiant doit être un entier positif (≥ 1)"],
        validate: {
            validator: Number.isInteger,
            message: "L'identifiant doit être un entier",
        },
    },
    name: {
        english: { type: String },
        japanese: { type: String },
        chinese: { type: String },
        french: { type: String, required: [true, 'Le nom français est obligatoire'] },
    },
    type: {
        type: [String],
        required: [true, 'Le champ type est obligatoire'],
        validate: {
            validator: function (arr) {
                return arr.length > 0 && arr.every((t) => TYPES_AUTORISES.includes(t));
            },
            message: function (props) {
                const invalides = props.value.filter((t) => !TYPES_AUTORISES.includes(t));
                if (invalides.length > 0) {
                    return `Type(s) invalide(s) : ${invalides.join(', ')}. Types autorisés : ${TYPES_AUTORISES.join(', ')}`;
                }
                return 'Le champ type ne peut pas être vide';
            },
        },
    },
    base: {
        HP:             statField('HP'),
        Attack:         statField('Attack'),
        Defense:        statField('Defense'),
        SpecialAttack:  statField('SpecialAttack'),
        SpecialDefense: statField('SpecialDefense'),
        Speed:          statField('Speed'),
    },
    image: {
        type: String,
        required: [true, "L'image est obligatoire"],
    },
});

export default mongoose.model("pokemon", pokemonSchema);
