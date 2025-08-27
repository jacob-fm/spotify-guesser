import "./About.css";
import Header from "../../../components/Header/Header";
import { SiGithub, SiInstagram } from "@icons-pack/react-simple-icons";
import { UserIcon } from "lucide-react";

export default function About() {
  return (
    <>
      <title>About | bopmatch - Daily Music Trivia Game</title>
      <Header />
      <div className="about">
        <h1>About bopmatch</h1>
        <p>bopmatch is the work of Jacob Feit Mann.</p>
        <ul>
          <li>
            <SiGithub />
            <a href="https://github.com/jacob-fm/spotify-guesser">
              bopmatch Github Repo
            </a>
          </li>
          <li>
            <UserIcon />
            <a href="https://jacobfm.com/">Jacob's Website</a>
          </li>
          <li>
            <SiInstagram />
            <a href="https://www.instagram.com/i.love.kishka/">
              Jacob's Instagram
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
