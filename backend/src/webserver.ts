// webserver.ts

import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { apiRouter } from './routes/api_routes';

dotenv.config({ path: `${__dirname}/../.env` });


// Configuration initiale
const PORT = 5686;


async function main() {
    const app = express();

    // Middlewares
    app.use(cors());
    app.use(express.json());


    // API ROUTES
    app.use('/api', apiRouter);


    // Démarrage du serveur
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}


// Lancement de l'application
main().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});

