import {API_URL, APP_NAME, APP_URL, BACKEND_URL} from "./constants";
import Router from "next/router";
import Swal from "sweetalert2";

const _ = require("lodash");
const moment = require("moment");
const CryptoJS = require('crypto-js');

/**
 *
 * @param toast
 * @param type
 * @param error
 * @param options
 * @returns {*}
 */
export const tostify = (toast, type, error, options = {}) => {
    let message = "";
    if (!_.isUndefined(error?.data) && !_.isUndefined(error?.data?.message)) {
        // Success Message
        message = error?.data?.message;
    } else if (!_.isUndefined(error?.response) && !_.isUndefined(error?.response?.data)) {
        // Error Message
        message = error?.response?.data?.message;
    } else {
        // Error Message
        message = error?.message;
    }

    if (type === 'success') {
        return toast.success(message, {
            ...options,
            hideProgressBar: true
        });
    } else if (type === 'info') {
        return toast.info(message, {
            ...options,
            hideProgressBar: true
        });
    } else if (type === 'warning') {
        return toast.warn(message, {
            ...options,
            hideProgressBar: true
        });
    } else if (type === 'error') {
        return toast.error(message, {
            ...options,
            hideProgressBar: true
        });
    }
}

/**
 *
 * @param number
 * @param decimal
 * @returns {string}
 */
export const currency = (number = 0, decimal = 2) => {
    return '৳' + number.toFixed(decimal);
}

/**
 * Making input errors
 * While user submit a form, then form validation error occurred
 * Here JOI or Sequelize errors return
 *
 * @param error
 * @param setErrors
 */
export const makeInputErrors = (error, setErrors) => {
    let errors = {};

    if (!_.isUndefined(error?.response) && !_.isUndefined(error?.response?.data?.errors)) {
        if (!_.isEmpty(error.response.data.errors) && _.isObject(error.response.data.errors)) {
            errors = error.response.data.errors
        }
    }

    setErrors(errors);
}

/**
 *
 * @param path
 * @returns {string}
 */
export const getStoragePath = (path) => {
    if (_.isEmpty(path)) {
        return '/no-image.png';
    }

    return BACKEND_URL + '/storage/' + path;
}

/**
 *
 * @param path
 * @returns {string}
 */
export const getApiStoragePath = (path) => {
    if (_.isEmpty(path)) {
        return '/no-image.png';
    }

    return API_URL + '/' + path;
}

/**
 *
 * @param limit
 * @returns {string}
 */
export const makeRandomString = (limit = 4) => {
    return (Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)).slice(-limit).toUpperCase();
}

/**
 *
 * @param destination
 * @param res
 * @param status
 */
export const redirectTo = (destination, {response, status} = {}) => {
    if (response) {
        response.writeHead(status || 302, {Location: destination})
        response.end()
    } else {
        if (destination[0] === '/' && destination[1] !== '/') {
            Router.push(destination)
        } else {
            window.location = destination
        }
    }
}

/**
 *
 * @param options
 */
export const swalConfirmPopup = (options = {}) => {
    let swalOptions = {
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3f51b5',
        cancelButtonColor: '#ff4081',
        confirmButtonText: 'Yes, Confirm',
        cancelButtonText: "No, Cancel",
        callback: () => {
            //
        },
        ...options
    }

    delete swalOptions['callback'];

    Swal.fire(swalOptions).then((event) => {
        if (event.value) {
            options.callback(true);
        } else {
            options.callback(false);
        }
    });
}

/**
 *
 * @param title
 * @return {string}
 */
export const makeTitle = (title) => {
    return `${title} - ${APP_NAME} | ${removeHttp(APP_URL)}`
}

/**
 *
 * @param url
 * @return {*}
 */
function removeHttp(url) {
    return url.replace(/^https?:\/\//, '');
}

/**
 *
 * @param item
 * @param billing_type
 * @returns {*|number}
 */
export const getCartTotal = (item, billing_type) => {
    let total = 0;

    if (!(item.price_monthly && item.price_yearly) || !billing_type) {
        return total;
    }

    if (billing_type === 'Yearly') {
        total = item.price_yearly
    } else {
        total = item.price_monthly;
    }

    return total;
}

/**
 *
 * @param ms
 * @return {Promise<unknown>}
 */
export const sleep = (ms) => {
    return new Promise(r => setTimeout(r, ms));
}

/**
 *
 * @param str
 * @return {*|string}
 */
export const toSentenceCase = (str) => {
    if (str.length === 0) {
        return str;
    }

    const sentence = str.toLowerCase();
    const firstChar = sentence.charAt(0).toUpperCase();

    return firstChar + sentence.slice(1);
}

/**
 *
 * @param address
 * @returns {string}
 */
export const getAddressToString = (address) => {

    let addrArray = [];

    if (address?.name) {
        addrArray.push(address.name);
    }

    if (address?.address_line_1) {
        addrArray.push(address.address_line_1);
    }

    if (address?.address_line_2) {
        addrArray.push(address.address_line_2);
    }

    if (address?.division) {
        addrArray.push(address.division.name);
    }

    if (address?.district) {
        addrArray.push(address.district.name);
    }

    if (address?.upazila) {
        addrArray.push(address.upazila.name);
    }

    if (address?.postcode) {
        addrArray.push(address.postcode);
    }

    if (address?.phone) {
        addrArray.push(address.phone);
    }

    if (address?.email) {
        addrArray.push(address.email);
    }

    return addrArray.join(', ');
}

export const getOrderStatusList = () => {
    return [
        {
            value: '1',
            text: 'Pending'
        },
        {
            value: '2',
            text: 'Processing'
        },
        {
            value: '3',
            text: 'Shipped'
        },
        {
            value: '4',
            text: 'Delivered'
        },
        {
            value: '5',
            text: 'Cancelled'
        }
    ];
};

export const getOrderStatusName = (value) => {
    const selectedOption = getOrderStatusList().find(option => option.value == value);
    return selectedOption ? selectedOption.text : undefined;
}

export const getPaymentStatusList = () => {
    return [
        {
            value: '1',
            text: 'Paid'
        },
        {
            value: '2',
            text: 'Unpaid'
        }
    ];
};

export const getPaymentStatusName = (value) => {
    const selectedOption = getPaymentStatusList().find(option => option.value == value);
    return selectedOption ? selectedOption.text : undefined;
};
