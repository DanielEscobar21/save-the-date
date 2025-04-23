import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import styled from "@emotion/styled";
import { useEffect } from "react";
import Home from "./pages/Home";
import Details from "./pages/Details";
import RSVP from "./pages/RSVP";
import PageTransition from "./components/PageTransition";
import Footer from "./components/Footer";

const AppContainer = styled.div`
  min-height: 100vh;
  position: relative;
  overflow: hidden;
`;

const BackgroundImage = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("/images/background.jpg") center/cover no-repeat;
  z-index: 0;
`;

const ContentContainer = styled.div`
  position: relative;
  z-index: 1;
`;

const App = () => {
  useEffect(() => {
    // Precargar la imagen
    const img = new Image();
    img.src = "/images/background.jpg";
  }, []);

  return (
    <Router>
      <AppContainer>
        <BackgroundImage />
        <ContentContainer>
          <AnimatedRoutes />
          <Footer />
        </ContentContainer>
      </AppContainer>
    </Router>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />
        <Route
          path="/details"
          element={
            <PageTransition>
              <Details />
            </PageTransition>
          }
        />
        <Route
          path="/rsvp"
          element={
            <PageTransition>
              <RSVP />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

export default App;
