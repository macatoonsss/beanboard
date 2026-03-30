import pkg from 'pg';
const { Client } = pkg;

async function run() {
  const client = new Client({
    connectionString: 'postgresql://postgres:allanamacatuno@db.pilfqkltuxezzsgeiukf.supabase.co:5432/postgres'
  });

  await client.connect();

  const res = await client.query('SELECT * FROM _users');
  console.log(res.rows);

  await client.end();
}

run();