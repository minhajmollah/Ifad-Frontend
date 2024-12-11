import React, {Fragment, useEffect, useState} from "react";

import {useRouter} from "next/router";
import {makeTitle, tostify} from "../../../utils/helpers";
import {toast} from "react-toastify";
import {resetPasswordCustomer} from "../../../services/AuthServices";
import {Col, Container} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Head from "next/head";

function ResetPasswordPage() {
    const router = useRouter()

    const [isLoading, setIsLoading] = useState(false);

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')

    const [errors, setErrors] = useState({});

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors({});
        setIsLoading(true);

        resetPasswordCustomer({
            token: router.query.token,
            email: email,
            password: password,
            password_confirmation: passwordConfirmation,
        }, setErrors).then((response) => {
            if (response?.data?.status) {
                tostify(toast, 'success', response);
                router.push('/auth/login');
            }
        }).finally(() => {
            setIsLoading(false);
        });
    }

    useEffect(() => {
        setEmail(router.query.email || '')
    }, [router.query.email]);

    return (
        <Fragment>
            <Head>
                <title>{makeTitle("Reset Password")}</title>
            </Head>
        <section className="login-bg">
            <Container>
                <div className="py-5 d-flex justify-content-center">

                    <Col data-aos="fade-up" data-aos-duration="500" lg={4}
                         className="login-form-center shadow px-4 py-5 rounded-1 bg-white">
                        <h4 className="font-30 pb-4 ps-3 font-lato fw-semibold text-capitalize">Reset Password</h4>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="">
                                <Form.Label>Email address <span className="text-danger">*</span></Form.Label>
                                <Form.Control type="email" name='email' defaultValue={email}
                                              placeholder="Enter email address"
                                              className="rounded-0 login-form" readOnly={true}/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="">
                                <Form.Label>Password <span className="text-danger">*</span></Form.Label>
                                <Form.Control type="password" name='password' value={password}
                                              onChange={e => setPassword(e.target.value)}
                                              placeholder="Enter password"
                                              className="rounded-0 login-form" required={true}/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="">
                                <Form.Label>Confirm Password <span className="text-danger">*</span></Form.Label>
                                <Form.Control type="password" name='passwordConfirmation' value={passwordConfirmation}
                                              onChange={e => setPasswordConfirmation(e.target.value)}
                                              placeholder="Enter confirm password"
                                              className="rounded-0 login-form" required={true}/>
                            </Form.Group>
                            <button type="submit"
                                    className="font-poppins btn btn-primary w-100 submit-btn rounded-0 px-5 py-2 text-capitalize"
                                    disabled={isLoading}>
                                Reset Password
                            </button>
                        </Form>
                    </Col>
                </div>
            </Container>
        </section>
        </Fragment>
    );
}

export default ResetPasswordPage;
