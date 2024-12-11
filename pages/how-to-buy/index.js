import React, {Fragment} from "react"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import Image from "next/image"
import StepOne from "../../public/howtobuy/1.jpg"
import StepTwo from "../../public/howtobuy/2.jpg"
import StepThree from "../../public/howtobuy/3.jpg"
import StepFour from "../../public/howtobuy/4.jpg"
import {makeTitle} from "../../utils/helpers";
import Head from "next/head";

const HowToBuy = () => {
    return (
        <Fragment>
            <Head>
                <title>{makeTitle("How to Buy")}</title>
            </Head>
            <Container>
                <div className="my-3">
                    <Row>
                        <Col lg={2}>
                            <h2 className="text-capitalize font-30 font-jost fw-bold pb-3">step 1 :</h2>
                        </Col>
                        <Col lg={10}>
                            <Image src={StepOne} alt="stepone" className="img-fluid shadow step-one"/>
                        </Col>
                    </Row>
                </div>
                <div className="my-3">
                    <Row>
                        <Col lg={2}>
                            <h2 className="text-capitalize font-30 font-jost fw-bold pb-3">step 2 :</h2>
                        </Col>
                        <Col lg={10}>
                            <Image src={StepTwo} alt="stepone" className="img-fluid shadow step-one"/>
                        </Col>
                    </Row>
                </div>
                <div className="my-3">
                    <Row>
                        <Col lg={2}>
                            <h2 className="text-capitalize font-30 font-jost fw-bold pb-3">step 3 :</h2>
                        </Col>
                        <Col lg={10}>
                            <Image src={StepThree} alt="stepone" className="img-fluid shadow step-one"/>
                        </Col>
                    </Row>
                </div>
                <div className="my-3">
                    <Row>
                        <Col lg={2}>
                            <h2 className="text-capitalize font-30 font-jost fw-bold pb-3">step 4 :</h2>
                        </Col>
                        <Col lg={10}>
                            <Image src={StepFour} alt="stepone" className="img-fluid shadow step-one"/>
                        </Col>
                    </Row>
                </div>
            </Container>
        </Fragment>
    )
}

export default HowToBuy