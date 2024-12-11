import axios from "../utils/axios";
import {tostify} from "../utils/helpers";
import {toast} from "react-toastify";

/**
 *
 * @returns {Promise<*>}
 */
export const saveReview = async (data = {}) => {
    try {
        return await axios.post(`/ecom/reviews`, data);
    } catch (error) {
        tostify(toast, 'error', error);
    }
}

/**
 *
 * @param invenotryId
 * @returns {Promise<AxiosResponse<any>>}
 */
export const hasInventoryReviewAbility = async (invenotryId) => {
    try {
        return await axios.get(`/ecom/inventories/${invenotryId}/reviews/ability`);
    } catch (error) {
        tostify(toast, 'error', error);
    }
}

/**
 *
 * @param invenotryId
 * @returns {Promise<AxiosResponse<any>>}
 */
export const fetchInventoryReviews = async (invenotryId) => {
    try {
        return await axios.get(`/ecom/reviews/inventories/${invenotryId}`);
    } catch (error) {
        tostify(toast, 'error', error);
    }
}

/**
 *
 * @param comboId
 * @returns {Promise<AxiosResponse<any>>}
 */
export const hasComboReviewAbility = async (comboId) => {
    try {
        return await axios.get(`/ecom/combos/${comboId}/reviews/ability`);
    } catch (error) {
        tostify(toast, 'error', error);
    }
}

/**
 *
 * @param comboId
 * @returns {Promise<AxiosResponse<any>>}
 */
export const fetchComboReviews = async (comboId) => {
    try {
        return await axios.get(`/ecom/reviews/combos/${comboId}`);
    } catch (error) {
        tostify(toast, 'error', error);
    }
}