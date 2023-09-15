import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
	organization: 'org-i5ZJjyWAyhGgofxS14HjKmEZ',
	apiKey: process.env.OPENAI_API_KEY,
});
export const openai = new OpenAIApi(configuration);

export async function OpenAIRequest(prompt: string, temp: number) {
	const response = await openai.createCompletion({
		// model: 'text-curie-001',
		model: 'text-davinci-003',
		prompt: prompt,
		max_tokens: 2000,
		temperature: temp,
	});
	return response;
}
export async function OpenAIRequestCurie(prompt: string) {
	const response = await openai.createCompletion({
		// model: 'text-curie-001',
		model: 'text-curie-001',
		prompt: prompt,
		max_tokens: 1000,
		temperature: 0.5,
	});
	return response;
}
export async function OpenAIChatRequest(prompt: any, temperature: number) {
	const response = await openai.createChatCompletion({
		model: 'gpt-3.5-turbo',
		messages: prompt,
		max_tokens: 2000,
		temperature: temperature,
	});
	return response;
}
