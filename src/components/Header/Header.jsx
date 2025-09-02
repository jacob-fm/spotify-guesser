import { UserAuth } from "../../lib/AuthContext.jsx";
import { NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./Header.css";
import { MenuIcon, XIcon } from "lucide-react";
import { useViewportSize } from "@mantine/hooks";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { width } = useViewportSize();
  const isMobile = width < 768;

  const navlinksContainer = useRef(null);

  const { session } = UserAuth();
  const conditionalLinks = session?.user
    ? [{ name: "Account", path: "/dashboard" }, {
      name: "Past Games",
      path: "/past-games",
    }]
    : [{ name: "Login", path: "/login" }];

  const navLinks = [
    { name: "Play", path: "/" },
    ...conditionalLinks,
    { name: "About", path: "/about" },
  ];

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

  return (
    <header>
      <nav>
        <NavLink to="/" className="header-logo">
          <img src="/assets/logo.svg" />
        </NavLink>
        {isMenuOpen && <div id="overlay" onClick={closeMenuOnMobile}></div>}
        <ul className={isMenuOpen ? "open" : isMobile ? "closed" : ""}>
          <div className="navlinks-container" ref={navlinksContainer}>
            {isMenuOpen && (
              <button
                type="button"
                onClick={toggleMenu}
                className="menu-toggle"
              >
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
          type="button"
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
