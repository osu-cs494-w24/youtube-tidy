import { ReactNode } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Login from "./Login";

import styled from "@emotion/styled";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faYoutube } from "@fortawesome/free-brands-svg-icons";

const Container = styled.main`
  display: flex;
  flex-direction: column;
  margin-left: 1rem;
  margin-right: 1rem;
`;

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faYoutube } from "@fortawesome/free-brands-svg-icons";

// const Logo = styled.div`
//   font-size: 3rem;
//   color: red;
//   @media (min-width: 587px) {
//     padding-left: 1rem;
//     font-size: 5rem;
//   }
// `;

// <Logo>
//   <FontAwesomeIcon icon={faYoutube} />
//   Tidy
// </Logo>;

function Root({ children }: { children?: ReactNode }) {
  return (
    <>
      <Navbar />

      <Container>
        <Login />
        {children || <Outlet />}
      </Container>
    </>
  );
}
export default Root;
