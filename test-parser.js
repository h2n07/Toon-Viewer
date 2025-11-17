// Test parser with CSV format
const ToonParser = require('./parser.js');

console.log('=== Test 1: Simple CSV ===');
const toon1 = `users[2]{id,name,role}:
1,Alice,admin
2,Bob,user`;

const result1 = ToonParser.toonToJson(toon1);
console.log(JSON.stringify(result1, null, 2));

console.log('\n=== Test 2: CSV with quoted strings containing commas ===');
const toon2 = `comments[2]{postId,id,name,email,body}:
1,1,test name,test@email.com,"text with, comma and more"
1,2,another,test2@email.com,"another text, with commas, multiple"`;

const result2 = ToonParser.toonToJson(toon2);
console.log(JSON.stringify(result2, null, 2));

console.log('\n=== Test 3: CSV with newlines in quoted strings ===');
const toon3 = `comments[2]{postId,id,name,email,body}:
1,1,test name,test@email.com,"line1\\nline2\\nline3"
1,2,another,test2@email.com,"text with\\nnewlines"`;

const result3 = ToonParser.toonToJson(toon3);
console.log(JSON.stringify(result3, null, 2));
console.log('\nBody content with newlines:');
console.log(result3.comments[0].body);

console.log('\n=== Test 4: Single-line compact array ===');
const toon4 = `toon[3]{postId,id,name,email,body}:
1,1,test name,test@email.com,"line1\\nline2"
1,2,another,test2@email.com,"text, with comma"
1,3,third,test3@email.com,simple`;

const result4 = ToonParser.toonToJson(toon4);
console.log(JSON.stringify(result4, null, 2));

console.log('\n=== Test 5: Convert back to TOON ===');
const jsonData = {
	comments: [
		{
			postId: 1,
			id: 1,
			name: 'test name',
			email: 'test@email.com',
			body: 'line1\nline2\nline3',
		},
	],
};

const toonResult = ToonParser.jsonToToon(jsonData);
console.log(toonResult.join('\n'));
