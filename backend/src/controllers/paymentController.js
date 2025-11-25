import { confirmPaymentService,getPaymentByIdService } from '../models/paymentModel.js';
import { validateCard } from "../utils/validatePayment.js";
import handlerResponse from '../utils/handlerResponse.js';
export const confirmPayment = async (req, res, next) => {
    const { paymentAmount, paymentMethod, cardNumber } = req.body;

    if (!paymentAmount || !paymentMethod || !cardNumber) {
        return handlerResponse(res, 400, 'fields are missing in payment info');
    }
    const method = paymentMethod.toLowerCase();
    if (!['visa', 'mastercard'].includes(method)) {
        return handlerResponse(res, 400, 'Invalid payment method. Accepted methods are visa and mastercard');
    }
    if (!validateCard(cardNumber, method)) {
        return handlerResponse(res, 400, 'Invalid card number for the specified payment method');
    }
    try {
        const newPayment = await confirmPaymentService({
            paymentAmount,
            paymentMethod: method,
            cardNumber
        });
        return handlerResponse(res, 201, 'Payment confirmed successfully', newPayment);
    } catch (error) {
        next(error);
    }
};


export const getPaymentById = async (req, res, next) => {
    const { id } = req.params;  
    try {
        const payment = await getPaymentByIdService(id);
        if (!payment) {
            return handlerResponse(res, 404, 'Payment not found');
        }
        handlerResponse(res, 200, 'Payment retrieved successfully', payment);
    } catch (error) {
        next(error);
    }
};
