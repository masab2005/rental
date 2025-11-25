import pool from "../config/db.js";
import { deletePaymentService } from "./paymentModel.js";
export const createRentalService = async ({
  customerId,
  userId,
  staffId = null,
  carId,
  paymentId,
  startDate,
  endDate,
  totalAmount,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const carRes = await client.query(
      `SELECT carId, carStatus FROM cars WHERE carId = $1 FOR UPDATE`,
      [carId]
    );
    if (carRes.rows.length === 0) {
      throw new Error("Car not found");
    }

    const overlapRes = await client.query(
      `SELECT 1 FROM rentals 
       WHERE carId = $1 
         AND status IN ('requested', 'active')
         AND NOT (endDate < $2 OR startDate > $3)
       LIMIT 1`,
      [carId, startDate, endDate]
    );
    if (overlapRes.rows.length > 0) {
      throw new Error("Car is already booked for the selected dates");
    }

    // 3) Update car status to 'requested'
    await client.query(
      `UPDATE cars SET carStatus = 'requested' WHERE carId = $1`,
      [carId]
    );

    // 4) Insert rental
    const insertQuery = `
      INSERT INTO rentals
        (customerId, userId, staffId, carId, paymentId, startDate, endDate, totalAmount)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *;
    `;
    const values = [
      customerId,
      userId,
      staffId,
      carId,
      paymentId,
      startDate,
      endDate,
      totalAmount,
    ];

    const { rows } = await client.query(insertQuery, values);

    await client.query("COMMIT");
    return rows[0];
  } catch (err) {
    let rollbackError;
    try {
      await client.query("ROLLBACK");
    } catch (rbErr) {
      rollbackError = rbErr;
      console.error("Rollback failed in createRentalService:", rbErr);
    }

    // Perform compensation (payment reversal)
    if (paymentId) {
      try {
        await deletePaymentService(paymentId);
      } catch (compErr) {
        console.error("Payment cleanup failed in createRentalService:", compErr)
      }
    }
    throw err;
  } finally {
    client.release();
  }
};

export const getRequestedRentalsService = async () => {
  const { rows } = await pool.query(
    `
      SELECT r.bookingId,
             r.carId,
             c.carModel,
             c.carYear,
             c.carImageUrl,
             r.startDate,
             r.endDate,
             r.totalAmount,
             r.paymentId,
             r.staffId,
             r.status,
             u.username AS customerUsername,
             cu.customerName,
             cu.customerPhone,
             cu.driverLicense
      FROM rentals r
      JOIN cars c ON r.carId = c.carId
      JOIN customers cu ON r.customerId = cu.customerId
      JOIN users u ON cu.userId = u.userId
      WHERE r.status = 'requested'
      ORDER BY r.startDate ASC
    `
  );

  return rows;
};

export const approveRentalService = async ({ bookingId, userId }) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    //get staffId from userId
    const { rows: staffRows } = await client.query(
      `SELECT staffId FROM staff WHERE userId = $1`,
      [userId]
    );
    if(staffRows.length === 0) {
      throw new Error("Staff not found");
    }
    const staffId = staffRows[0].staffid;
    // 1) Get rental data (without locking yet) to obtain carId
    const rentalRes = await client.query(
      `SELECT carId, status FROM rentals WHERE bookingId = $1`,
      [bookingId]
    );
    if (rentalRes.rows.length === 0) {
      throw new Error("Rental not found");
    }
    const { carid, status } = rentalRes.rows[0];
    // 2) Lock car first
    await client.query(`SELECT carId FROM cars WHERE carId = $1 FOR UPDATE`, [carid]);
    const activeCheck = await client.query(
      `SELECT 1 FROM rentals WHERE carId = $1 AND status = 'active' LIMIT 1`,
      [carid]
    );
    if (activeCheck.rows.length > 0) {
      throw new Error("Car already has an active rental");
    }
    // 3) Then lock rental
    await client.query(`SELECT bookingId FROM rentals WHERE bookingId = $1 FOR UPDATE`, [bookingId]);

    // 5) Validate status after locks
    if (status !== "requested") {
      throw new Error("Rental is not in requested status");
    }

    // 6) Update car status to 'rented'
    await client.query(
      `UPDATE cars SET carStatus = 'rented' WHERE carId = $1`,
      [carid]
    );

    await client.query(
      `UPDATE rentals SET staffId = $1, status = 'active' WHERE bookingId = $2`,
      [staffId, bookingId]
    );

    await client.query("COMMIT");
    return { bookingId, carid, staffId, status: "active" };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const getRentedCarsByUserService = async (userId) => {
  const { rows } = await pool.query(
    `
    SELECT
      r.bookingId,
      r.userId,
      r.customerId,
      r.carId,
      c.carModel,
      c.carImageUrl,
      c.carYear,
      r.startDate,
      r.endDate,
      r.totalAmount,
      r.paymentId,
      r.status
    FROM rentals r
    JOIN cars c ON r.carId = c.carId
    WHERE r.userId = $1
      AND r.status = 'active'
    ORDER BY r.startDate DESC;
    `,
    [userId]
  );

  return rows;
};

