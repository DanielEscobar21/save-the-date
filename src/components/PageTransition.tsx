import { motion } from "framer-motion";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";

interface PageTransitionProps {
  children: React.ReactNode;
}

const ContentWrapper = styled(motion.div)`
  position: relative;
  z-index: 1;
`;

const PageTransition = ({ children }: PageTransitionProps) => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ContentWrapper
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          delay: isInitialLoad ? 1.5 : 0,
          type: "spring",
          stiffness: 150,
          damping: 25,
          duration: 1.2,
        },
      }}
      exit={{
        opacity: 0,
        y: -20,
        transition: {
          duration: 0.8,
          ease: "easeInOut",
        },
      }}
    >
      {children}
    </ContentWrapper>
  );
};

export default PageTransition;
