import React, {Fragment, useEffect} from 'react';
import {verifyEmailCustomer} from "../../../services/AuthServices";
import {makeTitle, tostify} from "../../../utils/helpers";
import {toast} from "react-toastify";
import {useRouter} from "next/router";
import {RotatingLines} from "react-loader-spinner";
import Head from "next/head";

const VerifyPage = () => {
    const router = useRouter();
    const {token} = router.query;

    useEffect(() => {
        if (token) {
            verifyEmailCustomer(token).then((response) => {
                if (response?.data?.message) {
                    tostify(toast, 'success', response);

                    setTimeout(() => {
                        location.href = '/my-account?prev=register';
                    }, 1500);
                }
            });
        }
    }, [token]);

    return (
        <Fragment>
            <Head>
                <title>{makeTitle("Verify Email Process")}</title>
            </Head>
            <section className="login-bg">
                <div className="d-flex justify-content-center" style={{padding: "150px 0"}}>
                    <RotatingLines
                        strokeColor="grey"
                        strokeWidth="5"
                        animationDuration="0.75"
                        width="96"
                        visible={true}
                    />
                </div>
            </section>
        </Fragment>
    );
}

export default VerifyPage
