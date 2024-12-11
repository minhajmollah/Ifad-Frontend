import axios from "../utils/axios";
import {tostify} from "../utils/helpers";
import {toast} from "react-toastify";

/**
 *
 * @returns {Promise<*>}
 */
export const fetchCombos = async (params = {}) => {
    try {
        return await axios.get(`/ecom/combos`, {
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
export const fetchCombo = async (id, params = {}) => {
    try {
        return await axios.get(`/ecom/combos/${id}/show`, {
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
export const fetchCombosByCategory = async (id, params = {}) => {
    try {
        return await axios.get(`/ecom/combos/combo-categories/${id}`, {
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
export const fetchSearchCombos = async (params = {}) => {
    try {
        return await axios.get(`/ecom/combos/search`, {
            params: params
        });
    } catch (error) {
        tostify(toast, 'error', error);
    }
}
