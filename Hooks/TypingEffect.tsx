import { useState, useEffect } from 'react';

interface Message {
	role: string;
	content: string;
}

type Props = {
	messages: Message[];
};
export const useTypingEffect = ({ messages }: Props) => {
	const [typingEffect, setTypingEffect] = useState('');

	useEffect(() => {
		const timeout = setTimeout(() => {
			setTypingEffect(
				messages[messages.length - 1].content.slice(0, typingEffect.length + 1)
			);
		}, 13);
		return () => clearTimeout(timeout);
	}, [typingEffect, messages]);

	return typingEffect;
};
