import pkg from 'pg';
const { Client } = pkg;
const client = new Client({connectionString: 'postgresql://postgres.wtasxmqhjsnbnsivjxnb:manishagunjal184@aws-1-us-west-2.pooler.supabase.com:5432/postgres'});

async function run() {
  await client.connect();
  const query = `
    CREATE POLICY "Users can insert conversations" ON conversations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    CREATE POLICY "Users can update conversations" ON conversations FOR UPDATE USING (auth.role() = 'authenticated');
    ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Participants viewable by authenticated users" ON conversation_participants FOR SELECT USING (auth.role() = 'authenticated');
    CREATE POLICY "Users can insert participants" ON conversation_participants FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  `;
  try {
    await client.query(query);
    console.log('Policies added');
  } catch (e) {
    if (e.code === '42710') { // policy already exists but we know it doesnt for conversations
      console.log('Policy exist, ignoring');
    } else {
      console.error(e);
    }
  }
  await client.end();
}
run().catch(console.error);
