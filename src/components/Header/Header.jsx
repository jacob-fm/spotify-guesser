import { UserAuth } from "../../lib/AuthContext";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Header.css";
import { MenuIcon, XIcon } from "lucide-react";
import { useViewportSize } from "@mantine/hooks";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navLinks, setNavLinks] = useState([{ name: "Home", path: "/" }]);
  const { width } = useViewportSize();
  const isMobile = width < 768;

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
        <ul className={isMenuOpen ? "open" : isMobile ? "closed" : ""}>
          {navLinks.map((link) => (
            <li key={link.name} onClick={closeMenuOnMobile} className="navlink">
              <NavLink to={link.path}>{link.name}</NavLink>
            </li>
          ))}
        </ul>
        <button
          aria-labelledby="Menu Toggle Button"
          className="menu-toggle"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <XIcon size={32} /> : <MenuIcon size={32} />}
        </button>
      </nav>
    </header>
  );
}
