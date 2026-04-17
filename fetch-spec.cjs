const fs = require('fs');

const envFile = fs.readFileSync('.env', 'utf-8');
let URL = '';
let KEY = '';

envFile.split('\n').forEach(line => {
    if(line.startsWith('VITE_SUPABASE_URL=')) URL = line.split('=')[1].trim();
    if(line.startsWith('VITE_SUPABASE_ANON_KEY=')) KEY = line.split('=')[1].trim();
});

async function main() {
    console.log("Fetching OpenAPI spec...");
    const res = await fetch(`${URL}/rest/v1/?apikey=${KEY}`);
    const data = await res.json();
    
    if (data && data.definitions && data.definitions.drills) {
        console.log("Drills category enum values:");
        console.log(data.definitions.drills.properties.category.enum);
    } else {
        console.log(JSON.stringify(data.definitions, null, 2));
    }
}
main();
