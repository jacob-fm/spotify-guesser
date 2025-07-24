export default function Instructions({ startGame }) {
	return (
		<section className="instructions">
			<h2>How to play:</h2>
			<ol>
				<li>
					Each round, you&apos;ll see a <b>Target Artist</b>, with their{" "}
					<span className="tooltip">
						<b>Popularity Score</b>
						<span className="tooltiptext">
							The Popularity Score measures how frequently and recently an
							artist is streamed on Spotify, from 0 - 100. You can learn more{" "}
							<a href="https://www.submithub.com/story/spotify-popularity-score-guide#:~:text=So%E2%80%A6%20what%20is%20the%20Popularity%20Score%3F">
								here.
							</a>
						</span>
					</span>{" "}
					hidden.
				</li>
				<li>
					Search for and select a <b>Guess Artist</b>, who you think is
					similarly popular.
				</li>
				<li>
					You&apos;ll earn more points the closer your guess is to the
					target&apos;s actual score.
				</li>
				<li>
					Play through 5 rounds and try to get the highest total score you can!
				</li>
				<li>
					A new set of 5 <b>Target Artists</b> are available every day, so come
					back daily for a fresh challenge!
				</li>
			</ol>
			<button onClick={startGame}>Start Game</button>
		</section>
	);
}
