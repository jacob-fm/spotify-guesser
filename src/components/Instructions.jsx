export default function Instructions({ startGame }) {
    return (
        <section className="instructions">
            <h2>How to play:</h2>
            <p>
                Each round, you’ll be given a target artist. You’re job is to search
                for and select an artist who you think has a similar monthly
                listener count. The closer you are, the more points you’ll be
                awarded. See how many points you can accumulate in 5 rounds!
            </p>
            <button onClick={startGame}>Start Game</button>
        </section>
    );
}