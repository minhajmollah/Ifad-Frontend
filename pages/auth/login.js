import React, {Fragment, useState} from 'react';
import Link from 'next/link';
import {Col, Container, InputGroup} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import {toast} from "react-toastify";
import {
    googleLogin,
    facebookLogin,
    sendOtpViaEmail,
    sendOtpViaPhone,
    verifyOtpViaEmail,
    verifyOtpViaPhone,
    verifyPasswordWithPhone,
    verifyPassword,
} from "../../services/AuthServices";
import {login, setToken} from "../../utils/auth";
import {useDispatch} from "react-redux";
import {SET_AUTH_DATA} from "../../store/slices/AuthSlice";
import isAuth from "../../utils/HOC/isAuth";
import Head from "next/head";
import {makeTitle, tostify} from "../../utils/helpers";
import {FaPhoneAlt, FaRegEnvelope} from "react-icons/fa";

const LoginPage = () => {
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);

    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(true);

    const [isEmail, setIsEmail] = useState(false);
    const [isPhone, setIsPhone] = useState(false);
    const [isOtp, setIsOtp] = useState(false);
    const [isPassword, setIsPassword] = useState(false);

    const [code, setCode] = useState('');
    const [otp, setOtp] = useState('');
    const [passedNextStep, setPassedNextStep] = useState(false);

    const [errors, setErrors] = useState({});

    const [resendTimer, setResendTimer] = useState(300);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    const startResendTimer = () => {
      setIsTimerRunning(true);
      setResendTimer(300); // Reset timer to 10 seconds

      const timerInterval = setInterval(() => {
        setResendTimer(prevTimer => {
          if (prevTimer === 1) {
            clearInterval(timerInterval);
            setIsTimerRunning(false);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    };

    const handleGoogleLogin = (event) => {
        event.preventDefault();

        googleLogin().then((response) => {
            if (response?.data?.url) {
                window.location.href = response.data.url;
            }
        });
    }

    const handleFacebookLogin = (event) => {
        event.preventDefault();

        facebookLogin().then((response) => {
            if (response?.data?.url) {
                window.location.href = response.data.url;
            }
        });
    }

    const handleChangeEmailOrPhone = (e) => {
        e.preventDefault();

        const value = e.target.value;

        if (parseFloat(value)) {
            setIsPhone(true);
            // setIsPassword(true);
            setCode('88');
            setIsEmail(false);
            // setIsOtp(false);
        } else {
            setIsEmail(true);
            // setIsOtp(false);
            setIsPhone(false);
            // setIsPassword(true);
        }

        setEmailOrPhone(value);
    }

    const handleNext = (e) => {
        e.preventDefault();

        // if (isEmail && emailOrPhone) {
        //     setIsLoading(true)

        //     sendOtpViaEmail({
        //         email: emailOrPhone
        //     }).then((response) => {
        //         setIsOtp(false);
        //         setIsPassword(true);
        //         setPassedNextStep(true);
        //         setIsLoading(false);
        //     }).catch(() => {
        //         setIsLoading(false);
        //     });
        // }

        // if (isPhone && emailOrPhone) {
        //     setIsLoading(true)

        //     sendOtpViaPhone({
        //         phone_number: code + '' + emailOrPhone
        //     }).then((response) => {
        //       setIsOtp(false);
        //         setIsPassword(true);
        //         setPassedNextStep(true);
        //         setIsLoading(false);
        //     }).catch(() => {
        //         setIsLoading(false);
        //     });
        // }

        // Email validation using a simple regex pattern
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrPhone);
        const isPhoneValid = /^01\d{9}$/.test(emailOrPhone);

        if ((isEmail && isEmailValid) || (isPhone && isPhoneValid)) {
          setIsOtp(false);
          setIsPassword(true);
          setPassedNextStep(true);
        } else {
          tostify(toast, "error", {
            message: isEmail ? "Invalid email" : "Invalid phone number"
          });
        }
    }

    const handleLogin = (e) => {
        e.preventDefault();

        if (isEmail && isOtp) {
            setIsLoading(true);

            verifyOtpViaEmail({
                email: emailOrPhone,
                otp: otp,
            }, setErrors).then((response) => {
                if (response?.data?.data) {
                    const {customer, token, group} = response.data.data;

                    if (customer) {
                        dispatch(SET_AUTH_DATA({
                          ...customer, group: group || []
                        }));
                    }

                    if (customer?.email_verified_at) {
                        login(token, remember);
                    } else {
                        setToken(token, remember);
                        location.href = '/auth/verify-email';
                    }
                }

                setIsLoading(false);
            }).catch(() => {
                setIsLoading(false);
            });
        }

        // if (isPhone && isPassword) {
        //     setIsLoading(true);

        //     verifyPasswordWithPhone({
        //         phone_number: code + '' + emailOrPhone,
        //         password: password,
        //     }, setErrors).then((response) => {
        //         if (response?.data?.data) {
        //             const {customer, token} = response.data.data;

        //             if (customer) {
        //                 dispatch(SET_AUTH_DATA(customer));
        //             }

        //             if (customer?.email_verified_at) {
        //                 login(token);
        //             } else {
        //                 setToken(token);
        //                 location.href = '/auth/verify-email';
        //             }
        //         }

        //         setIsLoading(false);
        //     }).catch(() => {
        //         setIsLoading(false);
        //     });
        // }

        if (isPhone && isOtp) {
            setIsLoading(true);

            verifyOtpViaPhone({
              phone_number: code + '' + emailOrPhone,
                otp: otp,
            }, setErrors).then((response) => {
                if (response?.data?.data) {
                    const {customer, token, group} = response.data.data;

                    if (customer) {
                        dispatch(SET_AUTH_DATA({
                          ...customer, group: group || []
                        }));
                    }

                    if (customer?.email_verified_at) {
                        login(token, remember);
                    } else {
                        setToken(token, remember);
                        location.href = '/auth/verify-email';
                    }
                }

                setIsLoading(false);
            }).catch(() => {
                setIsLoading(false);
            });
        }

        if (isPassword && !isOtp) {
          setIsLoading(true);

          const data = isEmail && !isPhone
          ? {
            email: emailOrPhone,
            password: password,
          }
          : {
            phone_number: code + '' + emailOrPhone,
            password: password,
          };

          verifyPassword(data, setErrors).then((response) => {
              if (response?.data?.data) {
                  const {customer, token, group} = response.data.data;

                  if (customer) {
                      dispatch(SET_AUTH_DATA({
                        ...customer, group: group || []
                      }));
                  }

                  if (customer?.email_verified_at) {
                      login(token, remember);
                  } else {
                      setToken(token, remember);
                      location.href = '/auth/verify-email';
                  }
              }

              setIsLoading(false);
          }).catch(() => {
              setIsLoading(false);
          });
      }
    }

    const handleLoginWIthOTP = (e) => {
        e.preventDefault();

        if (isEmail && emailOrPhone) {
            setIsLoading2(true);

            sendOtpViaEmail({
              email: emailOrPhone
            }).then((response) => {
                setIsOtp(true);
                setIsPassword(false);
                setIsLoading2(false);
                startResendTimer(); // Start the resend timer
            }).catch(() => {
              setIsLoading2(false);
            });
        } else if (isPhone && code && emailOrPhone) {
            setIsLoading2(true);

            sendOtpViaPhone({
                phone_number: code + '' + emailOrPhone
            }).then(res => {
                setIsOtp(true)
                setIsPassword(false);
                setIsLoading2(false);
                startResendTimer(); // Start the resend timer
            }).catch(() => {
                setIsLoading2(false);
            });
        }
    }

    return (
        <Fragment>
            <Head>
                <title>{makeTitle("Login")}</title>
            </Head>
            <section className="login-bg">
                <Container>
                    <Form className="py-5 d-flex justify-content-center" method='POST' onSubmit={e => e.preventDefault()}>
                        <Col data-aos="fade-up" data-aos-duration="500" lg={4}
                             className="login-form-center shadow px-4 py-5 rounded-1 bg-white">
                            <h3 className="font-30 pb-4 font-lato fw-semibold">
                                Sign in
                            </h3>

                            <div className="d-flex align-items-center">
                                <Form.Group className="mb-3 flex-grow-1" controlId="emailOrPhone">
                                    <Form.Label>
                                        Email or Phone Number: <span className="text-danger">*</span>
                                    </Form.Label>
                                    <InputGroup>
                                        {isPhone ? (
                                            <Fragment>
                                                <InputGroup.Text className="bg-transparent rounded-0 px-2">
                                                    <FaPhoneAlt/>
                                                </InputGroup.Text>
                                                <InputGroup.Text className="bg-transparent rounded-0 px-2">
                                                    <select value={code} onChange={e => setCode(e.target.value)}
                                                            className="bg-transparent outline-0"
                                                            disabled={passedNextStep}>
                                                        <option selected value="88">BD</option>
                                                    </select>
                                                </InputGroup.Text>
                                                <InputGroup.Text className="bg-transparent rounded-0 px-2">
                                                    {code}
                                                </InputGroup.Text>
                                            </Fragment>
                                        ) : (
                                            <InputGroup.Text className="bg-transparent rounded-0">
                                                <FaRegEnvelope/>
                                            </InputGroup.Text>
                                        )}

                                        <Form.Control type="text" name='text' value={emailOrPhone}
                                                      onChange={e => handleChangeEmailOrPhone(e)}
                                                      placeholder="Email or Phone" disabled={passedNextStep}
                                                      className="rounded-0 login-form" id="emailOrPhone"
                                                      required={true}/>
                                    </InputGroup>
                                    {errors?.otp && (
                                        <small className="text-danger">
                                            {errors.otp}
                                        </small>
                                    )}
                                </Form.Group>
                            </div>

                            {isPassword && !isOtp && passedNextStep && (
                                <Form.Group className="mb-3" controlId="">
                                    <Form.Label>
                                        Password: <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control type="password" value={password}
                                                  onChange={e => setPassword(e.target.value)}
                                                  placeholder="Enter password"
                                                  className="rounded-0 login-form" required={true}/>
                                    {errors?.password && (
                                        <small className="text-danger">
                                            {errors.password}
                                        </small>
                                    )}
                                </Form.Group>
                            )}

                            {!isPassword && isOtp && passedNextStep && (
                                <Form.Group className="mb-3" controlId="">
                                    <Form.Label>
                                        OTP Code: <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control type="text" value={otp}
                                                  onChange={e => setOtp(e.target.value)}
                                                  placeholder="OTP Code"
                                                  className="rounded-0 login-form" required={true}/>
                                    {errors?.otp && (
                                        <small className="text-danger">
                                            {errors.otp}
                                        </small>
                                    )}
                                </Form.Group>
                            )}

                            <div className="mb-3 d-flex justify-content-between align-items-center">
                            <Form.Group controlId="remember">
                                <Form.Check type="checkbox" name="remember" label="Remember Me"
                                            id="remember" checked={remember}
                                            onChange={(event) => setRemember(event.target.checked)}/>
                            </Form.Group>

                            {/* {passedNextStep ? (
                              <button type="button"
                                      className="btn-link"
                                      disabled={isLoading} onClick={(e) => handleLoginWIthOTP(e)}>
                                  {isLoading2 ? 'Loading...' : isOtp ? 'Resend OTP' : 'Login with OTP'}
                              </button>
                            ) : ""} */}

                            {/* {passedNextStep && (
                              <div className="text-center">
                                <button type="button"
                                        className="font-poppins btn btn-link mt-1 no-underline fs-5 text-black"
                                        disabled={resendTimer > 0}
                                        onClick={(e) => handleLoginWIthOTP(e)}>
                                  {resendTimer > 0
                                    ? `Resend OTP in ${Math.floor(resendTimer / 60)}:${(resendTimer % 60)
                                        .toString()
                                        .padStart(2, '0')}`
                                    : 'Resend OTP'}
                                </button>
                              </div>
                            )} */}

                            {passedNextStep ? (
                              <button
                                type="button"
                                className="btn-link"
                                disabled={isLoading2 || isTimerRunning}
                                onClick={(e) => handleLoginWIthOTP(e)}
                              >
                                {isLoading2
                                  ? 'Sending OTP...'
                                  : isOtp
                                  ? isTimerRunning
                                    ? `Resend OTP in ${Math.floor(resendTimer / 60)}:${(resendTimer % 60)
                                        .toString()
                                        .padStart(2, '0')}`
                                    : 'Resend OTP'
                                  : 'Login with OTP'}
                              </button>
                            ) : null}

                            </div>

                            {passedNextStep ? (
                                <div className="text-center">
                                    <button type="button"
                                            className="font-poppins btn btn-primary w-100 submit-btn rounded-0 px-5 py-2"
                                            disabled={isLoading} onClick={(e) => handleLogin(e)}>
                                        {isLoading ? 'Loading...' : 'Login'}
                                    </button>

                                    {/* {isPhone && code && emailOrPhone && (
                                        <button type="button"
                                                className="font-poppins btn btn-link mt-1 no-underline fs-5 text-black"
                                                disabled={isLoading} onClick={(e) => handleLoginWIthOTP(e)}>
                                            {isLoading2 ? 'Loading...' : 'Login with OTP'}
                                        </button>
                                    )} */}
                                </div>
                            ) : (
                                <button type="button"
                                        className="font-poppins btn btn-primary w-100 submit-btn rounded-0 px-5 py-2"
                                        disabled={isLoading} onClick={(e) => handleNext(e)}>
                                    {isLoading ? 'Loading...' : 'Next'}
                                </button>
                            )}

                            <div className="pt-3 d-flex justify-content-center auth-bottom-link">
                                <span>Don't have an account?</span>
                                <Link href="/auth/register">
                                    Sign Up Now
                                </Link>
                            </div>

                            <div className="pt-3 d-flex justify-content-center">
                                <Link href="/auth/forgot-password">
                                    Forgot Password?
                                </Link>
                            </div>

                            <div class="d-flex mt-4 justify-content-center">
                              <div className="d-flex justify-content-center">
                                  <img src="/google-login-btn-new.png"
                                      className="google-login-btn" width={280}
                                      onClick={(event) => handleGoogleLogin(event)} alt="google-login-btn"/>
                              </div>
                              <div className="ms-2 d-flex justify-content-center">
                                  <img src="/facebook-login-btn-new.png"
                                      className="facebook-login-btn" width={280}
                                      onClick={(event) => handleFacebookLogin(event)} alt="facebook-login-btn"/>
                              </div>
                            </div>
                        </Col>
                    </Form>
                </Container>
            </section>
        </Fragment>
    );
}

export default isAuth(LoginPage)
