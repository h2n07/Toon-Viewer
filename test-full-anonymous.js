// Test full anonymous array format (5 records)
const ToonParser = require('./parser.js');

console.log('=== Test: Full anonymous array (5 records) ===');
const toonFull = `[5]{postId,id,name,email,body}:1,1,id labore ex et quam laborum,Eliseo@gardner.biz,"laudantium enim quasi est quidem magnam voluptate ipsam eos\\ntempora quo necessitatibus\\ndolor quam autem quasi\\nreiciendis et nam sapiente accusantium"1,2,quo vero reiciendis velit similique earum,Jayne_Kuhic@sydney.com,"est natus enim nihil est dolore omnis voluptatem numquam\\net omnis occaecati quod ullam at\\nvoluptatem error expedita pariatur\\nnihil sint nostrum voluptatem reiciendis et"1,3,odio adipisci rerum aut animi,Nikita@garfield.biz,"quia molestiae reprehenderit quasi aspernatur\\naut expedita occaecati aliquam eveniet laudantium\\nomnis quibusdam delectus saepe quia accusamus maiores nam est\\ncum et ducimus et vero voluptates excepturi deleniti ratione"1,4,alias odio sit,Lew@alysha.tv,"non et atque\\noccaecati deserunt quas accusantium unde odit nobis qui voluptatem\\nquia voluptas consequuntur itaque dolor\\net qui rerum deleniti ut occaecati"1,5,vero eaque aliquid doloribus et culpa,Hayden@althea.biz,"harum non quasi et ratione\\ntempore iure ex voluptates in ratione\\nharum architecto fugit inventore cupiditate\\nvoluptates magni quo et"`;

try {
	const result = ToonParser.toonToJson(toonFull);
	console.log(JSON.stringify(result, null, 2));
	console.log('\n✅ Success! Parsed', result.length, 'items');

	// Verify structure
	console.log('\n=== Verification ===');
	console.log('Is array:', Array.isArray(result));
	console.log('First item keys:', Object.keys(result[0]));
	console.log(
		'First item body preview:',
		result[0].body.substring(0, 50) + '...'
	);
} catch (e) {
	console.error('❌ Error:', e.message);
	console.error(e.stack);
}
