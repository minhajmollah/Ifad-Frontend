import React, {Fragment, useEffect, useState} from "react"
import PrivacyBanner from "../../public/privacy-policy.jpg"
import Image from "next/image"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import ListGroup from "react-bootstrap/ListGroup";
import parse from 'html-react-parser'
import {fetchPrivacyPolicy} from "../../services/CommonServices";
import {makeTitle} from "../../utils/helpers";
import Head from "next/head";

const PrivacyPolicyPage = () => {
    const [info, setInfo] = useState();

    useEffect(() => {
        fetchPrivacyPolicy().then((res) => {
            setInfo(res?.data[0]?.content_item);
        });
    }, []);

    return (
        <Fragment>
            <Head>
                <title>{makeTitle("Privacy Policy")}</title>
            </Head>
            <section>
                <div className="terms-banner-div">
                    <Image src={PrivacyBanner} alt="" className="terms-banner"/>
                </div>
                <Container>
                    {info?.map((item, index) => (
                        <Row className="justify-content-center" key={index}>
                            <Col xs={12} md={10} xxl={9}>
                                <h1 className="text-capitalize text-center font-jost font-30 fw-bold py-4">
                                    {item?.item_name}
                                </h1>
                                <ListGroup as="ol" className="pb-5" numbered>
                                    {parse(item?.item_long_desc)}
                                </ListGroup>
                            </Col>
                        </Row>
                    ))}
                </Container>
            </section>
        </Fragment>
    )
}

export default PrivacyPolicyPage