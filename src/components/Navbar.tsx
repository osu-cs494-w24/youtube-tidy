import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";
import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

import { faYoutube } from "@fortawesome/free-brands-svg-icons";

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
  font-size: 1.7rem;

  a {
    color: #ffffff;
    text-decoration: none;
    padding: 1rem;
  }
  a.active {
    background-color: #000000;
    @media (min-width: 587px) {
      border-radius: 7px;
    }
  }
  @media (min-width: 587px) {
    align-self: center;
    text-align: center;
  }
`;

const ContainLogoWIcon = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Logo = styled.div`
  display: flex;
  font-size: 2rem;
  color: #000000;
  margin-right: 1rem;
  align-items: center;
  @media (min-width: 587px) {
    padding-left: 1rem;
    font-size: 1rem;
    font-size: 1.7rem;
    color: #ffffff;
    justify-content: center;
  }
`;

const MenuIcon = styled.div`
  display: flex;
  justify-content: flex-end;
`;

function Navbar() {
  const [menu, setMenu] = useState(false);
  const toggleStatus = () => {
    setMenu((prevIsOn) => !prevIsOn);
  };

  return (
    <>
      <NavbarUl>
        {window.innerWidth <= 586 ? (
          <>
            <NavbarLi>
              <ContainLogoWIcon>
                <button onClick={toggleStatus}>
                  <MenuIcon>
                    <FontAwesomeIcon icon={faBars} />
                  </MenuIcon>
                </button>
                <Logo>
                  <FontAwesomeIcon icon={faYoutube} />
                  Tidy
                </Logo>
              </ContainLogoWIcon>
            </NavbarLi>
          </>
        ) : null}
        {menu ? (
          <>
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
          </>
        ) : null}
        {window.innerWidth >= 587 ? (
          <>
            <NavbarLi>
              <NavLink to="/">
                <Logo>
                  <FontAwesomeIcon icon={faYoutube} />
                  Tidy
                </Logo>
              </NavLink>
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
          </>
        ) : null}{" "}
      </NavbarUl>
    </>
  );
}

export default Navbar;
