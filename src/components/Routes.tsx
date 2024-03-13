import { ReactNode } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Login from "./Login";

import styled from "@emotion/styled";

const Container = styled.main`
  display: flex;
  flex-direction: column;
  margin-left: 1rem;
  margin-right: 1rem;
`;

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
