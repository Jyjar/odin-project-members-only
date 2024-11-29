const pool = require("./pool");

async function getAllMessages() {
    const result = await pool.query(`
        SELECT 
            messages.id,
            messages.text,
            messages.timestamp,
            users.username
        FROM 
            messages
        JOIN 
            users 
        ON 
            messages.user_id = users.id
        ORDER BY 
            messages.timestamp DESC
    `);
    return result.rows;
}

async function insertUser(fullName, username, password, membershipStatus = true) {
    try {
        const result = await pool.query(
            `
            INSERT INTO users (full_name, username, password, membership_status)
            VALUES ($1, $2, $3, $4)
            RETURNING id
            `,
            [fullName, username, password, membershipStatus]
        );
        return result.rows[0].id; // Return the newly created user's ID
    } catch (error) {
        console.error("Error inserting user:", error);
        throw error;
    }
}

async function insertMessage(userId, title, text) {
    try {
        const result = await pool.query(
            `
            INSERT INTO messages (user_id, title, text)
            VALUES ($1, $2, $3)
            RETURNING id
            `,
            [userId, title, text]
        );
        return result.rows[0].id; // Return the newly created message's ID
    } catch (error) {
        console.error("Error inserting message:", error);
        throw error;
    }
}

module.exports = {
    getAllMessages,
    insertUser,
    insertMessage,
};
