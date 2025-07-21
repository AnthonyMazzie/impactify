import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import fs from 'node:fs';
import path from 'node:path';
import clipboardy from 'clipboardy';
import { type AcronymEntry, type ImpactAnswers } from './types.js';

const acronymsPath = path.join(process.cwd(), 'src', 'acronyms.json');

let acronymEntries: AcronymEntry[] = [];

try {
	const raw = fs.readFileSync(acronymsPath, 'utf8');
	acronymEntries = JSON.parse(raw) as AcronymEntry[];
} catch (error) {
	console.error('❌ Failed to load acronyms.json:', error);
	process.exit(1);
}

// function toSentenceCasePreservingAcronyms(text: string): string {
// 	if (!text) {
// 		return text;
// 	}

// 	const acronymMap = new Map(
// 		acronymEntries.map(entry => [entry.acronym.toLowerCase(), entry.acronym]),
// 	);

// 	const words = text.trim().split(/\s+/);

// 	return words
// 		.map((word, index) => {
// 			if (/^(`.*`|".*"|'.*')$/.test(word)) {
// 				return word;
// 			}

// 			const match = /^(.+?)([.,!?;:]*)$/.exec(word);
// 			if (!match) {
// 				return word;
// 			}

// 			const [_, rawWord, punctuation = ''] = match;
// 			const lower = rawWord.toLowerCase();
// 			const canonical = acronymMap.get(lower);

// 			if (canonical) {
// 				return canonical + punctuation;
// 			}

// 			if (index === 0) {
// 				return capitalize(rawWord) + punctuation;
// 			}

// 			return rawWord.toLowerCase() + punctuation;
// 		})
// 		.join(' ');
// }

function toSentenceCasePreservingAcronyms(text: string): string {
	if (!text) {
		return text;
	}

	const acronymMap = new Map(
		acronymEntries.map(entry => [entry.acronym.toLowerCase(), entry.acronym]),
	);

	const words = text.trim().split(/\s+/);

	return words
		.map((word, index) => {
			// Handle quoted or inline code to preserve formatting
			if (/^(`.*`|".*"|'.*')$/.test(word)) {
				return word;
			}

			const match = /^(.+?)([.,!?;:]*)$/.exec(word);
			if (!match) {
				return word;
			}

			const [_, rawWord, punctuation = ''] = match;
			const lower = rawWord.toLowerCase();
			const canonical = acronymMap.get(lower);

			// If the word is an acronym, return it with the correct case (preserve the acronym case)
			if (canonical) {
				return canonical + punctuation;
			}

			// Capitalize the first word in the sentence
			if (index === 0) {
				return capitalize(rawWord) + punctuation;
			}

			return rawWord.toLowerCase() + punctuation;
		})
		.join(' ');
}


