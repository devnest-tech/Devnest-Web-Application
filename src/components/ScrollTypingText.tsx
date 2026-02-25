'use client';

import { useEffect, useState } from 'react';
import { MotionValue, useTransform } from 'framer-motion';

interface ScrollTypingTextProps {
	text: string;
	progress: MotionValue<number>;
	scrollRange?: [number, number]; // Range of scroll progress to animate over (default [0, 1])
	showCursor?: boolean;
	className?: string;
}

export default function ScrollTypingText({
	text,
	progress,
	scrollRange = [0, 1],
	showCursor = false,
	className = ''
}: ScrollTypingTextProps) {
	const [displayedText, setDisplayedText] = useState('');
	const [currentLength, setCurrentLength] = useState(0);

	useEffect(() => {
		const unsubscribe = progress.on('change', (value) => {
			// Map progress value to text length
			const start = scrollRange[0];
			const end = scrollRange[1];

			// Normalize the progress within the specified range
			const normalizedProgress = Math.max(0, Math.min(1, (value - start) / (end - start)));

			// Calculate how many characters to show
			const charsToShow = Math.floor(normalizedProgress * text.length);

			if (charsToShow !== currentLength) {
				setCurrentLength(charsToShow);
				setDisplayedText(text.substring(0, charsToShow));
			}
		});

		return () => unsubscribe();
	}, [progress, text, scrollRange, currentLength]);

	return (
		<span className={className}>
			{displayedText}
			{showCursor && currentLength < text.length && (
				<span className="animate-pulse">|</span>
			)}
		</span>
	);
}
