import { animate, motion, useMotionValue, useTransform, useMotionValueEvent } from "motion/react";
import { useEffect, useState } from "react";

export default function ScoreIncrement({ startValue, endValue, duration }) {
	const count = useMotionValue(startValue);
	const rounded = useTransform(() => Math.round(count.get()));
	const [displayValue, setDisplayValue] = useState(startValue);

	useEffect(() => {
		const controls = animate(count, endValue, { duration: duration });
		return () => controls.stop();
	}, []);

	useMotionValueEvent(rounded, "change", (latest) => {
		setDisplayValue(latest);
	});

	return <motion.span className="score-increment">+ {displayValue}</motion.span>;
}
