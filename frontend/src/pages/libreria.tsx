import React, { useEffect, useState } from 'react';
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

function App() {
  const backend = useRestActor("backend");
  const [books, setBooks] = useState<Book[]>([]);
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

  const fetchBooks = async () => {
    try {
      const response = await backend.get("/books");
      if (response.status === 200) {
        setBooks(response.data as Book[]); // Añadir 'as Book[]' para indicar el tipo esperado
      }
    } catch (error) {
      console.error({ error });
    }
  };
  
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

  useEffect(() => {
    fetchBooks();
  }, []); 

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