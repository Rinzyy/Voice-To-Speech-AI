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
			content: `Detect and correct nonsensical English words in a given transcript. If a word is recognized as an English word, but makes no sense in the sentence, suggest a possible correction based on the context of the sentence.`,
		},
		{
			role: 'user',
			content: `Text: "I'm berry close with my famine, even though we live far apart. My parents and sapling live in the U.S, so we don't get to see each other berry often. But we make shore to stay in touch through phone calls, emails, and video chats. I rarely value their support and encouragement, especially when I'm facing challenges."`,
		},
		{
			role: 'assistant',
			content: `"I'm very close with my family, even though we live far apart. My parents and siblings live in the US, so we don't get to see each other very often. But we make sure to stay in touch through phone calls, emails, and video chats. I really value their support and encouragement, especially when I'm facing challenges."`,
		},
		{
			role: 'user',
			content: `Text: "${req.body.text}"`,
		},
	];
	let response = await OpenAIChatRequest(message, 0.7);
	let cleanOutput = response.data.choices[0].message?.content as string;
	let finalOutput = removeQuotesFromString(cleanOutput);

	let token = response.data.usage?.total_tokens; //get token

	res.status(200).json({ result: finalOutput });
}
