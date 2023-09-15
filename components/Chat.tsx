import { useTypingEffect } from '@/Hooks/TypingEffect';
import React, { useRef, FC, useEffect } from 'react';
import MicIcon from '@mui/icons-material/Mic';
import Mic from '@mui/icons-material/Mic';

type Message = {
	role: string;
	content: string;
};

type ChatProps = {
	listening: boolean;
	messages: Message[];
	userSpeechInput: string;
};

const Chat: FC<ChatProps> = ({ listening, messages, userSpeechInput }) => {
	const chatMessagesRef = useRef<HTMLDivElement>(null);
	const typingEffect = useTypingEffect({ messages });

	const scrollToBottom = () => {
		chatMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
	};
	useEffect(() => {
		if (chatMessagesRef.current) {
			scrollToBottom();
		}
	}, [messages]);
	return (
		<div className="mt-10 flex flex-col gap-4 min-h-[40vh] flex-1">
			{messages.map((message, index) => (
				<div
					key={index}
					className="relative flex flex-col">
					<p className={`text-sm mt-[1.5px] font-bold`}>
						{message.role == 'assistant' ? 'AI-Interviewer' : 'Candidate'}:
					</p>
					<p
						key={index}
						className={`text-${message.role == 'assistant' ? 'xl' : 'xl'}`}>
						{index == messages.length - 1 && message.role == 'assistant'
							? typingEffect
							: message.content}
					</p>
				</div>
			))}
			<div className="flex flex-col mb-10">
				{messages[messages.length - 1].role == 'assistant' ? (
					<p className={`font-bold text-sm mt-[1.5px]`}>Candidate:</p>
				) : (
					<></>
				)}
				{listening ? (
					<span className="bg-white text-xl text-gray-700">
						<Mic />
					</span>
				) : (
					<span className="bg-white text-xl text-gray-700">
						{userSpeechInput}
					</span>
				)}
			</div>
			<div ref={chatMessagesRef}></div>
		</div>
	);
};

export default Chat;
