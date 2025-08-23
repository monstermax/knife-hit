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


    // STATIC ROUTES
    if (process.argv.includes('--prod')) {
        // prod
        app.use(express.static(`${__dirname}/../../frontend/dist/`))

    } else {
        // dev - redirection (TODO: proxy ou embeded server) vers le serveur de développement frontend
        //console.log('Mode développement activé - proxy vers http://localhost:5685');

        app.use('/', async (req: Request, res: Response) => {
            let html = `<html><script>window.location.href = 'http://localhost:5685/'</script></html>`;
            res.send(html);
        });
    }


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

