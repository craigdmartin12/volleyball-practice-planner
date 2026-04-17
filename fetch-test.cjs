const fs = require('fs');

const envFile = fs.readFileSync('.env', 'utf-8');
let URL = '';
let KEY = '';

envFile.split('\n').forEach(line => {
    if(line.startsWith('VITE_SUPABASE_URL=')) URL = line.split('=')[1].trim();
    if(line.startsWith('VITE_SUPABASE_ANON_KEY=')) KEY = line.split('=')[1].trim();
});

async function main() {
    console.log("Fetching drills...");
    const res = await fetch(`${URL}/rest/v1/drills?select=category&limit=50`, {
        headers: {
            'apikey': KEY,
            'Authorization': `Bearer ${KEY}`
        }
    });
    const data = await res.json();
    console.log("Drills categories output:", [...new Set(data.map(d => d.category))]);

    console.log("Trying to insert Warm-up...");
    const insertRes = await fetch(`${URL}/rest/v1/drills`, {
        method: 'POST',
        headers: {
            'apikey': KEY,
            'Authorization': `Bearer ${KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify({
            title: 'Test',
            description: 'Test',
            duration_minutes: 5,
            difficulty: 'Beginner',
            category: 'Warm Up',
            tags: []
        })
    });
    console.log("Insert result (Warm Up):", await insertRes.json());
    
    const insertRes2 = await fetch(`${URL}/rest/v1/drills`, {
        method: 'POST',
        headers: {
            'apikey': KEY,
            'Authorization': `Bearer ${KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify({
            title: 'Test',
            description: 'Test',
            duration_minutes: 5,
            difficulty: 'Beginner',
            category: 'Warm-up',
            tags: []
        })
    });
    console.log("Insert result (Warm-up):", await insertRes2.json());
}
main();
