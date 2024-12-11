import React, {Fragment, useState} from "react";
import Link from "next/link";
import {makeTitle, tostify} from "../../utils/helpers";
import {toast} from "react-toastify";
import {forgotPasswordCustomer} from "../../services/AuthServices";
import {Col, Container} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Head from "next/head";

function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors({});
        setIsLoading(true);

        forgotPasswordCustomer({
            email: email
        }, setErrors).then((response) => {
            if (response?.data?.status) {
                tostify(toast, 'success', response);
                setEmail('');
            }
        }).finally(() => {
            setIsLoading(false);
        });
    }

    return (
        <Fragment>
            <Head>
                <title>{makeTitle("Forgot Password")}</title>
            </Head>
        <section className="login-bg">
            <Container>
                <div className="py-5 d-flex justify-content-center">

                    <Col data-aos="fade-up" data-aos-duration="500" lg={4}
                         className="login-form-center shadow px-4 py-5 rounded-1 bg-white">
                        <h4 className="font-30 pb-4 ps-3 font-lato fw-semibold text-capitalize">Forgot Password?</h4>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="">
                                <Form.Label>Email address <span className="text-danger">*</span></Form.Label>
                                <Form.Control type="email" name='email' value={email}
                                              onChange={e => setEmail(e.target.value)}
                                              placeholder="Enter email address"
                                              className="rounded-0 login-form" required={true}/>
                            </Form.Group>

                            <button type="submit"
                                    className="font-poppins btn btn-primary w-100 submit-btn rounded-0 px-5 py-2 text-capitalize"
                                    disabled={isLoading}>
                                send reset link
                            </button>

                            <div className="pt-3 d-flex justify-content-center auth-bottom-link">
                                <span>Have an account?</span>
                                <Link href="/auth/login">
                                    Login
                                </Link>
                            </div>
                        </Form>
                    </Col>
                </div>
            </Container>
        </section>
        </Fragment>
    );
}

export default ForgotPasswordPage;
