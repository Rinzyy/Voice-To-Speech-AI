export function removeQuotesFromString(str: string): string {
	const regex = /^"|"\s*|\s*"$|/g;
	return str.replace(regex, '');
}
