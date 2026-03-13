import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

const auth = (req, res, next) => {
    try {
        // Récupère le token du header Authorization: Bearer <token>
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // Extrait le token (retire "Bearer ")
        const token = authHeader.substring(7);

        // Vérifie et décode le token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Ajoute les infos utilisateur décodées à la requête
        req.user = decoded;
        
        // Passe au middleware suivant ou à la route
        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        return res.status(401).json({ error: 'Authentication failed' });
    }
};

export default auth;
