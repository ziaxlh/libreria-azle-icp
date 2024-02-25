import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './formulario.css';

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  returnDate: Date | null; // Nueva propiedad para almacenar la fecha de devolución
}

const BorrowForm: React.FC = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    returnDate: null,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (date: Date | null): void => {
    setFormData((prevData) => ({
      ...prevData,
      returnDate: date,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Aquí puedes manejar la lógica para enviar los datos del formulario.
    console.log('Datos del formulario:', formData);

    if (formData.returnDate) {
      console.log('Fecha de devolución:', formData.returnDate.toLocaleDateString());
      // También puedes redirigir al usuario a otra página después de enviar el formulario.
    }
  };

  return (
    <section>
      <div className="form-box">
        <div className="form-value">
          <div>
            <h1 id="formH1" >Formulario de Préstamo</h1>
            <br />
            <p id="formIdBook" >ID del libro: {id}</p>
            <br />
            <form onSubmit={handleSubmit}>
              <div className="inputbox">
                <label>
                  Nombre
                  <input type="text" name="name" value={formData.name} onChange={handleChange} />
                </label>
              </div>
              <div className="inputbox">
                <label>
                <br />
                  Correo electrónico
                  <input type="email" name="email" value={formData.email} onChange={handleChange} />
                </label>
                <br />
              </div>
              <div className="inputbox">
                <label>
                <br />
                  Teléfono
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
                </label>
                <br />
              </div>
              <div className="inputbox">
                <label>
                <br />
                  Dirección
                  <input type="text" name="address" value={formData.address} onChange={handleChange} />
                </label>
                <br />
              </div>
              <div className="inputbox">
                <label>
                <br />
                  Fecha de devolución
                  <DatePicker
                    selected={formData.returnDate}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                  />
                </label>
                <br />
              </div>
              <button id="formEnviar" type="submit">Enviar</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BorrowForm;