function capitalize(word: string): string {
	return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function lowercasePreservingAcronyms(text: string): string {
	const acronymMap = new Map(
		acronymEntries.map(entry => [entry.acronym.toLowerCase(), entry.acronym]),
	);

	return text
		.split(/\s+/)
		.map(word => {
			const match = /^(.+?)([.,!?;:]*)$/.exec(word);
			if (!match) {
				return word;
			}

			const [_, rawWord, punctuation = ''] = match;
			const lower = rawWord.toLowerCase();
			const canonical = acronymMap.get(lower);

			if (canonical) {
				return canonical + punctuation;
			}

			return lower + punctuation;
		})
		.join(' ');
}

function normalizeWhitespace(text: string): string {
	return text.replaceAll(/\s+/g, ' ').trim();
}

// Utility function to validate input length
function validateFieldLength(field: string, maxLength: number): string {
	if (field.length > maxLength) {
		return `This field exceeds the maximum length of ${maxLength} characters. Please reformat it.`;
	}
	return '';
}

function generateImpactStatement(answers: ImpactAnswers): string {
	// Define maximum length for each field
	const maxLengths = {
		action: 125,
		businessImpact: 125,
		specificImpact: 125,
		goalAlignmentAndFinancials: 150,
	};

	// Validate length for each field
	const actionError = validateFieldLength(answers.action, maxLengths.action);
	const businessImpactError = validateFieldLength(answers.businessImpact, maxLengths.businessImpact);
	const specificImpactError = validateFieldLength(answers.specificImpact, maxLengths.specificImpact);
	const goalAlignmentError = validateFieldLength(answers.goalAlignmentAndFinancials, maxLengths.goalAlignmentAndFinancials);

	// If any field exceeds max length, return an error message
	if (actionError || businessImpactError || specificImpactError || goalAlignmentError) {
		return 'One or more fields exceed the maximum allowed length. Please reformat them.';
	}

	// Normalize the fields by trimming excess whitespace
	const action = toSentenceCasePreservingAcronyms(normalizeWhitespace(answers.action));
	const businessImpact = normalizeWhitespace(answers.businessImpact);
	const specificImpact = normalizeWhitespace(answers.specificImpact);
	const goalAlignmentAndFinancials = normalizeWhitespace(answers.goalAlignmentAndFinancials);

	// Check if all required fields are empty
	const requiredFieldsEmpty = !action || !businessImpact || !specificImpact;

	if (requiredFieldsEmpty) {
		// Construct message for missing fields
		return 'One or more required fields are missing or empty. Please provide values for all required fields.';
	}

	// Format specificImpact to start with a verb if applicable
	const startsWithVerb = /^(increases|reduces|decreases|improves|lowers|cuts|saves|boosts|prevents|eliminates|fixes)/i.test(specificImpact);
	// const specificImpactFormatted = startsWithVerb ? specificImpact : `resulting in ${specificImpact.toLowerCase()}`;
	// Capitalize the first letter of specificImpact if it doesn't start with a verb
	const specificImpactFormatted = startsWithVerb
		? specificImpact
		: `resulting in ${specificImpact.charAt(0).toLowerCase() + specificImpact.slice(1)}`;

	// Prepare parts of the statement
	const parts = [];

	// Properly format the action to capitalize the first letter
	if (action) {
		parts.push(action.charAt(0).toUpperCase() + action.slice(1));
	}

	// Use a function to preserve the case of acronyms in businessImpact
	if (businessImpact) {
		parts.push(`which ${lowercasePreservingAcronyms(businessImpact)}`);
	}

	// Handle specificImpact correctly
	if (specificImpact) {
		parts.push(specificImpactFormatted);
	}

	// Add goal alignment phrase if present, otherwise provide default message
	const alignmentPhrase = goalAlignmentAndFinancials
		? `This aligned with ${goalAlignmentAndFinancials}.`
		: 'No specific alignment provided.';

	// Combine all parts with a comma between them
	let sentence = parts.join(', ').trim();

	// Remove the last comma and add period before alignment phrase
	if (sentence.endsWith(',')) {
		sentence = sentence.slice(0, -1); // Remove the trailing comma
	}

	// Add the alignment phrase and ensure proper punctuation
	sentence += `. ${alignmentPhrase}`;

	// Ensure no extra punctuation after sentence completion
	if (sentence.endsWith('..')) {
		sentence = sentence.slice(0, -1); // Remove extra period
	}

	return sentence;
}



function saveToMarkdown(filename: string, content: string) {
	const filePath = path.join(process.cwd(), `${filename}.md`);
	fs.writeFileSync(filePath, `# Impact Statement\n\n${content}\n`);
	console.log(`✔ Saved to: ${filePath}`);
}

function saveToJson(
	filename: string,
	answers: ImpactAnswers,
	fullStatement: string,
) {
	const filePath = path.join(process.cwd(), `${filename}.json`);
	const output = { ...answers, impactStatement: fullStatement };
	fs.writeFileSync(filePath, JSON.stringify(output, null, 2));
	console.log(`✔ Saved to: ${filePath}`);
}

async function prompt(question: string, required = true): Promise<string> {
	const rl = readline.createInterface({ input, output });
	const answer = await rl.question(`${question} `);
	rl.close();
	return required && !answer.trim() ? prompt(question, required) : answer.trim();
}

async function main() {
	console.log(
		'\n🛠️  Impactify – Engineer Impact Statement Generator (5-Layer Version)\n',
	);

	const answers: ImpactAnswers = {
		project: await prompt('What is the name of the project or feature? (optional)', false),
		action: await prompt('What exactly did you do or build?'),
		businessImpact: await prompt('How did this help the business or product?'),
		specificImpact: await prompt('What measurable change did it produce?'),
		goalAlignmentAndFinancials: await prompt(
			'What goal or financial impact was this tied to? (e.g., "OKR 1.5, saved $10,000")',
			false,
		),
	};

	const statement = generateImpactStatement(answers);

	console.log('\n✅ Final Impact Statement:\n');
	console.log(statement);

	const filename = answers.project?.toLowerCase().replaceAll(/\s+/g, '-') ?? 'impact-statement';

	const exportChoice = await prompt(
		'\nExport options:\n[1] Copy to clipboard\n[2] Save to markdown\n[3] Save to JSON\n[4] No export\nChoose 1-4:',
	);

	switch (exportChoice) {
		case '1': {
			clipboardy.writeSync(statement);
			console.log('✔ Copied to clipboard!');
			break;
		}

		case '2': {
			saveToMarkdown(filename, statement);
			break;
		}

		case '3': {
			saveToJson(filename, answers, statement);
			break;
		}

		default: {
			console.log('No export selected.');
		}
	}
}

if (process.env.VITEST !== 'true') {
	await main();
}

export { generateImpactStatement };
