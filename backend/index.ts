import { Server, ic } from 'azle';
import cors from "cors";
import express from 'express';

export default Server(() => {
    const app = express();

    app.use(cors());
    app.use(express.json());

    app.post('/test', (req, res) => {
        if (ic.caller().isAnonymous()) {
            res.status(401);
            res.send();
        } else {
            res.json(req.body);
        }
    });

    app.get('/whoami', (req, res) => {
        res.statusCode = 200;
        res.send(ic.caller());
    });

    app.get('/health', (req, res) => {
        res.send().statusCode = 204;
    });

    return app.listen();
});

/*
import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

interface Book {
  id: number;
  title: string;
  author: string;
  available: boolean;
}

const books: Book[] = [
  { id: 1, title: 'Harry Potter', author: 'J.K. Rowling', available: true },
  { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', available: true },
  // Agrega más libros según sea necesario
];

app.get('/api/books', (req: Request, res: Response) => {
  res.json(books);
});

app.post('/api/borrow/:id', (req: Request, res: Response) => {
  const bookId = parseInt(req.params.id);
  const book = books.find(book => book.id === bookId);

  if (!book) {
    res.status(404).json({ error: 'Libro no encontrado' });
  } else if (!book.available) {
    res.status(400).json({ error: 'Libro no disponible para préstamo' });
  } else {
    book.available = false;
    res.json(book);
  }
});

app.post('/api/return/:id', (req: Request, res: Response) => {
  const bookId = parseInt(req.params.id);
  const book = books.find(book => book.id === bookId);

  if (!book) {
    res.status(404).json({ error: 'Libro no encontrado' });
  } else {
    book.available = true;
    res.json(book);
  }
});

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});

export default app; */