import "./Instructions.css";
import Header from "../../../components/Header/Header";
import { MoveLeft, MoveRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { preload } from "react-dom";

function InstructionCard({ image, mainText, subText }) {
  return (
    <div className="info-card">
      {image && <img src={image} />}
      {mainText}
      {subText}
    </div>
  );
}

export default function Instructions({ startGame }) {
  const [cardIndex, setCardIndex] = useState(0);

  const cardContents = [
    {
      image: "/assets/instructions/target_highlight.png",
      mainText: (
        <h2>
          Each round, you'll have a new <b>Target Artist</b>.
        </h2>
      ),
    },
    {
      image: "/assets/instructions/search.png",
      mainText: (
        <h2>
          Search for and select a{" "}
          <b>Guess Artist</b>, who you think is similarly <b>Popular</b>.
        </h2>
      ),
      subText: (
        <a
          href="https://www.submithub.com/story/spotify-popularity-score-guide"
          target="_blank"
        >
          How do you measure <b>Popularity</b>?
        </a>
      ),
    },
    {
      image: "/assets/instructions/round_score.png",
      mainText: (
        <h2>
          You'll earn a max of 100 points, minus 5 for each point of difference
          in <b>Popularity</b>.
        </h2>
      ),
      subText: (
        <a
          href="https://www.submithub.com/story/spotify-popularity-score-guide"
          target="_blank"
        >
          How do you measure <b>Popularity</b>?
        </a>
      ),
    },
    {
      image: "/assets/instructions/scoreboard.png",
      mainText: (
        <h2>
          Play through 5 rounds and try to get the highest total score you can!
        </h2>
      ),
    },
    {
      mainText: (
        <h2>
          A new set of 5 Target Artists are available every day, so come back
          daily for a fresh challenge!
        </h2>
      ),
    },
    // Add more cards as needed
  ];

  preload("/assets/instructions/target_highlight.png", {
    as: "image",
  });
  preload("/assets/instructions/search.png", {
    as: "image",
  });
  preload("/assets/instructions/round_score.png", {
    as: "image",
  });
  preload("/assets/instructions/scoreboard.png", {
    as: "image",
  });

  const goBack = () => {
    if (cardIndex > 0) {
      setCardIndex(cardIndex - 1);
    }
  };

  const goForward = () => {
    if (cardIndex < cardContents.length - 1) {
      setCardIndex(cardIndex + 1);
    }
  };

  return (
    <>
      <title>Instructions | bopmatch - Daily Music Trivia Game</title>
      <Header />
      <section className="instructions-content">
        <h1>Instructions</h1>
        <InstructionCard
          image={cardContents[cardIndex].image}
          mainText={cardContents[cardIndex].mainText}
          subText={cardContents[cardIndex].subText}
        />
        <div className="arrow-group">
          <button
            className="filled"
            onClick={goBack}
            disabled={cardIndex === 0}
          >
            <MoveLeft />
          </button>
          <button
            className="filled"
            onClick={goForward}
            disabled={cardIndex >= cardContents.length - 1}
          >
            <MoveRight />
          </button>
        </div>
        <Link to="/game" className="button-link filled-alt">
          Play
        </Link>
        <Link to="/" className="button-link outlined">
          Home
        </Link>
      </section>
    </>
  );
}
