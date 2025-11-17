// Analyze the TOON format structure
const input = `toon[5]{postId,id,name,email,body}:1,1,id labore ex et quam laborum,Eliseo@gardner.biz,"laudantium enim quasi est quidem magnam voluptate ipsam eos\\ntempora quo necessitatibus\\ndolor quam autem quasi\\nreiciendis et nam sapiente accusantium"1,2,quo vero reiciendis velit similique earum,Jayne_Kuhic@sydney.com,"est natus enim nihil est dolore omnis voluptatem numquam\\net omnis occaecati quod ullam at\\nvoluptatem error expedita pariatur\\nnihil sint nostrum voluptatem reiciendis et"`;

console.log('Input length:', input.length);
console.log('\nLooking for pattern after quoted strings:');

// Find all quoted strings
const regex = /"[^"\\]*(?:\\.[^"\\]*)*"/g;
let match;
let lastIndex = 0;

while ((match = regex.exec(input)) !== null) {
	const quotedString = match[0];
	const endIndex = match.index + quotedString.length;
	const next10Chars = input.substring(endIndex, endIndex + 10);

	console.log('\nQuoted string ends at index', endIndex);
	console.log('Next 10 chars:', JSON.stringify(next10Chars));
	console.log(
		'Pattern:',
		next10Chars.match(/^(\d+),(\d+),/) ? 'NEW RECORD!' : 'continues...'
	);
}

console.log('\n\n=== Expected format ===');
console.log('Each record should be: postId,id,name,email,body');
console.log('5 fields per record');
console.log(
	'After closing quote of body field, next char should be digit (start of next postId)'
);
