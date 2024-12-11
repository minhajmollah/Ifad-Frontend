import axios from "../utils/axios";
import {tostify} from "../utils/helpers";
import {toast} from "react-toastify";

/**
 *
 * @returns {Promise<*>}
 */
export const fetchCategories = async (params = {}) => {
    try {
        return await axios.get(`/ecom/categories`, {
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
export const fetchCategory = async (id) => {
    try {
        return await axios.get(`/ecom/categories/${id}/show`);
    } catch (error) {
        tostify(toast, 'error', error);
    }
}
