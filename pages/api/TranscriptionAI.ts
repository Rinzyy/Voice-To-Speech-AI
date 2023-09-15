// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { OpenAIChatRequest } from '@/lib/OpenAIAPI';
import { removeQuotesFromString } from '@/lib/StringManipulation';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
	result: string;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	// cheap and fast way but too slow and many error
	let incomingMessage = req.body.text;

	console.log(incomingMessage);
	let message = [
		{
			role: 'system',
			content: `You are a Transcriber. Your job is to only add punctuation at the end of each sentence in the following conversation, without changing any words.`,
		},
		{
			role: 'user',
			content: `Text: "${req.body.text}"`,
		},
	];
	let response = await OpenAIChatRequest(message, 0);
	let cleanOutput = response.data.choices[0].message?.content as string;
	let finalOutput = removeQuotesFromString(cleanOutput);

	let token = response.data.usage?.total_tokens; //get token

	res.status(200).json({ result: finalOutput });
}
