import { motion } from "framer-motion";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
  text-align: center;
  color: #8b7355;
  position: relative;
`;

const ContentWrapper = styled.div`
  max-width: 800px;
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

const Title = styled(motion.h1)`
  font-family: "Playfair Display", serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  color: #8b7355;
  margin-bottom: 1rem;
  line-height: 1.2;
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
    font-size: 2rem;
  }
`;

const Subtitle = styled(motion.h2)`
  font-family: "Montserrat", sans-serif;
  font-size: clamp(1.2rem, 3vw, 1.5rem);
  color: #a67c52;
  margin-bottom: 2rem;
  line-height: 1.4;
  font-weight: 300;
  letter-spacing: 2px;
  text-transform: uppercase;

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const DateText = styled(motion.p)`
  font-family: "Montserrat", sans-serif;
  font-size: clamp(1.4rem, 3vw, 1.8rem);
  color: #a67c52;
  margin-bottom: 2rem;
  line-height: 1.4;
  font-weight: 300;
  letter-spacing: 1px;

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
  }
`;

const StyledLink = styled(Link)`
  padding: 1rem 2rem;
  background: #8b7355;
  color: white;
  text-decoration: none;
  border-radius: 30px;
  font-family: "Montserrat", sans-serif;
  transition: all 0.3s ease;
  min-width: 200px;
  text-align: center;
  letter-spacing: 1px;
  text-transform: uppercase;

  &:hover {
    background: #a67c52;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 0.8rem 1.5rem;
  }
`;

const CoupleImage = styled(motion.div)`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 2rem;
  border: 3px solid rgba(139, 115, 85, 0.3);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      rgba(245, 240, 230, 0.1),
      rgba(245, 240, 230, 0.05)
    );
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

  @media (max-width: 480px) {
    width: 150px;
    height: 150px;
  }
`;

const CountdownContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;
  flex-wrap: wrap;
`;

const CountdownItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 10px;
  min-width: 80px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background: #e9ecef;
    transform: translateY(-2px);
  }
`;

const CountdownNumber = styled.span`
  font-size: 2rem;
  font-weight: 600;
  color: #8b7355;
  font-family: "Montserrat", sans-serif;
`;

const CountdownLabel = styled.span`
  font-size: 0.8rem;
  color: #a67c52;
  text-transform: uppercase;
  font-family: "Montserrat", sans-serif;
  margin-top: 0.5rem;
  letter-spacing: 1px;
`;

const Home = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const weddingDate = new Date("2026-03-06T19:00:00").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = weddingDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <HomeContainer>
      <ContentWrapper>
        <CoupleImage
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img src="/images/couple.jpg" alt="Pareja" />
        </CoupleImage>
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Ian & Jocelyn
        </Title>
        <Subtitle
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Save the Date
        </Subtitle>
        <DateText
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Viernes, 6 de Marzo, 2026 a las 7:00 PM
        </DateText>

        <CountdownContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <CountdownItem>
            <CountdownNumber>{timeLeft.days}</CountdownNumber>
            <CountdownLabel>Días</CountdownLabel>
          </CountdownItem>
          <CountdownItem>
            <CountdownNumber>{timeLeft.hours}</CountdownNumber>
            <CountdownLabel>Horas</CountdownLabel>
          </CountdownItem>
          <CountdownItem>
            <CountdownNumber>{timeLeft.minutes}</CountdownNumber>
            <CountdownLabel>Minutos</CountdownLabel>
          </CountdownItem>
          <CountdownItem>
            <CountdownNumber>{timeLeft.seconds}</CountdownNumber>
            <CountdownLabel>Segundos</CountdownLabel>
          </CountdownItem>
        </CountdownContainer>

        <ButtonContainer>
          {/* <StyledLink to="/details">Detalles de la Boda</StyledLink> */}
          <StyledLink to="/rsvp">Confirmar Asistencia</StyledLink>
        </ButtonContainer>
      </ContentWrapper>
    </HomeContainer>
  );
};

export default Home;
