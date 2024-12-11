/**
 *
 * @returns {Promise<*>}
 */
import axios from "../utils/axios";
import { tostify } from "../utils/helpers";
import { toast } from "react-toastify";

export const fetchSocial = async () => {
  try {
    return await axios.get(`/content-module/16`);
  } catch (error) {
    tostify(toast, "error", error);
  }
};

export const fetchHomeBanners = async () => {
  try {
    return await axios.get(`/content-module/26`);
  } catch (error) {
    tostify(toast, "error", error);
  }
};

export const fetchAboutInfo = async () => {
  try {
    return await axios.get(`/content-module/4`);
  } catch (error) {
    tostify(toast, "error", error);
  }
};

export const fetchMissionVision = async () => {
  try {
    return await axios.get(`/content-module/21`);
  } catch (error) {
    tostify(toast, "error", error);
  }
};

export const fetchBoardOfDirectors = async () => {
  try {
    return await axios.get(`/content-module/1`);
  } catch (error) {
    tostify(toast, "error", error);
  }
};

export const fetchMD = async () => {
  try {
    return await axios.get(`/content-module/18`);
  } catch (error) {
    tostify(toast, "error", error);
  }
};

export const fetchLeadershipTeam = async () => {
  try {
    return await axios.get(`/content-module/19`);
  } catch (error) {
    tostify(toast, "error", error);
  }
};

export const fetchValues = async () => {
  try {
    return await axios.get(`/content-module/20`);
  } catch (error) {
    tostify(toast, "error", error);
  }
};

export const sendContactForm = async (data) => {
  try {
    return await axios.post(`/ecom/send-contact-form`, data);
  } catch (error) {
    tostify(toast, "error", error);
  }
};

export const fetchPrivacyPolicy = async () => {
  try {
    return await axios.get(`/content-module/24`);
  } catch (error) {
    tostify(toast, "error", error);
  }
};

export const fetchPopupData = async () => {
  try {
    return await axios.get(`/content-module/29`);
  } catch (error) {
    tostify(toast, "error", error);
  }
};
