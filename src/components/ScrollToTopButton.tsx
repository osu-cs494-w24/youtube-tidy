import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

const ScrollButton = styled.button`
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 100;
  width: 50px;
  height: 50px;
  background-color: #ff0000;
  color: white;
  border: none;
  border-radius: 50%;
  padding: 15px;
  cursor: pointer;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  :hover {
    transform: scale(1.1);
  }
`;

function ScrollToTopButton({ visible }: { visible: boolean }) {
  const [showButton, setShowButton] = useState(visible);

  useEffect(() => {
    const handleScroll = () => {
      // check if user has scrolled down from the top of the page
      if (window.scrollY > 0 && visible) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // remove scroll event listener when component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [visible]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {showButton && (
        <ScrollButton onClick={scrollToTop}>
          <FontAwesomeIcon icon={faArrowUp} />
        </ScrollButton>
      )}
    </>
  );
}

export default ScrollToTopButton;
