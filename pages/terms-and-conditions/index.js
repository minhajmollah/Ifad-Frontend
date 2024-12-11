import React, {Fragment, useEffect, useState} from "react"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import parse from 'html-react-parser'
import TermsBanner from "../../public/terms-conditions.png"
import Image from "next/image"
import axios from "axios"
import {API_URL} from "../../utils/constants"
import {makeTitle} from "../../utils/helpers";
import Head from "next/head";

const Conditions = () => {
    const [info, setInfo] = useState()
    const fetchtnc = () => {
        try {
            axios.get(`${API_URL}/content-module/22`)
                .then((res) => {
                    // console.log(res.data[0].content_item);
                    setInfo(res?.data[0]?.content_item);
                    console.log(info);
                })
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchtnc();
    }, [])

    return (
        <Fragment>
            <Head>
                <title>{makeTitle('Terms & Conditions')}</title>
            </Head>
            <section>
                <div className="terms-banner-div">
                    <Image src={TermsBanner} alt="" className="terms-banner"/>
                </div>
                <Container>
                    <Row className="justify-content-center">
                        {info?.map((item, index) => (
                            <Col xs={12} md={10} xxl={9} key={index}>
                                <h1 className="text-capitalize text-center font-jost font-30 fw-bold py-4">
                                    {item?.item_name}
                                </h1>
                                <p className="text-justify font-16 font-poppins pb-5">
                                    {parse(item?.item_long_desc)}
                                </p>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>
        </Fragment>
    )
}

export default Conditions