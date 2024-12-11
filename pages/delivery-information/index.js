import React, {Fragment, useEffect, useState} from "react"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Image from "next/image"
import parse from 'html-react-parser'
import DeliveryTNC from "../../public/dtnc.png"
import DeliveryBanner from "../../public/delivery.jpg"
import axios from "axios"
import {API_URL} from "../../utils/constants"
import {makeTitle} from "../../utils/helpers";
import Head from "next/head";

const DeliverInformationPage = () => {
    const [info, setInfo] = useState();

    const fetchDeliveryInfo = () => {
        try {
            axios.get(`${API_URL}/content-module/25`)
                .then((res) => {
                    setInfo(res?.data[0]?.content_item);
                })
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchDeliveryInfo();
    }, [])

    return (
        <Fragment>
            <Head>
                <title>{makeTitle("Delivery Information")}</title>
            </Head>
        <section>
            <div className="terms-banner-div">
                <Image src={DeliveryBanner} alt="" className="terms-banner"/>
            </div>
            <Container>
                {info?.map((item, index) => (
                    <Row className="justify-content-center" key={index}>
                        <Col xs={12} md={10} xxl={9}>
                            <div className="text-center">
                                <h1 className="text-capitalize text-center font-jost font-30 fw-bold py-4">
                                    {item?.item_name}
                                </h1>
                                <Image src={DeliveryTNC} alt="" className="img"/>
                                <div className="d-flex justify-content-center ">
                                    <p className="text-capitalize font-16 font-inter delivery-para pb-5">
                                        {item?.item_short_desc}
                                    </p>
                                </div>
                            </div>
                        </Col>
                        <Col xs={12} md={10} xxl={9} className="delivery-details">
                            {parse(item?.item_long_desc)}
                        </Col>
                    </Row>
                ))}
            </Container>
        </section>
        </Fragment>
    )
}

export default DeliverInformationPage