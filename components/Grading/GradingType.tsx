import React from 'react';

interface PronunciationProps {
	message: string;
	title: string;
	color: string;
}

const GradingType: React.FC<PronunciationProps> = ({
	message,
	title,
	color,
}) => {
	return (
		<button
			className={`border-2 p-2 border-${color}-500 focus:border-green-600 rounded-md`}>
			<span>{title}</span>
			<p>{message}</p>
		</button>
	);
};

export default GradingType;
