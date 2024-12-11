import React, {Fragment, useState} from 'react';
import Link from 'next/link';
import {Col, Container} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import {googleLogin, loginCustomer} from "../../services/AuthServices";
import {login, setToken} from "../../utils/auth";
import {useDispatch} from "react-redux";
import {SET_AUTH_DATA} from "../../store/slices/AuthSlice";
import isAuth from "../../utils/HOC/isAuth";
import {useRouter} from "next/router";
import Head from "next/head";
import {makeTitle} from "../../utils/helpers";

const LoginPage = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);

    const [errors, setErrors] = useState({});

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors({});
        setIsLoading(true);

        loginCustomer({
            email: email,
            password: password,
            remember: remember
        }, setErrors).then((response) => {
            if (response?.data?.data) {
                const {customer, token} = response.data.data;

                if (customer) {
                    dispatch(SET_AUTH_DATA(customer));
                }

                if (customer?.email_verified_at) {
                    login(token);
                } else {
                    setToken(token);
                    location.href = '/auth/verify-email';
                }
            }
        }).finally(() => {
            setIsLoading(false);
        });
    };

    const handleGoogleLogin = (event) => {
        event.preventDefault();

        googleLogin().then((response) => {
            if (response?.data?.url) {
                window.location.href = response.data.url;
            }
        });
    }

    return (
        <Fragment>
            <Head>
                <title>{makeTitle("Login")}</title>
            </Head>
            <section className="login-bg">
                <Container>
                    <div className="py-5 d-flex justify-content-center">

                        <Col data-aos="fade-up" data-aos-duration="500" lg={4}
                             className="login-form-center shadow px-4 py-5 rounded-1 bg-white">
                            <h4 className="font-30 pb-4 ps-3 font-lato fw-semibold text-capitalize">sign in</h4>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="">
                                    <Form.Label>Email address <span className="text-danger">*</span></Form.Label>
                                    <Form.Control type="email" name='email' value={email}
                                                  onChange={e => setEmail(e.target.value)}
                                                  placeholder="Enter email address"
                                                  className="rounded-0 login-form" required={true}/>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="">
                                    <Form.Label>Password <span className="text-danger">*</span></Form.Label>
                                    <Form.Control type="password" name='password' value={password}
                                                  onChange={e => setPassword(e.target.value)}
                                                  placeholder="Enter password"
                                                  className="rounded-0 login-form" required={true}/>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="">
                                    <Form.Check type="checkbox" name="remember" label="Remember Me" value="1"
                                                onChange={(event) => setRemember(event.target.checked)}/>
                                </Form.Group>
                                <button type="submit"
                                        className="font-poppins btn btn-primary w-100 submit-btn rounded-0 px-5 py-2 text-capitalize"
                                        disabled={isLoading}>
                                    sign in
                                </button>

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

                                <div className="mt-4 d-flex justify-content-center">
                                    <img src="/google-login-btn.png"
                                         className="google-login-btn" width={280}
                                         onClick={(event) => handleGoogleLogin(event)} alt="google-login-btn"/>
                                </div>
                            </Form>
                        </Col>
                    </div>
                </Container>
            </section>
        </Fragment>
    );
}

export default isAuth(LoginPage)
