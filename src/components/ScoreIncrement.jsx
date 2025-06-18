import {
	animate,
	motion,
	useMotionValue,
	useTransform,
	useMotionValueEvent,
} from "motion/react";
import { useEffect, useState } from "react";

export default function ScoreIncrement({ startValue, endValue, duration }) {
	const count = useMotionValue(startValue);
	const rounded = useTransform(() => Math.round(count.get()));
	const [displayValue, setDisplayValue] = useState(startValue);
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		const controls = animate(count, endValue, { duration: duration });
		return () => controls.stop();
	}, []);

	useMotionValueEvent(rounded, "change", (latest) => {
		setDisplayValue(latest);
		if (latest <= 0) {
			setVisible(false); // Hide once it hits 0
		}
	});

	if (!visible) return null;

	return (
		<motion.span className="score-increment">+ {displayValue}</motion.span>
	);
}
