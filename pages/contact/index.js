import React, {Fragment, useState} from "react"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Form from "react-bootstrap/Form"
import Image from "next/image"
import {toast} from "react-toastify";
import ContactBanner from "../../public/contact.jpg"
import {TiLocationOutline} from "react-icons/ti";
import {MdOutlineEmail, MdOutlinePhoneForwarded} from "react-icons/md";
import ContactImg from "../../public/contact-img.jpg"
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Button from "react-bootstrap/Button";
import {makeTitle, tostify} from "../../utils/helpers";
import {sendContactForm} from "../../services/CommonServices";
import Head from "next/head";

const Contact = () => {
    const [isVerified, setIsVerified] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        subject: "",
        message: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // if (!isVerified) {
        //     tostify(toast, 'error', {
        //         message: 'reCaptcha submission failed'
        //     });
        //     return false;
        // }

        sendContactForm(formData).then((response) => {
            if (response?.data?.status) {
                tostify(toast, 'success', response)
            }

            setFormData({
                name: "",
                email: "",
                subject: "",
                message: ""
            });
        });
    }

    return (
        <Fragment>
            <Head>
                <title>{makeTitle("Contact Us")}</title>
            </Head>
            <section>
                <div className="terms-banner-div">
                    <Image src={ContactBanner} alt="" className="terms-banner"/>
                </div>
                <Container>
                    <Row>
                        <Col lg={4} md={4} sm={4}>
                            <div className="d-flex justify-content-center mt-5">
                                <TiLocationOutline className="font-40 theme-text"/>
                            </div>
                            <div className="text-center ">
                                <h3 className="font-20 font-poppins text-capitalize pt-3">Address</h3>
                                <p className="font-16 font-jost mb-5 contact-address">IFAD Tower, Plot # 7 (New),
                                    Tejgaon Industrial Area, Dhaka-1208</p>
                            </div>
                        </Col>
                        <Col lg={4} md={4} sm={4}>
                            <div className="d-flex justify-content-center mt-5">
                                <MdOutlineEmail className="font-40 theme-text"/>
                            </div>
                            <div className="text-center ">
                                <h3 className="font-20 font-poppins text-capitalize pt-3">email</h3>
                                <p className="font-16 font-jost mb-5 contact-address">ifadeshop@ifadgroup.com</p>
                            </div>
                        </Col>
                        <Col lg={4} md={4} sm={4}>
                            <div className="d-flex justify-content-center mt-5">
                                <MdOutlinePhoneForwarded className="font-40 theme-text"/>
                            </div>
                            <div className="text-center ">
                                <h3 className="font-20 font-poppins text-capitalize pt-3">phone</h3>
                                <p className="font-16 font-jost mb-5 contact-address">09612114444</p>
                            </div>
                        </Col>
                    </Row>
                </Container>

                <Container fluid>
                    <div className="contact-height">
                        <Row>
                            <Col lg={6} md={5} className="p-0">
                                <Image src={ContactImg} alt="contact-img" className="contact-image"/>
                            </Col>
                            <Col lg={6} md={7} className="form-height">
                                <h4 className="send-message text-center font-24 font-poppins text-capitalize pt-3">Send
                                    us a message</h4>
                                <div className="d-flex justify-content-center">
                                    <p className="text-center font-14 text-secondary w-80 font-poppins text-capitalize pt-3">
                                        Your email address will not be published. <br/>Required fields are marked *
                                    </p>
                                </div>
                                <div className="px-5">
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group className="mb-2" controlId="">
                                            <Form.Label>Name *</Form.Label>
                                            <Form.Control name="name" type="text" value={formData.name}
                                                          onChange={handleChange}
                                                          className="rounded-0 contact-form-focus"/>
                                        </Form.Group>
                                        <Form.Group className="mb-2" controlId="">
                                            <Form.Label>Email *</Form.Label>
                                            <Form.Control name="email" type="email" value={formData.email}
                                                          onChange={handleChange}
                                                          className="rounded-0 contact-form-focus"/>
                                        </Form.Group>
                                        <Form.Group className="mb-2" controlId="">
                                            <Form.Label>Mobile No. *</Form.Label>
                                            <Form.Control name="mobile" type="number" value={formData.mobile}
                                                          onChange={handleChange}
                                                          className="rounded-0 contact-form-focus"/>
                                        </Form.Group>
                                        <Form.Group className="mb-2" controlId="">
                                            <Form.Label>Subject</Form.Label>
                                            <Form.Control name="subject" type="text" value={formData.subject}
                                                          onChange={handleChange}
                                                          className="rounded-0 contact-form-focus"/>
                                        </Form.Group>
                                        <Form.Group className="mb-2" controlId="">
                                            <Form.Label>Message</Form.Label>
                                            <FloatingLabel controlId="floatingTextarea2" label="Comments">
                                                <Form.Control
                                                    name="message"
                                                    as="textarea"
                                                    placeholder="Leave a comment here"
                                                    style={{height: "100px"}}
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    className="rounded-0 contact-form-focus"
                                                />
                                            </FloatingLabel>
                                        </Form.Group>

                                        {/* <Form.Group className="mb-2" controlId="">
                                        <ReCAPTCHA onVerify={setIsVerified}/>
                                    </Form.Group> */}

                                        <Button variant="primary" type="submit"
                                                className="contact-form-btn font-16 rounded-0 px-5 py-2 mt-2 mb-4">
                                            Submit
                                        </Button>
                                    </Form>
                                </div>

                            </Col>
                        </Row>
                    </div>
                </Container>
            </section>
        </Fragment>

    )
}

export default Contact