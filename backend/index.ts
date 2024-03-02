import { Server, ic } from 'azle';
import cors from "cors";
import express from 'express';

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  available: boolean;
  image: string;
}

const initialBooks: Book[] = [
  {
    id: 1,
    title: 'Harry Potter',
    author: 'J.K. Rowling',
    description: 'La serie de libros de Harry Potter narra la historia del joven mago Harry Potter y sus amigos Hermione Granger y Ron Weasley, quienes luchan contra el malvado mago Lord Voldemort.',
    available: true,
    image: 'harry-potter.jpg',
  },
  {
    id: 2,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: 'To Kill a Mockingbird es una novela escrita por Harper Lee. Publicada en 1960, fue inmediatamente exitosa, ganando el Premio Pulitzer al año siguiente.',
    available: true,
    image: 'to-kill-a-mockingbird.jpg',
  },
  {
    id: 3,
    title: '1984',
    author: 'George Orwell',
    description: '1984 es una novela distópica que narra la historia de Winston Smith, un ciudadano de un estado totalitario. La obra es una crítica a los regímenes totalitarios y la vigilancia masiva.',
    available: true,
    image: '1984.jpeg',
  },
  {
    id: 4,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'The Great Gatsby es una novela que explora temas como el sueño americano, la decadencia moral y la obsesión por la riqueza durante la década de 1920 en Estados Unidos.',
    available: true,
    image: 'the-great-gatsby.jpg',
  },
  {
    id: 5,
    title: 'One Hundred Years of Solitude',
    author: 'Gabriel García Márquez',
    description: 'Cien años de soledad es una novela que narra la historia de la familia Buendía en el ficticio pueblo de Macondo. Es una obra clave en el realismo mágico.',
    available: true,
    image: '100-years-of-solitude.jpeg',
  },
  {
    id: 6,
    title: 'The Hunger Games',
    author: 'Suzanne Collins',
    description: 'Los Juegos del Hambre es el primer libro de la trilogía escrita por Suzanne Collins. La historia se desarrolla en un futuro distópico donde los jóvenes deben luchar hasta la muerte en un evento televisado.',
    available: true,
    image: 'hunger-games.jpg',
  },
  {
    id: 7,
    title: 'Catching Fire',
    author: 'Suzanne Collins',
    description: 'Catching Fire es el segundo libro de la trilogía Los Juegos del Hambre. La historia sigue a Katniss Everdeen mientras enfrenta nuevas amenazas después de los eventos de los Juegos del Hambre.',
    available: true,
    image: 'catching-fire.jpg',
  },
  {
    id: 8,
    title: 'Mockingjay',
    author: 'Suzanne Collins',
    description: 'Mockingjay es el tercer libro de la trilogía Los Juegos del Hambre. La trama se centra en la rebelión contra el Capitolio y el papel clave de Katniss en la revuelta.',
    available: true,
    image: 'mockingjay.jpg',
  },
  {
    id: 9,
    title: 'The Ballad of Songbirds and Snakes',
    author: 'Suzanne Collins',
    description: 'The Ballad of Songbirds and Snakes es una precuela de la trilogía Los Juegos del Hambre. La historia se centra en el personaje del Presidente Snow y los eventos que llevaron a la creación de los Juegos del Hambre.',
    available: true,
    image: 'songbirds-and-snakes.jpg',
  }
];

export default Server(() => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use((req, res, next) => {
    next();
  });

  // Ruta para obtener la lista de libros
  app.get('/books', (req, res) => {
    res.status(200).json(initialBooks);
  });

  // Ruta para filtrar libros
  app.post('/books/filter', (req, res) => {
    const { searchTerm, filterType } = req.body;

    const filteredBooks = initialBooks.filter((book) => {
      const lowerCaseTitle = book.title.toLowerCase();
      const lowerCaseSearchTerm = searchTerm.toLowerCase();

      if (lowerCaseTitle.includes(lowerCaseSearchTerm)) {
        if (filterType === 'all') return true;
        if (filterType === 'borrowed') return !book.available;
        if (filterType === 'available') return book.available;
        return false;
      }
      return false;
    });

    res.status(200).json(filteredBooks);
  });

  // Ruta para ordenar libros por título
  app.get('/books/sort/title', (req, res) => {
    const sortedBooks = [...initialBooks].sort((a, b) => a.title.localeCompare(b.title));
    res.status(200).json(sortedBooks);
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
