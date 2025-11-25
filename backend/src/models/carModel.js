import pool from '../config/db.js';
import { getAllCars } from '../controllers/carController.js';

export const uploadCarService = async ({ carModel, carYear, carStatus, carPrice, maintenanceId, carImageUrl }) => {
    const result = await pool.query(`
        INSERT INTO cars (carModel, carYear, carStatus, carPrice, maintenanceId, carImageUrl, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        RETURNING *
    `, [carModel, carYear, carStatus, carPrice, maintenanceId, carImageUrl]);
    return result.rows[0];
}

export const getAllCarsService = async () => {
    const result = await pool.query(`
        SELECT 
            c.carId, 
            c.carModel, 
            c.carYear, 
            c.carStatus, 
            c.carPrice, 
            c.maintenanceId, 
            c.carImageUrl, 
            c.created_at, 
            (SELECT r.bookingId FROM rentals r 
             WHERE r.carId = c.carId AND r.status = 'active' 
             LIMIT 1) as bookingId
        FROM cars c
    `);
    return result.rows;
}

export const getCarByIdService = async (id) => {
  const result = await pool.query(`
    SELECT 
      carId,    
      carModel,   
      carYear,     
      carStatus,   
      carPrice,   
      maintenanceId,
      carImageUrl,
      created_at  
    FROM cars
    WHERE carId = $1
  `, [id]);
  return result.rows[0];
};
// services/carService.js
export const updateCarByIDService = async (carId, carData) => {
    const { carModel, carYear, carStatus, carPrice, maintenanceId, carImageUrl } = carData;
    
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const carLock = await client.query(
            `SELECT carId FROM cars WHERE carId = $1 FOR UPDATE`,
            [carId]
        );
        if (carLock.rows.length === 0) {
            throw new Error("Car not found");
        }
        // 2) Check for active or requested rentals
        const rentalCheck = await client.query(`
            SELECT 1 FROM rentals WHERE carId = $1 AND status IN ('requested', 'active') LIMIT 1
        `, [carId]);
        
        if (rentalCheck.rows.length > 0) {
            throw new Error("Cannot update car while it has active or pending rental bookings");
        }

        // 3) Perform update
        const result = await client.query(`
            UPDATE cars
            SET carModel = $1,
                carYear = $2,
                carStatus = $3,
                carPrice = $4,
                maintenanceId = $5,
                carImageUrl = $6
            WHERE carId = $7
            RETURNING carId, carModel, carYear, carStatus, carPrice, maintenanceId, carImageUrl, created_at
        `, [carModel, carYear, carStatus, carPrice, maintenanceId, carImageUrl, carId]);

        await client.query('COMMIT');
        return result.rows[0];
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

// services/carService.js
export const deleteCarByIDService = async (carId) => {
    const result = await pool.query(`
        DELETE FROM cars
        WHERE carId = $1
        RETURNING carId, carModel, carYear, carStatus, carPrice, maintenanceId, carImageUrl, created_at
    `, [carId]);

    return result.rows[0]; 
};

export const searchCarsService = async ({
  model,
  year,
  yearMin,
  yearMax,
  status,
  priceMin,
  priceMax,
  sort,
  page = 1,
  limit = 20
}) => {
  let query = `SELECT carId, carModel, carYear, carStatus, carPrice, maintenanceId, carImageUrl, created_at FROM cars WHERE carStatus = 'available'`;
  const params = [];
  let paramIndex = 1;

  // Model filter (partial match, case-insensitive)
  if (model) {
    query += ` AND LOWER(carModel) LIKE LOWER($${paramIndex})`;
    params.push(`%${model}%`);
    paramIndex++;
  }

  // Year filter (exact match)
  if (year) {
    query += ` AND carYear = $${paramIndex}`;
    params.push(Number(year));
    paramIndex++;
  }

  // Year range filter
  if (yearMin) {
    query += ` AND carYear >= $${paramIndex}`;
    params.push(Number(yearMin));
    paramIndex++;
  }
  if (yearMax) {
    query += ` AND carYear <= $${paramIndex}`;
    params.push(Number(yearMax));
    paramIndex++;
  }

  // Status filter (exact match)
  if (status) {
    const allowedStatuses = ['available', 'requested', 'rented', 'maintenance'];
    if (!allowedStatuses.includes(status)) {
      throw new Error(`Invalid status. Allowed values: ${allowedStatuses.join(', ')}`);
    }
    query += ` AND carStatus = $${paramIndex}`;
    params.push(status);
    paramIndex++;
  }

  // Price range filter
  if (priceMin) {
    query += ` AND carPrice >= $${paramIndex}`;
    params.push(Number(priceMin));
    paramIndex++;
  }
  if (priceMax) {
    query += ` AND carPrice <= $${paramIndex}`;
    params.push(Number(priceMax));
    paramIndex++;
  }

  // Sorting
  const sortMap = {
    'price_asc': 'carPrice ASC',
    'price_desc': 'carPrice DESC',
    'year_asc': 'carYear ASC',
    'year_desc': 'carYear DESC',
    'model_asc': 'carModel ASC',
    'model_desc': 'carModel DESC'
  };

  if (sort && sortMap[sort]) {
    query += ` ORDER BY ${sortMap[sort]}`;
  } else if (sort) {
    throw new Error(`Invalid sort parameter. Allowed values: ${Object.keys(sortMap).join(', ')}`);
  } else {
    query += ` ORDER BY carId ASC`; // default sort
  }

  // Pagination
  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.max(1, Math.min(100, Number(limit) || 20)); // max 100 per page
  const offset = (pageNum - 1) * limitNum;

  query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limitNum, offset);

  // Get total count
  let countQuery = `SELECT COUNT(*) as total FROM cars WHERE 1=1`;
  const countParams = [];
  let countParamIndex = 1;

  if (model) {
    countQuery += ` AND LOWER(carModel) LIKE LOWER($${countParamIndex})`;
    countParams.push(`%${model}%`);
    countParamIndex++;
  }
  if (year) {
    countQuery += ` AND carYear = $${countParamIndex}`;
    countParams.push(Number(year));
    countParamIndex++;
  }
  if (yearMin) {
    countQuery += ` AND carYear >= $${countParamIndex}`;
    countParams.push(Number(yearMin));
    countParamIndex++;
  }
  if (yearMax) {
    countQuery += ` AND carYear <= $${countParamIndex}`;
    countParams.push(Number(yearMax));
    countParamIndex++;
  }
  if (status) {
    countQuery += ` AND carStatus = $${countParamIndex}`;
    countParams.push(status);
    countParamIndex++;
  }
  if (priceMin) {
    countQuery += ` AND carPrice >= $${countParamIndex}`;
    countParams.push(Number(priceMin));
    countParamIndex++;
  }
  if (priceMax) {
    countQuery += ` AND carPrice <= $${countParamIndex}`;
    countParams.push(Number(priceMax));
    countParamIndex++;
  }

  const [carsResult, countResult] = await Promise.all([
    pool.query(query, params),
    pool.query(countQuery, countParams)
  ]);

  const total = parseInt(countResult.rows[0].total, 10);
  const totalPages = Math.ceil(total / limitNum);

  return {
    data: carsResult.rows,
    pagination: {
      currentPage: pageNum,
      pageSize: limitNum,
      totalRecords: total,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPreviousPage: pageNum > 1
    }
  };
};