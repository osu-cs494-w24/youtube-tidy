import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";

const NavbarUl = styled.ul`
  display: flex;
  flex-direction: column;
  background-color: #ff0000;
  margin: 0;
  padding: 0;

  @media (min-width: 587px) {
    flex-direction: row;
    margin: 1rem;
    border-radius: 7px;
  }
`;

const NavbarLi = styled.li`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  list-style-type: none;
  color: #ffffff;
  font-size: 1.4rem;

  a {
    color: #ffffff;
    text-decoration: none;
    padding: 1rem;
  }
  a.active {
    background-color: #000000;
    border-bottom: 4px solid rgb(255, 255, 255);
  }
  @media (min-width: 587px) {
    align-self: center;
    text-align: center;
  }
`;

function Navbar() {
  return (
    <>
      <NavbarUl>
        <NavbarLi>
          <NavLink to="/">Home</NavLink>
        </NavbarLi>

        <NavbarLi>
          <NavLink to="/playlists">Playlists</NavLink>
        </NavbarLi>

        <NavbarLi>
          <NavLink to="/subscriptions">Subscriptions</NavLink>
        </NavbarLi>

        <NavbarLi>
          <NavLink to="/search">Search</NavLink>
        </NavbarLi>
      </NavbarUl>
    </>
  );
}

export default Navbar;
