import axios from "../utils/axios";
import {tostify} from "../utils/helpers";
import {toast} from "react-toastify";

/**
 *
 * @returns {Promise<*>}
 */
export const fetchComboCategories = async (params = {}) => {
    try {
        return await axios.get(`/ecom/combo-categories`, {
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
export const fetchComboCategory = async (id) => {
    try {
        return await axios.get(`/ecom/combo-categories/${id}/show`);
    } catch (error) {
        tostify(toast, 'error', error);
    }
}
