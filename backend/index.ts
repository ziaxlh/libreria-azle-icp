import { Server, ic } from 'azle';
import cors from "cors";
import express from 'express';

export default Server(() => {
    const app = express();

    app.use(cors());
    app.use(express.json());

    app.use((req, res, next) => {
        if (ic.caller().isAnonymous()) {
            res.status(401).send();
        } else {
            next();
        }
    });

    app.get('/whoami', (req, res) => {
        if (ic.caller().isAnonymous()) {
            res.status(401).send();
        } else {
            res.status(200).send(ic.caller());
        }
    });

    app.get('/health', (req, res) => {
        res.status(204).send();
    });

    return app.listen();
});
