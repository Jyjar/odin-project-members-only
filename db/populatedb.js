require('dotenv').config();
const { Client } = require("pg");

const SQL = `
-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    membership_status BOOLEAN NOT NULL DEFAULT false
);

-- Create Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    text TEXT NOT NULL
);

-- Insert Sample Users
INSERT INTO users (full_name, username, password, membership_status)
VALUES
    ('John Doe', 'john.doe@example.com', 'hashed_password1', true),
    ('Jane Smith', 'jane.smith@example.com', 'hashed_password2', false)
ON CONFLICT (username) DO NOTHING;

-- Insert Sample Messages
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM messages WHERE title = 'Welcome Message') THEN
        INSERT INTO messages (user_id, title, text)
        VALUES
            ((SELECT id FROM users WHERE username = 'john.doe@example.com'), 'Welcome Message', 'Hello, welcome to the members-only club!'),
            ((SELECT id FROM users WHERE username = 'jane.smith@example.com'), 'Hello World', 'Excited to join this awesome community!');
    END IF;
END $$;
`;

async function main() {
    console.log("Seeding the database...");

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });

    try {
        await client.connect();
        await client.query(SQL);
        console.log("Database seeded successfully!");
    } catch (error) {
        console.error("Error seeding the database:", error);
    } finally {
        await client.end();
    }
}

main();
