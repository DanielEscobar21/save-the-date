import { motion } from "framer-motion";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
  background-color: #f5f0e6;
  color: #2c3e50;
  position: relative;
`;

const WelcomeMessage = styled.div`
  max-width: 800px;
  width: 100%;
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  @media (max-width: 480px) {
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
`;

const WelcomeText = styled.p`
  font-family: "Playfair Display", serif;
  font-size: clamp(1.2rem, 2vw, 1.5rem);
  color: #8b7355;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const Section = styled(motion.section)`
  max-width: 1000px;
  width: 100%;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }

  @media (max-width: 480px) {
    margin-bottom: 1.5rem;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 300px;
  overflow: hidden;
  position: relative;

  @media (min-width: 768px) {
    width: 40%;
    height: auto;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1));
    pointer-events: none;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const ContentContainer = styled.div`
  padding: 2rem;
  width: 100%;

  @media (min-width: 768px) {
    width: 60%;
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

const Title = styled.h2`
  font-family: "Playfair Display", serif;
  color: #8b7355;
  margin-bottom: 1.5rem;
  font-size: clamp(1.8rem, 3vw, 2.2rem);
  position: relative;
  padding-bottom: 0.5rem;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 3px;
    background: linear-gradient(90deg, #8b7355, transparent);
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const Text = styled.p`
  font-family: "Montserrat", sans-serif;
  color: #a67c52;
  line-height: 1.8;
  margin-bottom: 1rem;
  font-size: clamp(1rem, 2vw, 1.1rem);
  font-weight: 300;

  @media (max-width: 480px) {
    font-size: 0.95rem;
    line-height: 1.6;
  }
`;

const InfoList = styled.div`
  margin-top: 1.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.8rem;
  font-family: "Montserrat", sans-serif;
  color: #a67c52;

  svg {
    margin-right: 0.8rem;
    color: #8b7355;
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

const Details = () => {
  return (
    <DetailsContainer>
      <WelcomeMessage
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <WelcomeText>
          Nos encantaría que formes parte de este momento tan especial en
          nuestras vidas. Después de años de amor y compañía, hemos decidido
          unir nuestros caminos en un día lleno de alegría y celebración. Tu
          presencia hará este día aún más memorable.
        </WelcomeText>
      </WelcomeMessage>

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <ImageContainer>
          <img src="/images/ceremony.jpg" alt="Ceremonia" />
        </ImageContainer>
        <ContentContainer>
          <Title>Ceremonia</Title>
          <Text>
            La ceremonia se llevará a cabo en la Catedral de Santa María el
            viernes 6 de marzo a las 7:00 PM. Por favor, lleguen 30 minutos
            antes del inicio de la ceremonia.
          </Text>
          <InfoList>
            <InfoItem>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Calle Catedral 123, Ciudad, Estado 12345
            </InfoItem>
            <InfoItem>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              6 de Marzo, 2026 - 7:00 PM
            </InfoItem>
          </InfoList>
        </ContentContainer>
      </Section>

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <ImageContainer>
          <img src="/images/reception.jpg" alt="Recepción" />
        </ImageContainer>
        <ContentContainer>
          <Title>Recepción</Title>
          <Text>
            La recepción se realizará inmediatamente después de la ceremonia en
            el Salón de Eventos. La hora de cóctel comienza a las 8:00 PM,
            seguida de la cena y el baile.
          </Text>
          <InfoList>
            <InfoItem>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Avenida Salón 456, Ciudad, Estado 12345
            </InfoItem>
            <InfoItem>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              6 de Marzo, 2026 - 8:00 PM
            </InfoItem>
          </InfoList>
        </ContentContainer>
      </Section>

      <BackLink to="/">Volver al Inicio</BackLink>
    </DetailsContainer>
  );
};

export default Details;
