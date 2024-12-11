import axios from "../utils/axios";
import {tostify} from "../utils/helpers";
import {toast} from "react-toastify";

/**
 *
 * @returns {Promise<*>}
 */
export const fetchInventories = async (params = {}) => {
    try {
        return await axios.get(`/ecom/inventories`, {
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
export const fetchAllVariantOptionsByProduct = async (productId) => {
    try {
        return await axios.get(`/ecom/inventories/products/${productId}/variations/options`);
    } catch (error) {
        tostify(toast, 'error', error);
    }
}

/**
 *
 * @returns {Promise<*>}
 */
export const fetchInventoriesByCategory = async (categoryId, params = {}) => {
    try {
        return await axios.get(`/ecom/inventories/categories/${categoryId}`, {
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
export const fetchDiscountedInventories = async (params = {}) => {
    try {
        return await axios.get(`/ecom/inventories/discounted`, {
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
export const fetchInventoryByVariationIds = async (inventoryId, data) => {
    try {
        return await axios.post(`/ecom/inventories/${inventoryId}/inventory-variants`, data);
    } catch (error) {
        tostify(toast, 'error', error);
    }
}

/**
 *
 * @returns {Promise<*>}
 */
export const fetchSearchInventories = async (params = {}) => {
    try {
        return await axios.get(`/ecom/inventories/search`, {
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
export const fetchInventory = async (id, params = {}) => {
    try {
        return await axios.get(`/ecom/inventories/${id}/show`, {
            params: params
        });
    } catch (error) {
        tostify(toast, 'error', error);
    }
}
