export function highlightDifferentWord(
	finalOutput: string,
	originalText: string
): string {
	const finalOutputWords = finalOutput.split(' ');
	const originalTextWords = originalText.split(' ');
	const highlightedWords: string[] = [];

	for (let i = 0; i < originalTextWords.length; i++) {
		if (originalTextWords[i] !== finalOutputWords[i]) {
			highlightedWords.push(`<div>${originalTextWords[i]}</div>`);
		} else {
			highlightedWords.push(originalTextWords[i]);
		}
	}

	return highlightedWords.join(' ');
}
