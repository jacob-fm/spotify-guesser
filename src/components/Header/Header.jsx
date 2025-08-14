import { UserAuth } from "../../lib/AuthContext";
import { NavLink } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import "./Header.css";
import { MenuIcon, XIcon } from "lucide-react";
import { useViewportSize } from "@mantine/hooks";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navLinks, setNavLinks] = useState([{ name: "Home", path: "/" }]);
  const { width } = useViewportSize();
  const isMobile = width < 768;

  const navlinksContainer = useRef(null);

  const { session } = UserAuth();

  useEffect(() => {
    if (session === undefined || session === null) {
      setNavLinks([
        { name: "Home", path: "/" },
        { name: "Login", path: "/login" },
      ]);
    } else {
      setNavLinks([
        { name: "Home", path: "/" },
        { name: "Account", path: "/dashboard" },
      ]);
    }
  }, [session]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [isMenuOpen]);

  // Toggle menu open/closed
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when clicking a link on mobile
  const closeMenuOnMobile = () => {
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  // close mobile menu when area outside of main part is clicked
  function handleOverlayClick(e) {
    if (
      navlinksContainer.current &&
      navlinksContainer.current.contains(e.target)
    ) {
      // click happened inside main area: do nothing
      return;
    }
    closeMenuOnMobile();
  }

  return (
    <header>
      <nav>
        <NavLink to="/" className="header-logo">
          <img src="/assets/logo.svg" />
        </NavLink>
        <ul
          className={isMenuOpen ? "open" : isMobile ? "closed" : ""}
          onClick={handleOverlayClick}
        >
          <div className="navlinks-container" ref={navlinksContainer}>
            {isMenuOpen && (
              <button onClick={toggleMenu} className="menu-toggle">
                <XIcon size={32} />
              </button>
            )}
            {navLinks.map((link) => (
              <li
                key={link.name}
                onClick={closeMenuOnMobile}
                className="navlink"
              >
                <NavLink to={link.path}>{link.name}</NavLink>
              </li>
            ))}
          </div>
        </ul>
        <button
          aria-labelledby="Menu Toggle Button"
          className="menu-toggle"
          onClick={toggleMenu}
        >
          <MenuIcon size={32} />
        </button>
      </nav>
    </header>
  );
}
