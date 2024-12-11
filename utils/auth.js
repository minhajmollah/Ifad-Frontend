import Cookies from "js-cookie";
import cookie from "cookie";
import { logoutCustomer } from "../services/AuthServices";

/**
 *
 * @param reqCookies
 * @return {boolean}
 */
export const isLoggedIn = (reqCookies = null) => {
  if (!reqCookies) {
    return !!Cookies.get("X-ACCESS-TOKEN");
  }

  return !!cookie.parse(reqCookies)["X-ACCESS-TOKEN"];
};

/**
 *
 * @param token
 */
export const setToken = (token = "", rememberMe = false) => {
  // Cookies.set('X-ACCESS-TOKEN', token, {
  //     expires: 86400,
  //     sameSite: 'lax'
  // });

  const cookieOptions = {
    sameSite: "lax",
  };

  if (rememberMe) {
    cookieOptions.expires = 30;
    // cookieOptions.expires = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes in milliseconds
  }

  Cookies.set("X-ACCESS-TOKEN", token, cookieOptions);
};

/**
 *
 * @param token
 */
export const login = (token = "", rememberMe = false) => {
  // Cookies.set('X-ACCESS-TOKEN', token, {
  //     expires: 86400,
  //     sameSite: 'lax'
  // });

  const cookieOptions = {
    sameSite: "lax",
  };

  if (rememberMe) {
    cookieOptions.expires = 30;
    // cookieOptions.expires = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes in milliseconds
  }

  Cookies.set("X-ACCESS-TOKEN", token, cookieOptions);

  // Redirect...
  if (typeof window !== "undefined") {
    const redirectTo = localStorage.getItem("redirectTo");

    if (redirectTo) {
      location.href = `/${redirectTo}`;

      setTimeout(() => {
        // localStorage.setItem('redirectTo', '');
        localStorage.removeItem("redirectTo");
      });
    } else {
      location.href = "/";
    }
  }
};

/**
 *
 * @return {Promise<void>}
 */
export const logout = async () => {
  Cookies.remove("X-ACCESS-TOKEN", {
    expires: 86400,
    sameSite: "lax",
  });

  await logoutCustomer();

  if (typeof window !== "undefined") {
    location.href = "/auth/login";
  }
};

/**
 *
 * @return {*}
 */
export const token = () => {
  return Cookies.get("X-ACCESS-TOKEN") ?? "";
};