export const getRequestedRentalsByUserService = async (userId) => {
  const { rows } = await pool.query(
    `
    SELECT
  r.bookingid,
  r.carid,
  c.carmodel,
  c.caryear,
  c.carimageurl,
  r.startdate,
  r.enddate,
  r.totalamount,
  r.paymentid,
  r.status,
  cu.customername,
  cu.driverlicense
FROM rentals r
JOIN cars c ON r.carid = c.carid
JOIN customers cu ON r.customerid = cu.customerid
WHERE r.userid = $1
  AND r.status = 'requested'
ORDER BY r.startdate ASC;
    `,
    [userId]
  );

  return rows;
};

export const endRentalService = async (bookingId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const rentalRes = await client.query(
      `SELECT bookingId, carId, status FROM rentals WHERE bookingId = $1`,
      [bookingId]
    );
    if (rentalRes.rows.length === 0) {
      throw new Error("Rental not found");
    }
    const { bookingid, carid, status } = rentalRes.rows[0];

    await client.query(`SELECT carId FROM cars WHERE carId = $1 FOR UPDATE`, [carid]);
    await client.query(`SELECT bookingId FROM rentals WHERE bookingId = $1 FOR UPDATE`, [bookingId]);

    if (status !== "active") {
      throw new Error("Rental is not currently active");
    }

    await client.query(
      `UPDATE cars SET carstatus = 'available' WHERE carid = $1`,
      [carid]
    );

    // 5) Mark rental as completed
    await client.query(
      `UPDATE rentals SET status = 'completed', startdate = NULL, enddate = NULL WHERE bookingid = $1`,
      [bookingid]
    );

    await client.query("COMMIT");
    return { bookingid, carid, status: "completed" };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const declineRentalService = async (bookingId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const rentalRes = await client.query(
      `SELECT carId, status, paymentId FROM rentals WHERE bookingId = $1`,
      [bookingId]
    );
    if (rentalRes.rows.length === 0) {
      throw new Error("Rental not found");
    }
    const { carid, status, paymentid } = rentalRes.rows[0];

    await client.query(`SELECT carId FROM cars WHERE carId = $1 FOR UPDATE`, [carid]);
    await client.query(`SELECT bookingId FROM rentals WHERE bookingId = $1 FOR UPDATE`, [bookingId]);

  
    if (status !== "requested") {
      throw new Error("Rental is not in requested status");
    }

    await client.query(
      `UPDATE cars SET carStatus = 'available' WHERE carId = $1`,
      [carid]
    );

    // 5) Delete the associated payment (reverse payment)
    await client.query(`DELETE FROM payments WHERE paymentId = $1`, [paymentid]);

    // 6) Mark rental as declined
    await client.query(
      `UPDATE rentals SET status = 'declined', updated_at = NOW() WHERE bookingId = $1`,
      [bookingId]
    );

    await client.query("COMMIT");
    return {
      bookingId,
      carid,
      paymentid,
      status: "declined",
      message: "Rental declined successfully. Your payment has been reversed.",
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};
