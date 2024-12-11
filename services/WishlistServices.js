import axios from "../utils/axios";
import {tostify} from "../utils/helpers";
import {toast} from "react-toastify";

/**
 *
 * @returns {Promise<*>}
 */
export const fetchWishlist = async (params = {}) => {
    try {
        return await axios.get(`/ecom/wishlist`, {
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
export const syncWishlist = async (data = {}) => {
    try {
        return await axios.post(`/ecom/wishlist/sync`, data);
    } catch (error) {
        tostify(toast, 'error', error);
    }
}

/**
 *
 * @returns {Promise<*>}
 */
export const wishlistStatus = async (inventoryId) => {
    try {
        return await axios.get(`/ecom/wishlist/inventories/${inventoryId}/status`);
    } catch (error) {
        tostify(toast, 'error', error);
    }
}

/**
 *
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteWishlist = async (id) => {
    try {
        return await axios.delete(`/ecom/wishlist/${id}`);
    } catch (error) {
        tostify(toast, 'error', error);
    }
}
