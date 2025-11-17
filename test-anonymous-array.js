// Test anonymous array format (no key name)
const ToonParser = require('./parser.js');

console.log('=== Test: Anonymous array format ===');
const toonAnonymous = `[5]{postId,id,name,email,body}:
1,1,id labore ex et quam laborum,Eliseo@gardner.biz,"laudantium enim quasi est quidem magnam voluptate ipsam eos\\ntempora quo necessitatibus\\ndolor quam autem quasi\\nreiciendis et nam sapiente accusantium"
1,2,quo vero reiciendis velit similique earum,Jayne_Kuhic@sydney.com,"est natus enim nihil est dolore omnis voluptatem numquam\\net omnis occaecati quod ullam at\\nvoluptatem error expedita pariatur\\nnihil sint nostrum voluptatem reiciendis et"`;

try {
	const result = ToonParser.toonToJson(toonAnonymous);
	console.log(JSON.stringify(result, null, 2));
	console.log('\n✅ Success!');
} catch (e) {
	console.error('❌ Error:', e.message);
	console.error(e.stack);
}

console.log('\n=== Test: Single-line anonymous array ===');
const toonSingleAnonymous = `[2]{postId,id,name,email,body}:1,1,test name,test@email.com,"line1\\nline2"1,2,another,test2@email.com,"text, with comma"`;

try {
	const result2 = ToonParser.toonToJson(toonSingleAnonymous);
	console.log(JSON.stringify(result2, null, 2));
	console.log('\n✅ Success!');
} catch (e) {
	console.error('❌ Error:', e.message);
}
