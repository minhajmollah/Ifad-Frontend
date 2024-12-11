import React, {Fragment, useState} from 'react';
import Link from 'next/link';
import Button from "react-bootstrap/Button";
import {Col, Container, InputGroup} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import {googleLogin, facebookLogin, registerCustomer} from "../../services/AuthServices";
import {SET_AUTH_DATA} from "../../store/slices/AuthSlice";
import {login, setToken} from "../../utils/auth";
import {useDispatch} from "react-redux";
import Head from "next/head";
import {makeTitle} from "../../utils/helpers";

function RegisterPage() {
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agree, setAgree] = useState(false);

    const [code, setCode] = useState('88');

    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();

        // const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const isPhoneValid = /^01\d{9}$/.test(phone);

        if (!isPhoneValid) {
          setErrors(prev => ({
            ...prev,
            phone: "Invalid phone number"
          }))
          return;
        }

        setErrors({});
        setIsLoading(true);

        // console.log(code + '' + phone)
        // return

        registerCustomer({
            name: name,
            email: email,
            phone_number: code + '' + phone,
            password: password,
            password_confirmation: confirmPassword,
            agree: agree,
        }, setErrors).then((response) => {
            if (response?.data?.data) {
                const {customer, token, group} = response.data.data;

                if (customer) {
                    dispatch(SET_AUTH_DATA({
                      ...customer, group: group || []
                    }));
                }

                if (customer?.email_verified_at) {
                    login(token);
                } else {
                    setToken(token);
                    location.href = '/auth/verify-email';
                }
            }

            setIsLoading(false);
        }).catch(() => {
            setIsLoading(false);
        });
    }

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

    return (
        <Fragment>
            <Head>
                <title>{makeTitle("Register")}</title>
            </Head>
            <section className="login-bg">
                <Container>
                    <div className="py-5 d-flex justify-content-center">

                        <Col data-aos="fade-up" data-aos-duration="500" lg={4}
                             className="login-form-center shadow px-4 py-5 rounded-1 bg-white">
                            <h4 className="font-30 pb-4 ps-3 font-lato fw-semibold text-capitalize">sign up</h4>
                            <Form className="px-3" onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Name<span className="text-danger"> *</span></Form.Label>
                                    <Form.Control type="text" name='name' value={name}
                                                  onChange={e => setName(e.target.value)}
                                                  placeholder="Enter your name"
                                                  className="rounded-0 login-form" required={true}/>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email Address<span className="text-danger"> *</span></Form.Label>
                                    <Form.Control type="email" name='email' value={email}
                                                  onChange={e => setEmail(e.target.value)}
                                                  placeholder="Enter email address"
                                                  className="rounded-0 login-form" required={true}/>
                                    {errors?.email && (
                                        <small className="text-danger">
                                            {errors.email}
                                        </small>
                                    )}
                                </Form.Group>
                                <Form.Group className="mb-3 flex-grow-1">
                                    <Form.Label>
                                        Phone Number: <span className="text-danger">*</span>
                                    </Form.Label>
                                    <InputGroup>
                                        <Fragment>
                                            <InputGroup.Text className="bg-transparent rounded-0 px-2">
                                                <select value={code} onChange={e => setCode(e.target.value)}
                                                        className="bg-transparent outline-0">
                                                    <option value="88">BD</option>
                                                </select>
                                            </InputGroup.Text>
                                            <InputGroup.Text className="bg-transparent rounded-0 px-2">
                                                {code}
                                            </InputGroup.Text>
                                        </Fragment>
                                        <Form.Control type="text" name='phone' value={phone}
                                                      onChange={e => {
                                                        setErrors(prev => ({
                                                          ...prev,
                                                          phone: ""
                                                        }))
                                                        setPhone(e.target.value)
                                                      }}
                                                      placeholder="Enter phone number"
                                                      className="rounded-0 login-form" id="phone"
                                                      required={true}/>
                                    </InputGroup>
                                    {errors?.phone && (
                                        <small className="text-danger">
                                            {errors.phone}
                                        </small>
                                    )}
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Password<span className="text-danger"> *</span></Form.Label>
                                    <Form.Control type="password" name='password' value={password}
                                                  onChange={e => setPassword(e.target.value)}
                                                  placeholder="Enter password"
                                                  className="rounded-0 login-form" required={true}/>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Confirm Password<span className="text-danger"> *</span></Form.Label>
                                    <Form.Control type="password" name='confirmPassword' value={confirmPassword}
                                                  onChange={e => setConfirmPassword(e.target.value)}
                                                  placeholder="Enter confirm password"
                                                  className="rounded-0 login-form" required={true}/>
                                    {errors?.password && (
                                        <small className="text-danger">
                                            {errors.password}
                                        </small>
                                    )}
                                </Form.Group>
                                <Form.Group className="mb-3 text-secondary d-flex">
                                    <Form.Check type="checkbox" label="Agree"
                                                onChange={(event) => setAgree(event.target.checked)}/>
                                    <span className="mr-1"></span>
                                    <Link href={"/terms-and-conditions"} className="auth-terms-link">terms &
                                        conditions</Link>
                                </Form.Group>

                                <Button type="submit"
                                        className="btn btn-primary w-100 submit-btn rounded-0 px-5 py-2 text-capitalize font-poppins"
                                        disabled={isLoading}>
                                    {isLoading ? 'Loading...' : 'Register'}
                                </Button>

                                <div className="pt-3 d-flex justify-content-center auth-bottom-link">
                                    <span>Already have an account?</span>
                                    <Link href="/auth/login">
                                        Login
                                    </Link>
                                </div>

                                <div className="mt-4 d-flex justify-content-center">
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
                            </Form>
                        </Col>
                    </div>
                </Container>
            </section>
        </Fragment>
    );
}

export default RegisterPage