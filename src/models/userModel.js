import pool from '../config/db.js';
import bcrypt from "bcrypt";

export const createUserAndProfileService = async ({ username, password, role, name, phone, driverLicense }) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);

    const insertUserText = `
      INSERT INTO users (username, password, role)
      VALUES ($1, $2, $3)
      RETURNING userid, username, role, created_at
    `;
    const userRes = await client.query(insertUserText, [username, hashed, role]);
    const user = userRes.rows[0];

    let profile = null;
    if (role === "customer") {
      const insertCustomerText = `
        INSERT INTO customers (customername, customerphone, driverlicense, created_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING customerid, customername, customerphone, driverlicense, created_at
      `;
      const custRes = await client.query(insertCustomerText, [name, phone, driverLicense]);
      profile = custRes.rows[0];
    } else if (role === "staff") {
      const insertStaffText = `
        INSERT INTO staff (staffname, staffphone, created_at)
        VALUES ($1, $2, NOW())
        RETURNING staffid, staffname, staffphone, created_at
      `;
      const staffRes = await client.query(insertStaffText, [name, phone]);
      profile = staffRes.rows[0];
    }
    await client.query("COMMIT");
    return { user, profile };
  } catch (err) {
    try {
      await client.query("ROLLBACK");
    } catch (rbErr) {
      console.error("Rollback error:", rbErr);
    }
    throw err;
  } finally {
    client.release();
  }
};

export const getAllUsersService = async () => {
    const result = await pool.query('SELECT * FROM users')
    return result.rows;
}

export const getUserByIdService = async (id) => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1'   , [id]);
    return result.rows[0];
}
export const updateUserService = async (id, name, email) => {
    const result = await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
    [name, email, id]);
    return result.rows[0];
}
export const deleteUserService = async (id) => {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
}