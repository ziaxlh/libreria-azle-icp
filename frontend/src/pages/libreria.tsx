import React, { useState } from 'react';
import './libreria.css'; 
import { AuthButton, useRestActor } from "@bundly/ic-react";

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  available: boolean;
  image: string;
}

interface BorrowForm {
  name: string;
  email: string;
  returnDate: string;
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

function App() {
  const backend = useRestActor("backend");
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [showBorrowForm, setShowBorrowForm] = useState<boolean>(false);
  const [borrowForm, setBorrowForm] = useState<BorrowForm>({
    name: '',
    email: '',
    returnDate: '',
  });
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [invoiceVisible, setInvoiceVisible] = useState<boolean>(false);
  const [returnMessageVisible, setReturnMessageVisible] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'borrowed' | 'available'>('all');
  const [loginMessageVisible, setLoginMessageVisible] = useState<boolean>(false);
  
  const sortBooksByTitle = () => {
    const sortedBooks = [...books].sort((a, b) => a.title.localeCompare(b.title));
    setBooks(sortedBooks);
  };

  const handleBorrow = async (id: number) => {
    // Verificar si el usuario está autenticado
    try {
      const response = await backend.get("/whoami");
  
      if (response.status === 200) {
        // El usuario está autenticado, permitir el préstamo
        setSelectedBookId(id);
        setShowBorrowForm(true);
      } else {
        // El usuario no está autenticado, mostrar el mensaje de inicio de sesión
      }
    } catch (error) {
      console.error({ error });

      setLoginMessageVisible(true);
    }
  };
  
  

  const handleReturn = (id: number) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === id ? { ...book, available: true } : book
      )
    );
    setReturnMessageVisible(true);
  };

  const handleBorrowFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (selectedBookId !== null) {
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === selectedBookId ? { ...book, available: false } : book
        )
      );

      setShowBorrowForm(false);
      setInvoiceVisible(true);
    }
  };

  const handleContinueReading = () => {
    setInvoiceVisible(false);
    setReturnMessageVisible(false);
    setLoginMessageVisible(false);
  };

  async function whoAmI() {
    try {
        const response = await backend.get("/whoami");

        console.log(response);
    } catch (error) {
        console.error({ error });
    }
}

  const filteredBooks = books.filter((book) => {
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

  return (
    <div className="App">
      <h1 id="awaH1">Préstamos de Libros</h1>
      <AuthButton />
      <button onClick={() => whoAmI()}>ᓚᘏᗢ</button>
      <div>
        <input
          type="text"
          placeholder="Buscar libro..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <h2 id="awaH2">Lista de Libros</h2>
        <button onClick={() => setFilterType('all')}>Todos</button>
        <button onClick={sortBooksByTitle}>Ordenar por título</button>
        <button onClick={() => setFilterType('available')}>Disponibles</button>
        <button onClick={() => setFilterType('borrowed')}>Pedidos Prestados</button>
        <ul>
          {filteredBooks.map((book) => (
            <li key={book.id}>
              <img
                src={book.image}
                alt={book.title}
                style={{ width: '200px', height: '290px' }}
              />
              <div>
                <h3>{book.title}</h3>
                <p>{book.description}</p>
                <p>{book.author}</p>
                <p>{book.available ? 'Disponible 🟢' : 'No disponible 🔴'}</p>
                {book.available ? (
                  <button onClick={() => handleBorrow(book.id)}>
                    Pedir prestado
                  </button>
                ) : (
                  <button onClick={() => handleReturn(book.id)}>Devolver</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* Formulario de préstamo */}
      {showBorrowForm && (
        <div className="borrow-form-container">
          <form onSubmit={handleBorrowFormSubmit}>
            <label>
              Nombre:
              <input
                type="text"
                value={borrowForm.name}
                onChange={(e) => setBorrowForm({ ...borrowForm, name: e.target.value })}
                required
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                value={borrowForm.email}
                onChange={(e) => setBorrowForm({ ...borrowForm, email: e.target.value })}
                required
              />
            </label>
            <label>
              Fecha de entrega:
              <input
                type="date"
                value={borrowForm.returnDate}
                onChange={(e) => setBorrowForm({ ...borrowForm, returnDate: e.target.value })}
                required
              />
            </label>
            <button type="submit">Confirmar préstamo</button>
          </form>
        </div>
      )}

      {returnMessageVisible && (
        <div className="return-message-container">
          <h2>¡Gracias por devolver el libro!</h2>
          <button onClick={handleContinueReading}>Continuar leyendo</button>
        </div>
      )}

        {loginMessageVisible && (
          <div className="return-message-container">
            <h2>Inicia sesión primero para pedir prestado</h2>
            <button onClick={handleContinueReading}>Continuar</button>
          </div>
        )}

      {/* Factura */}
      {invoiceVisible && (
        <div className="invoice-container">
          <h2>¡Espero disfrutes de tu libro!</h2>
          <p>Has pedido el libro: {books.find((book) => book.id === selectedBookId)?.title}</p>
          <p>ID del libro: {selectedBookId}</p>
          <p>Tu nombre: {borrowForm.name}</p>
          <p>Fecha de entrega: {borrowForm.returnDate}</p>
          <p>Correo: {borrowForm.email}</p>
          <button onClick={handleContinueReading}>Continuar leyendo</button>
        </div>
      )}
    </div>
  );
}

export default App;