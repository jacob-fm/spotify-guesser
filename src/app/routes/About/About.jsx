import "./About.css";
import Header from "../../../components/Header/Header";
import { SiGithub, SiInstagram, SiX } from "@icons-pack/react-simple-icons";
import { MailIcon, UserIcon } from "lucide-react";
import { useEffect, useState } from "react";

const EmailLink = () => {
  const [link, setLink] = useState("#");
  useEffect(() => {
    const user = "bopmatch";
    const domain = "gmail.com";
    const fullEmail = `mailto:${user}@${domain}`;
    setLink(fullEmail);
  }, []);
  return (
    <a href={link} rel="nofollow, noindex">
      bopmatch at gmail dot com
    </a>
  );
};

export default function About() {
  return (
    <>
      <title>About | BopMatch - Daily Music Trivia Game</title>
      <Header />
      <div className="about">
        <h1>About BopMatch</h1>
        <p>
          BopMatch is the work of Jacob Feit Mann.<br></br>{" "}
          Feel free to email me with any questions, comments, or bug reports!
        </p>
        <ul>
          <li><SiX />
            <a href="https://x.com/BopMatch">BopMatch Twitter</a>
          </li>
          <li>
            <SiGithub />
            <a href="https://github.com/jacob-fm/spotify-guesser">
              BopMatch Github Repo
            </a>
          </li>
          <li>
            <MailIcon />
            <EmailLink />
          </li>
          <li>
            <UserIcon />
            <a href="https://jacobfm.com/">Jacob's Website</a>
          </li>
        </ul>
      </div>
    </>
  );
}
