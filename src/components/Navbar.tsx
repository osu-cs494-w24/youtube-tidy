import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { useAppSelector } from "../redux/hooks";
import Cookies from "js-cookie";
import guestPicture from "../assets/unnamed.jpg";

const NavbarUl = styled.ul`
  display: flex;
  flex-direction: column;
  background-color: #ff0000;
  margin: 0;
  padding: 0;
  margin-bottom: 20px;

  @media (min-width: 655px) {
    flex-direction: row;
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
    @media (min-width: 655px) {
    }
  }
  @media (min-width: 655px) {
    align-self: center;
    text-align: center;
  }

  a.active:hover {
    color: #ffffff;

    .svg-inline--fa {
      color: #ffffff;
    }

    p {
      color: #ffffff;
    }
  }

  a:hover {
    color: #000000;

    .svg-inline--fa {
      color: #000000;
    }

    p {
      color: #000000;
    }
  }

  p {
    margin: 0;
    padding: 0;
  }
`;

const UserToolTip = styled.span`
  text-align: center;
  font-size: 0.75rem;
  background-color: #ff0000;
  box-shadow: 0 0 10px 0 black;
  color: white;
  border-radius: 6px;
  padding: 3px;
  position: absolute;
  bottom: -15px;
  left: 6;
  opacity: 0;
  transition: opacity 0.3s;
`;

const UserContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 10px;
  position: relative;

  .user-img {
    position: relative;
    width: 50px;
    height: 50px;
    border-radius: 50%;

    &:hover {
      transform: scale(1.1);
      cursor: pointer;
    }

    &:hover + ${UserToolTip} {
      opacity: 0.9;
    }
  }
`;

const ContainLogoWIcon = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Logo = styled.div`
  display: flex;
  font-size: 2rem;
  color: #ffffff;
  margin-right: 1rem;
  align-items: center;
  @media (min-width: 655px) {
    padding-left: 1rem;
    font-size: 1rem;
    font-size: 1.7rem;
    justify-content: center;
  }
`;

const MenuIcon = styled.div`
  display: flex;
`;

const MobileNavButton = styled.button`
  background-color: inherit;
  margin-right: auto;

  &:hover .fa-bars {
    color: #ffffff;
  }
`;

function Navbar() {
  const user = useAppSelector((state) => state.user.info);
  const [menu, setMenu] = useState(false);
  const [, setMobileNav] = useState(false);
  const toggleStatus = () => {
    setMenu((prevIsOn) => !prevIsOn);
  };

  // Implementation of dynamic nav bar.
  // Code is dependent upon window.matchMedia function, recommended by this post.
  // See: 'Using JavaScript'.
  // Source: https://stackoverflow.com/questions/50156069/how-can-i-make-my-existing-responsive-navigation-bar-into-a-hamburger-menu-for-s
  useEffect(() => {
    const screen = window.matchMedia("(min-width: 655px)");
    const handleScreenChange = (e: MediaQueryListEvent) => {
      setMobileNav(e.matches);
    };

    screen.addEventListener("change", handleScreenChange);
    setMobileNav(screen.matches);

    return () => {
      screen.removeEventListener("change", handleScreenChange);
    };
  }, []);

  const logout = () => {
    Cookies.remove("access_token");
    window.location.reload();
  };

  return (
    <>
      <NavbarUl>
        {window.innerWidth <= 654 ? (
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
                {user && (
                  <UserContainer>
                    <img
                      className="user-img"
                      src={user.name === "Guest" ? guestPicture : user.picture}
                      alt={"profile picture"}
                      onClick={logout}
                    />
                    <UserToolTip>Logout</UserToolTip>
                  </UserContainer>
                )}
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
        {window.innerWidth >= 655 ? (
          <>
            {menu ? setMenu(false) : null}
            <NavbarLi>
              <NavLink to="/">
                <Logo>
                  <FontAwesomeIcon icon={faYoutube} />
                  <p>Tidy</p>
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
            {user && (
              <UserContainer>
                <img
                  className="user-img"
                  src={user.name === "Guest" ? guestPicture : user.picture}
                  alt={"profile picture"}
                  onClick={logout}
                />
                <UserToolTip>Logout</UserToolTip>
              </UserContainer>
            )}
          </>
        ) : null}{" "}
      </NavbarUl>
    </>
  );
}

export default Navbar;
