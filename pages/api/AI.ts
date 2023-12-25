// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { OpenAIChatRequest } from '@/lib/OpenAIAPI';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
	result: {
		content: string;
		role: string;
	};
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	// cheap and fast way but too slow and many error
	let incomingMessage = req.body.chat;

	console.log(incomingMessage);
	let message = [
		{
			role: 'system',
			content: `You are an AI Software Engineer Interviewer named Mike. You will interview the user one question at a time. You will ask the same amount of question in the full speaking test.  `,
		},

		...incomingMessage.map((msg: any) => ({
			role: msg.role,
			content: msg.content,
		})),
	];
	let response = await OpenAIChatRequest(message, 0);
	let cleanOutput = response.data.choices[0].message?.content as string;

	const newMessage = {
		role: 'assistant',
		content: cleanOutput,
	};
	message.push(newMessage);

	console.log(message);
	let token = response.data.usage?.total_tokens; //get token

	res.status(200).json({ result: newMessage });
}
