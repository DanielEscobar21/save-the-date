import styled from "@emotion/styled";
import { Link } from "react-router-dom";

const FooterContainer = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.95);
  font-family: "Montserrat", sans-serif;
  font-size: 0.9rem;
  z-index: 10;
`;

const FooterLink = styled.a`
  color: #8b7355;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #a67c52;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      hecho por{" "}
      <FooterLink
        href="https://descoba.dev"
        target="_blank"
        rel="noopener noreferrer"
      >
        descoba.dev
      </FooterLink>
    </FooterContainer>
  );
};

export default Footer;
