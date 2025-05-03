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
    padding: 1rem;
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
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;

  @media (max-width: 480px) {
    margin-bottom: 0.5rem;
  }
`;

const Label = styled.label`
  display: block;
  font-family: "Montserrat", sans-serif;
  color: #a67c52;
  margin-bottom: 0.5rem;
  font-size: clamp(0.9rem, 2vw, 1rem);
  letter-spacing: 1px;

  @media (max-width: 480px) {
    margin-bottom: 0.25rem;
    font-size: 0.85rem;
  }
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
    padding: 0.6rem;
    font-size: 0.9rem;
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
    padding: 0.6rem;
    font-size: 0.9rem;
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
    padding: 0.6rem;
    font-size: 0.9rem;
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
    padding: 0.7rem;
    font-size: 0.9rem;
  }
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-top: 1rem;
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

const WelcomeMessage = styled.div`
  max-width: 800px;
  width: 100%;
  text-align: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  @media (max-width: 480px) {
    padding: 1rem;
    margin-bottom: 1rem;
  }
`;

const WelcomeText = styled.p`
  font-family: "Playfair Display", serif;
  font-size: clamp(0.9rem, 1.5vw, 1.1rem);
  color: #8b7355;
  line-height: 1.6;
  margin-bottom: 1rem;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 0.85rem;
    line-height: 1.4;
    margin-bottom: 0.5rem;
  }
`;

const ConfirmationScreen = styled(motion.div)`
  text-align: center;
  padding: 2rem;
`;

const ConfirmationTitle = styled(motion.h2)`
  font-family: "Playfair Display", serif;
  color: #8b7355;
  margin-bottom: 1.5rem;
  font-size: clamp(1.8rem, 3vw, 2.2rem);
`;

const ConfirmationText = styled(motion.p)`
  font-family: "Montserrat", sans-serif;
  color: #a67c52;
  margin-bottom: 2rem;
  font-size: clamp(1rem, 2vw, 1.2rem);
  line-height: 1.6;
`;

const ConfirmationButtonContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
`;

const DeadlineMessage = styled.p`
  font-family: "Montserrat", sans-serif;
  color: #a67c52;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 1rem;
  font-style: italic;

  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin-top: 0.5rem;
  }
`;

const RSVP = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    hasCompanion: false,
    companionName: "",
    attending: true,
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/rsvps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error al enviar el RSVP");
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error("Error:", error);
      alert(
        "Hubo un error al enviar tu confirmación. Por favor, intenta de nuevo."
      );
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addToCalendar = () => {
    const eventDetails = {
      title: "Boda de Ian & Jocelyn",
      description: "¡Te esperamos en nuestra boda!",
      location:
        "Hacienda Monaco, Sendero de las Haciendas 115, Quinta la Huaracha, 37685 León, Gto. México",
      startTime: "20260306T190000",
      endTime: "20260307T010000",
    };

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      eventDetails.title
    )}&details=${encodeURIComponent(
      eventDetails.description
    )}&location=${encodeURIComponent(eventDetails.location)}&dates=${
      eventDetails.startTime
    }/${eventDetails.endTime}`;

    window.open(googleCalendarUrl, "_blank");
  };

  if (isSubmitted) {
    return (
      <RSVPContainer>
        <Form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ConfirmationScreen>
            <ConfirmationTitle
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {formData.attending ? "¡Muchas gracias!" : "¡Lo sentimos mucho!"}
            </ConfirmationTitle>
            <ConfirmationText
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {formData.attending ? (
                <>
                  {formData.name}, gracias por confirmar tu asistencia. Estamos
                  muy emocionados de celebrar este día tan especial contigo. ¡Te
                  esperamos con ansias en nuestra boda! Pronto recibirás la
                  invitación formal con todos los detalles del evento.
                </>
              ) : (
                <>
                  {formData.name}, lamentamos mucho que no puedas asistir a
                  nuestra boda. Entendemos que hay muchas razones por las que no
                  podrías estar presente, y aunque nos hubiera encantado
                  celebrar contigo, esperamos verte en otra ocasión. ¡Gracias
                  por tu mensaje!
                </>
              )}
            </ConfirmationText>
            <ConfirmationButtonContainer
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {formData.attending && (
                <Button onClick={addToCalendar}>Agregar al Calendario</Button>
              )}
              <BackLink to="/">Volver al Inicio</BackLink>
            </ConfirmationButtonContainer>
          </ConfirmationScreen>
        </Form>
      </RSVPContainer>
    );
  }

  return (
    <RSVPContainer>
      <Form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onSubmit={handleSubmit}
      >
        <Title>Confirmar Asistencia</Title>
        <WelcomeText>
          Por favor, tómate un momento para confirmar tu asistencia y ayudarnos
          a planificar este día inolvidable. Tu presencia es muy importante para
          nosotros y nos encantaría celebrar juntos este nuevo capítulo de
          nuestras vidas. En su momento, recibirás la invitación formal con
          todos los detalles del evento.
        </WelcomeText>
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
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="attending">¿Asistirás a la boda?</Label>
          <Select
            id="attending"
            name="attending"
            value={formData.attending ? "true" : "false"}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                attending: e.target.value === "true",
              }));
            }}
          >
            <option value="true">Sí, ¡estaré allí!</option>
            <option value="false">No, no podré asistir</option>
          </Select>
        </FormGroup>
        {formData.attending && (
          <>
            <FormGroup>
              <Label>
                ¿Llevarás algún acompañante?
                <Select
                  name="hasCompanion"
                  value={formData.hasCompanion ? "true" : "false"}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      hasCompanion: e.target.value === "true",
                    }));
                  }}
                  style={{ marginLeft: "1rem", width: "auto" }}
                >
                  <option value="false">No</option>
                  <option value="true">Sí</option>
                </Select>
              </Label>
            </FormGroup>
            {formData.hasCompanion && (
              <FormGroup>
                <Label htmlFor="companionName">Nombre del Acompañante</Label>
                <Input
                  type="text"
                  id="companionName"
                  name="companionName"
                  value={formData.companionName}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            )}
          </>
        )}
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
        <DeadlineMessage>
          Fecha límite para confirmar: 6 de Septiembre
        </DeadlineMessage>
      </Form>

      <BackLink to="/">Volver al Inicio</BackLink>
    </RSVPContainer>
  );
};

export default RSVP;
