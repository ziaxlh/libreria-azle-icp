import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Formulario from '../pages/borrow/formulario';

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  available: boolean;
  image: string;
}

function App() {
  const [books, setBooks] = useState<Book[]>([
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
    // Agrega más libros según sea necesario
  ]);

  const handleBorrow = (id: number) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === id ? { ...book, available: false } : book
      )
    );
  };

  const handleReturn = (id: number) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === id ? { ...book, available: true } : book
      )
    );
  };

  return (
    <Router>
      <div className="App">
        <h1 id="" >Préstamos de Libros</h1>
        <div>
          <h2>Lista de Libros</h2>
          <ul>
            {books.map((book) => (
              <li key={book.id}>
                <img src={book.image} alt={book.title} style={{ width: '200px', height: '290px' }} />
                <div>
                  <h3>{book.title}</h3>
                  <p>{book.description}</p>
                  <p>{book.available ? 'Disponible' : 'No disponible'}</p>
                  {book.available ? (
                    <Link to={`/borrow/formulario/${book.id}`}>Pedir prestado</Link>
                  ) : (
                    <button onClick={() => handleReturn(book.id)}>Devolver</button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <Routes>
          <Route path="/borrow/formulario/:id" element={<Formulario />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;