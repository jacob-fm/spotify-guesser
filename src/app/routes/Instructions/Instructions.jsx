import "./Instructions.css";
import Header from "../../../components/Header/Header";
import { MoveLeft, MoveRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

function InstructionCard({ image, mainText, subText }) {
  return (
    <div className="info-card">
      <img src={image} />
      {mainText}
      {subText}
    </div>
  );
}

export default function Instructions({ startGame }) {
  const [cardIndex, setCardIndex] = useState(0);

  const cardContents = [
    {
      image:
        "https://cdn.pixabay.com/photo/2025/04/24/01/29/trees-9554109_1280.jpg",
      mainText: (
        <h2>
          Each round, you'll see a <b>Target Artist</b> with their{" "}
          <b>Popularity</b> hidden.
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
      image: "https://i.imgur.com/Lbhw0Yw.jpeg",
      mainText: (
        <h2>
          Search for and select a <b>Guess Artist</b>, who you think is
          similarly popular.
        </h2>
      ),
    },
    {
      image: "https://i.imgur.com/Lbhw0Yw.jpeg",
      mainText: (
        <h2>
          You'll earn a max of 100 points, minus 5 for each point of difference
          in <b>Popularity</b>.
        </h2>
      ),
    },
    {
      image: "https://i.imgur.com/Lbhw0Yw.jpeg",
      mainText: (
        <h2>
          Play through 5 rounds and try to get the highest total score you can!
        </h2>
      ),
    },
    {
      image: "https://i.imgur.com/Lbhw0Yw.jpeg",
      mainText: (
        <h2>
          A new set of 5 Target Artists are available every day, so come back
          daily for a fresh challenge!
        </h2>
      ),
    },

    // Add more cards as needed
  ];

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
      <Header />
      <section className="instructions-content">
        <InstructionCard
          image={cardContents[cardIndex].image}
          mainText={cardContents[cardIndex].mainText}
          subText={cardContents[cardIndex].subText}
        />
        <div className="arrow-group">
          <button className="filled" onClick={goBack}>
            <MoveLeft />
          </button>
          <button className="filled" onClick={goForward}>
            <MoveRight />
          </button>
        </div>
        <Link to="/" className="button-link outlined">
          Home
        </Link>
      </section>
    </>
  );
}
