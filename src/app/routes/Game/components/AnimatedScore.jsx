import { useEffect, useState } from 'react';
import { useMotionValue, animate } from "motion/react";

function AnimatedScore({ previousScore, newScore, duration }) {
  // Create a motion value initialized to the previous score
  const motionScore = useMotionValue(previousScore);

  // Local state to display the rounded number
  const [displayScore, setDisplayScore] = useState(previousScore);

  useEffect(() => {
    // Animate the motion value to the new score
    const controls = animate(motionScore, newScore, {
      duration: duration,
      onUpdate: (latest) => {
        // Round the animated value and update state
        setDisplayScore(Math.round(latest));
      },
    });

    // Clean up the animation if the component unmounts or new animation starts
    return controls.stop;
  }, [newScore]);

  return (
    <span className='score'>
      Score: {displayScore}
    </span>
  );
}

export default AnimatedScore;
