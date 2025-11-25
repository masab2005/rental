import { createRentalService } from '../models/rentalModel.js';
import pool from '../config/db.js';
import handlerResponse from '../utils/handlerResponse.js';
import { 
  getRequestedRentalsService, 
  approveRentalService,
  getRentedCarsByUserService,
  getRequestedRentalsByUserService,
  endRentalService,
  declineRentalService
 } from '../models/rentalModel.js';
 import { deletePaymentService } from '../models/paymentModel.js';
export const createRental = async (req, res, next) => {
  try {
    const {
      startDate,
      endDate,
      carId,
      totalAmount,
      paymentId,
      userId
    } = req.body;

    // 1) required fields check
    if (!startDate || !endDate || !carId || !totalAmount || !paymentId || !userId) {
      return handlerResponse(res, 400, 'Fields are missing in rental info');
    }

    // 2) parse & validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return handlerResponse(res, 400, 'Invalid startDate or endDate format');
    }
    if (start >= end) {
      return handlerResponse(res, 400, 'startDate must be before endDate');
    }

    // 3) validate totalAmount
    const amountNum = Number(totalAmount);
    if (Number.isNaN(amountNum) || amountNum < 0) {
      return handlerResponse(res, 400, 'totalAmount must be a non-negative number');
    }

    // 4) validate IDs
    const carIdNum = Number(carId);
    const paymentIdNum = Number(paymentId);
    const userIdNum = Number(userId);

    if ([carIdNum, paymentIdNum, userIdNum].some(n => !Number.isInteger(n) || n <= 0)) {
      return handlerResponse(res, 400, 'carId, paymentId, and userId must be positive integers');
    }

    // 5) Lookup customerId from userId
    const { rows: custRows } = await pool.query(
      `SELECT customerId FROM customers WHERE userId = $1`,
      [userIdNum]
    );
    if (custRows.length === 0) {
      await deletePaymentService(paymentIdNum);
      return handlerResponse(res, 400, 'Customer record not found for this user');
    }
    const customerIdNum = custRows[0].customerid;

    // 6) Create rental
    const rental = await createRentalService({
      customerId: customerIdNum,
      userId: userIdNum,
      staffId: null,
      carId: carIdNum,
      paymentId: paymentIdNum,
      startDate: start.toISOString().slice(0,10),
      endDate: end.toISOString().slice(0,10),
      totalAmount: amountNum
    });

    return handlerResponse(res, 201, 'Rental created successfully', rental);
  } catch (err) {
    return next(err);
  }
};

export const getRequestedRentals = async (req, res, next) => {
  try {
    const rentals = await getRequestedRentalsService();
    return handlerResponse(res, 200, "Requested rentals fetched successfully", rentals);
  } catch (err) {
    next(err);
  }
};

export const approveRentals = async (req, res, next) => {
  try {
    const { bookingId, userId } = req.body;

    if (!bookingId || !userId) {
      return handlerResponse(res, 400, "bookingId and userId are required");
    }

    const bookingIdNum = Number(bookingId);
    const userIdNum = Number(userId);
    if ([bookingIdNum, userIdNum].some(n => !Number.isInteger(n) || n <= 0)) {
      return handlerResponse(res, 400, "bookingId and userId must be positive integers");
    }

    const result = await approveRentalService({ bookingId: bookingIdNum, userId: userIdNum });

    return handlerResponse(res, 201, "Rental approved successfully", result);
  } catch (err) {
    return next(err);
  }
};

export const rentedCarsByUser = async (req, res, next) => {
  try {
    const { id } = req.params; 

    if (!id) {
      return handlerResponse(res, 400, "userId is required");
    }

    const userIdNum = Number(id);
    if (!Number.isInteger(userIdNum) || userIdNum <= 0) {
      return handlerResponse(res, 400, "userId must be a positive integer");
    }

    const rentals = await getRentedCarsByUserService(userIdNum);
    return handlerResponse(res, 200, "Rented cars fetched successfully", rentals);
  } catch (err) {
    return next(err);
  }
};

export const requestedRentalsByUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return handlerResponse(res, 400, "userId is required");
    }

    const userIdNum = Number(id);
    if (!Number.isInteger(userIdNum) || userIdNum <= 0) {
      return handlerResponse(res, 400, "userId must be a positive integer");
    }

    const rentals = await getRequestedRentalsByUserService(userIdNum);
    return handlerResponse(res, 200, "Requested rentals fetched successfully", rentals);
  } catch (err) {
    return next(err);
  }
};

export const endRental = async (req, res, next) => {
  try {
    const { carId } = req.params;

    if (!carId) {
      return handlerResponse(res, 400, "carId is required");
    }

    const carIdNum = Number(carId);
    if (!Number.isInteger(carIdNum) || carIdNum <= 0) {
      return handlerResponse(res, 400, "carId must be a positive integer");
    }

    const result = await endRentalService(carIdNum);

    return handlerResponse(res, 200, "Rental ended successfully", result);
  } catch (err) {
    next(err);
  }
};

export const declineRental = async (req, res, next) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return handlerResponse(res, 400, "bookingId is required");
    }

    const bookingIdNum = Number(bookingId);
    if (!Number.isInteger(bookingIdNum) || bookingIdNum <= 0) {
      return handlerResponse(res, 400, "bookingId must be a positive integer");
    }

    const result = await declineRentalService(bookingIdNum);

    return handlerResponse(res, 201, "Rental declined successfully", result);
  } catch (err) {
    next(err);
  }
};

// GET /rental/currentRentals/:id
export const getCurrentRentals = async (req, res) => {
  try {
    const rentals = await getRentedCarsByUserService(req.params.id);
    res.json({ data: rentals });
  } catch (err) {
    console.error('Current rentals error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// GET /rental/pendingRequests/:id
export const getPendingRequests = async (req, res) => {
  try {
    const rentals = await getRequestedRentalsByUserService(req.params.id);
    res.json({ data: rentals });
  } catch (err) {
    console.error('Pending requests error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
