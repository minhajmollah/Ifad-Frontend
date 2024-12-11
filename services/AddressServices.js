import axios from "../utils/axios";
import {tostify} from "../utils/helpers";
import {toast} from "react-toastify";

/**
 *
 * @returns {Promise<*>}
 */
export const fetchAddresses = async () => {
    try {
        return await axios.get(`/ecom/addresses`);
    } catch (error) {
        tostify(toast, 'error', error);
    }
}

/**
 *
 * @returns {Promise<*>}
 */
export const saveAddress = async (data) => {
    try {
        return await axios.post(`/ecom/addresses`, data);
    } catch (error) {
        tostify(toast, 'error', error);
    }
}

/**
 *
 * @returns {Promise<*>}
 */
export const editAddress = async (data) => {
    try {
        return await axios.put(`/ecom/addresses/${data.id}`, data);
    } catch (error) {
        tostify(toast, 'error', error);
    }
}

/**
 *
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteAddress = async (id) => {
    try {
        return await axios.delete(`/ecom/addresses/${id}`);
    } catch (error) {
        tostify(toast, 'error', error);
    }
}

/**
 *
 * @returns {Promise<*>}
 */
export const updateDefaultBillingAddress = async (id) => {
    try {
        return await axios.put(`/ecom/addresses/${id}/default-billing`);
    } catch (error) {
        tostify(toast, 'error', error);
    }
}

/**
 *
 * @returns {Promise<*>}
 */
export const updateDefaultShippingAddress = async (id) => {
    try {
        return await axios.put(`/ecom/addresses/${id}/default-shipping`);
    } catch (error) {
        tostify(toast, 'error', error);
    }
}