import {useRouter} from "next/router";
import React, {Fragment, useEffect} from "react";
import {SET_AUTH_DATA} from "../../../../store/slices/AuthSlice";
import {useDispatch} from "react-redux";
import {googleLoginCallback} from "../../../../services/AuthServices";
import {login, setToken} from "../../../../utils/auth";
import Head from "next/head";
import {makeTitle} from "../../../../utils/helpers";
import {RotatingLines} from "react-loader-spinner";

const GoogleCallbackPage = () => {
    const dispatch = useDispatch();

    const router = useRouter();
    const {query} = router;

    useEffect(() => {
        if (query?.code) {
            googleLoginCallback(query).then((response) => {
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
            });
        }
    }, [query]);

    return (
        <Fragment>
            <Head>
                <title>{makeTitle("Google Login Process")}</title>
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
    )
}

export default GoogleCallbackPage;
