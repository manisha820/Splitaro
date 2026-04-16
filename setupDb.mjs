import pkg from 'pg';
const { Client } = pkg;

const connectionString = 'postgresql://postgres.wtasxmqhjsnbnsivjxnb:manishagunjal184@aws-1-us-west-2.pooler.supabase.com:5432/postgres';

const client = new Client({
  connectionString,
});

async function setup() {
  await client.connect();
  console.log('Connected to DB');
  
  const query = `
    CREATE TABLE IF NOT EXISTS shipments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES auth.users NOT NULL,
      orderNumber TEXT NOT NULL,
      origin TEXT NOT NULL,
      destination TEXT NOT NULL,
      weight TEXT NOT NULL,
      status TEXT NOT NULL,
      progress INT NOT NULL,
      type TEXT NOT NULL,
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'shipments' AND policyname = 'Users can select their own shipments'
      ) THEN
        CREATE POLICY "Users can select their own shipments" ON shipments FOR SELECT USING (auth.uid() = user_id);
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'shipments' AND policyname = 'Users can insert their own shipments'
      ) THEN
        CREATE POLICY "Users can insert their own shipments" ON shipments FOR INSERT WITH CHECK (auth.uid() = user_id);
      END IF;
      
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'shipments' AND policyname = 'Users can update their own shipments'
      ) THEN
        CREATE POLICY "Users can update their own shipments" ON shipments FOR UPDATE USING (auth.uid() = user_id);
      END IF;
    END $$;
  `;

  await client.query(query);
  console.log('Schema created successfully');
  await client.end();
}

setup().catch(console.error);
