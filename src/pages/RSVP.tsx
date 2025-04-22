import { useState } from "react";
import { motion } from "framer-motion";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

const RSVPContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
  color: #8b7355;
  position: relative;
`;

const Form = styled(motion.form)`
  max-width: 600px;
  width: 100%;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin: 1rem;
  backdrop-filter: blur(5px);

  @media (max-width: 480px) {
    padding: 1.5rem;
    margin: 0.5rem;
  }
`;

const Title = styled.h2`
  font-family: "Playfair Display", serif;
  color: #8b7355;
  margin-bottom: 2rem;
  text-align: center;
  font-size: clamp(1.8rem, 3vw, 2.2rem);
  position: relative;
  padding-bottom: 1rem;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: linear-gradient(90deg, transparent, #8b7355, transparent);
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
`;

const Label = styled.label`
  display: block;
  font-family: "Montserrat", sans-serif;
  color: #a67c52;
  margin-bottom: 0.5rem;
  font-size: clamp(0.9rem, 2vw, 1rem);
  letter-spacing: 1px;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: "Montserrat", sans-serif;
  font-size: 1rem;
  color: #8b7355;
  transition: all 0.3s ease;

  &::placeholder {
    color: #adb5bd;
  }

  &:focus {
    outline: none;
    border-color: #8b7355;
  }

  @media (max-width: 480px) {
    padding: 0.7rem;
    font-size: 0.95rem;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: "Montserrat", sans-serif;
  font-size: 1rem;
  color: #8b7355;
  resize: vertical;
  transition: all 0.3s ease;

  &::placeholder {
    color: #adb5bd;
  }

  &:focus {
    outline: none;
    border-color: #8b7355;
  }

  @media (max-width: 480px) {
    padding: 0.7rem;
    font-size: 0.95rem;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: "Montserrat", sans-serif;
  font-size: 1rem;
  color: #8b7355;
  transition: all 0.3s ease;
  cursor: pointer;

  option {
    background: white;
    color: #8b7355;
  }

  &:focus {
    outline: none;
    border-color: #8b7355;
  }

  @media (max-width: 480px) {
    padding: 0.7rem;
    font-size: 0.95rem;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  background: #8b7355;
  color: white;
  border: none;
  border-radius: 30px;
  font-family: "Montserrat", sans-serif;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 1px;
  text-transform: uppercase;

  &:hover {
    background: #a67c52;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 480px) {
    padding: 0.8rem;
    font-size: 0.95rem;
  }
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-top: 2rem;
  padding: 1rem 2rem;
  background: #8b7355;
  color: white;
  text-decoration: none;
  border-radius: 30px;
  font-family: "Montserrat", sans-serif;
  transition: all 0.3s ease;
  letter-spacing: 1px;
  text-transform: uppercase;

  &:hover {
    background: #a67c52;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 480px) {
    width: 100%;
    text-align: center;
    padding: 0.8rem 1.5rem;
  }
`;

const RSVP = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    guests: "1",
    attending: "si",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí normalmente enviarías los datos a tu backend
    console.log("RSVP enviado:", formData);
    alert("¡Gracias por confirmar tu asistencia!");
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <RSVPContainer>
      <Form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onSubmit={handleSubmit}
      >
        <Title>Confirmar Asistencia</Title>

        <FormGroup>
          <Label htmlFor="name">Nombre</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="guests">Número de Invitados</Label>
          <Select
            id="guests"
            name="guests"
            value={formData.guests}
            onChange={handleChange}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="attending">¿Asistirás a la boda?</Label>
          <Select
            id="attending"
            name="attending"
            value={formData.attending}
            onChange={handleChange}
          >
            <option value="si">Sí, ¡estaré allí!</option>
            <option value="no">No, no podré asistir</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="message">Mensaje (opcional)</Label>
          <TextArea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
          />
        </FormGroup>

        <Button type="submit">Enviar Confirmación</Button>
      </Form>

      <BackLink to="/">Volver al Inicio</BackLink>
    </RSVPContainer>
  );
};

export default RSVP;
