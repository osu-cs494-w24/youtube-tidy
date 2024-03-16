import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

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
  color: #ffffff;
  margin-right: 1rem;
  align-items: center;
  @media (min-width: 587px) {
    padding-left: 1rem;
    font-size: 1rem;
    font-size: 1.7rem;
    justify-content: center;
  }
`;

const MenuIcon = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const MobileNavButton = styled.button`
  background-color: inherit;
`;

function Navbar() {
  const [menu, setMenu] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const toggleStatus = () => {
    setMenu((prevIsOn) => !prevIsOn);
  };

  // Implementation of dynamic nav bar.
  // Code is dependent upon window.matchMedia function, recommended by this post.
  // See: 'Using JavaScript'.
  // Source: https://stackoverflow.com/questions/50156069/how-can-i-make-my-existing-responsive-navigation-bar-into-a-hamburger-menu-for-s
  useEffect(() => {
    const screen = window.matchMedia("(min-width: 587px)");
    const handleScreenChange = (e: MediaQueryListEvent) => {
      setMobileNav(e.matches);
    };

    screen.addEventListener("change", handleScreenChange);
    setMobileNav(screen.matches);

    return () => {
      screen.removeEventListener("change", handleScreenChange);
    };
  }, []);

  return (
    <>
      <NavbarUl>
        {window.innerWidth <= 586 ? (
          <>
            <NavbarLi>
              <ContainLogoWIcon>
                <MobileNavButton onClick={toggleStatus}>
                  <MenuIcon>
                    <FontAwesomeIcon icon={faBars} />
                  </MenuIcon>
                </MobileNavButton>
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
            {menu ? setMenu(false) : null}
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
