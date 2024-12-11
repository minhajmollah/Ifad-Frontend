import axios from "../utils/axios";
import {tostify} from "../utils/helpers";
import {toast} from "react-toastify";

/**
 *
 * @returns {Promise<*>}
 */
export const fetchBrands = async () => {
    try {
        return await axios.get(`/content-module/27`);
    } catch (error) {
        tostify(toast, 'error', error);
    }
}
