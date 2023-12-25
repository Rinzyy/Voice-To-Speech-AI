// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { OpenAIChatRequest } from '@/lib/OpenAIAPI';
import type { NextApiRequest, NextApiResponse } from 'next';

// Define the response data type
type Data = {
	result: IMessages;
};

// Define the message object interface
interface IMessage {
	role: 'user' | 'assistant';
	content: string;
}

// Define the messages object interface
interface IMessages {
	messages: IMessage[];
}

// Split the message array into conversation pairs
function splitIntoPairs(messages: IMessage[]): IMessage[][] {
	const pairs: IMessage[][] = [];

	for (let i = 0; i < messages.length; i += 2) {
		const pair: IMessage[] = [];

		for (let j = i; j < i + 2 && j < messages.length; j += 1) {
			pair.push(messages[j]);
		}

		pairs.push(pair);
	}

	return pairs;
}

// Handle the incoming request
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	// Extract the incoming message object from the request body
	let incomingMessage = req.body.chat;

	// Split the incoming message array into conversation pairs
	let batches = splitIntoPairs(incomingMessage);

	// Construct an array of message arrays for each conversation pair
	const messagesArray = batches.map(batch => [
		{
			role: 'system',
			content: `You are an AI IELTS Interviewer named Sorsay. You will rephrase use response with 9.0 ielts rating response. `,
		},
		{
			role: 'user',
			content: `Based on this question ${batch[0].content} the user response with ${batch[1].content}`,
		},
	]);

	// Send all the message arrays to OpenAI API at once and get all the responses
	const responses = await Promise.all(
		messagesArray.map(message => OpenAIChatRequest(message, 0))
	);

	// Extract the clean output message from each response and update the conversation pairs
	for (let i = 0; i < batches.length; i++) {
		const cleanOutput = responses[i].data.choices[0].message?.content as string;
		batches[i][1].content = cleanOutput;
	}

	// // Get the token usage from the response
	// let token = response.data.usage?.total_tokens;

	// Flatten the batches into a single array of messages
	const outgoingMessage: IMessages = {
		messages: batches.flat(),
	};

	// Send the outgoing message array as the response
	res.status(200).json({ result: outgoingMessage });
}
