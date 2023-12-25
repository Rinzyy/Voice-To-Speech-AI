import { Inter } from 'next/font/google';
import 'regenerator-runtime/runtime';
import SpeechRecognition, {
	useSpeechRecognition,
} from 'react-speech-recognition';
import { useEffect, useRef, useState } from 'react';
import Chat from '@/components/Chat';
const inter = Inter({ subsets: ['latin'] });

export default function Home() {
	const [messages, setMessages] = useState([
		{ role: 'assistant', content: 'This is an Software Engineer Interview.' },
	]);

	const { finalTranscript, transcript, listening, resetTranscript } =
		useSpeechRecognition();

	const [input, setInput] = useState('');
	const [displayInput, setDisplayInput] = useState('');
	const [boolCon, setBoolContinueButton] = useState(false);
	const [doneSpeaking, setDoneSpeaking] = useState(false);

	useEffect(() => {
		if (displayInput == '') {
			setBoolContinueButton(true);
		} else {
			setBoolContinueButton(false);
		}

		setInput(transcript);
	}, [transcript, input, displayInput]);

	const handleInput = async () => {
		let newMessage = { role: 'user', content: displayInput };
		setMessages([...messages, newMessage]);
		handleReset();
		let sendToBackend = [...messages, newMessage].slice(1);
		// send to backend
		try {
			const response = await fetch('/api/AI', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					chat: sendToBackend,
				}),
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const data = await response.json();
			const aiMessage = data.result;
			setMessages([...messages, newMessage, aiMessage]);
			console.log(messages);
		} catch (error) {
			console.error('Error:', error);
		}
	};

	const handleReset = () => {
		resetTranscript();
		setDisplayInput('');
		setDoneSpeaking(false);
	};

	const sendStringToClean = async () => {
		try {
			const response = await fetch('/api/TranscriptionAI', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					text: input,
				}),
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const data = await response.json();
			setDisplayInput(data.result);
			console.log(input);
		} catch (error) {
			console.error('Error:', error);
		}
	};

	const handleStop = async () => {
		SpeechRecognition.stopListening();
		setDoneSpeaking(true);
		setDisplayInput('Loading');
		if (input != '') {
			setTimeout(sendStringToClean, 1500);
		} else {
			setDisplayInput('No User Speech Detected');
		}
	};

	return (
		<div className=" h-[100%] w-full">
			<div className=" py-10 px-10 md:px-[30%] flex flex-col items-start gap-4">
				<Chat
					listening={listening}
					userSpeechInput={displayInput}
					messages={messages}
				/>
				<div className="sticky mt-2 w-full bottom-0 pb-10 flex flex-col gap-4 bg-white shadow-[0px_-4px_10px_20px_rgba(255,255,255,1)]">
					<div className="flex flex-row items-center gap-4">
						{!doneSpeaking ? (
							<div className=" flex gap-1">
								{!listening ? (
									<button
										className=" bg-gray-200 px-2 py-1 rounded-md"
										onClick={() =>
											SpeechRecognition.startListening({ continuous: true })
										}>
										Start
									</button>
								) : (
									<button
										className=" bg-gray-200 px-2 py-1 rounded-md"
										onClick={handleStop}>
										Stop
									</button>
								)}
							</div>
						) : (
							<button
								className=" bg-gray-200 px-2 py-1 rounded-md"
								onClick={handleReset}>
								Reset
							</button>
						)}

						<p>Mic: {listening ? 'ON' : 'OFF'}</p>
					</div>
					<button
						disabled={boolCon}
						className=" w-40 border-2 rounded-md border-black shadow-lg px-2 py-1 disabled:bg-gray-100 disabled:text-gray-600"
						onClick={handleInput}>
						Continue
					</button>
				</div>
			</div>
		</div>
	);
}
