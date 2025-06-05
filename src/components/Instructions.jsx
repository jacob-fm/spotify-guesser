export default function Instructions({ startGame }) {
	return (
		<section className="instructions">
			<h2>How to play:</h2>
			<ol>
				<li>
					<b>A Target Artist will appear.&#10;</b>
					Your goal is to guess another artist whose{" "}
					<b>
						<a href="https://arc.net/l/quote/wlwrltze" target="_blank" rel="noreferrer">
							Spotify popularity score
						</a>
					</b>
					, between 0-100, is closest to theirs.
				</li>
				<li>
					Search for and select an artist, and click &quot;Submit Guess&quot; when ready.
				</li>
				<li>
					You’ll earn points based on how close your artist’s popularity is to
					the target’s!
				</li>
				<li>
					Play for 5 rounds, then see your final score and compare your guesses.
				</li>
			</ol>
			<button onClick={startGame}>Start Game</button>
		</section>
	);
}
