import axios from "../utils/axios";
import {tostify} from "../utils/helpers";
import {toast} from "react-toastify";

/**
 *
 * @returns {Promise<*>}
 */
export const fetchOrders = async (params = {}) => {
    try {
        return await axios.get(`/ecom/orders`, {
            params: params
        });
    } catch (error) {
        tostify(toast, 'error', error);
    }
}

/**
 *
 * @returns {Promise<*>}
 */
export const fetchOrder = async (id) => {
    try {
        return await axios.get(`/ecom/orders/${id}/show`);
    } catch (error) {
        tostify(toast, 'error', error);
    }
}

/**
 *
 * @returns {Promise<*>}
 */
export const saveOrder = async (data = {}) => {
    try {
        return await axios.post(`/ecom/orders`, data);
    } catch (error) {
        tostify(toast, 'error', error);
    }
}

/**
 *
 * @returns {Promise<*>}
 */
export const makePayment = async (data = {}) => {
    try {
        return await axios.post(`/ecom/orders/make-payment`, data);
    } catch (error) {
        tostify(toast, 'error', error);
    }
}

export const makePaymentInvoice = async (orderId, data = {}) => {
    try {
        return await axios.post(`/ecom/orders/make-payment/${orderId}`, data);
    } catch (error) {
        tostify(toast, 'error', error);
    }
}

export const checkCoupon = async (data = {}) => {
  try {
      return await axios.post(`/ecom/coupon`, data);
  } catch (error) {
      tostify(toast, 'error', error);
  }
}

export const fetchConditionalDiscounts = async () => {
  try {
    const response = await axios.get(`/ecom/conditional_discount`);
    return response
  } catch (error) {
      tostify(toast, 'error', error);
  }
}
