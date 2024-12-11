import React, {Fragment, useEffect, useState} from "react";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import {Container} from "react-bootstrap";
import AddressTab from "../../components/my-account/AddressTab";
import {useRouter} from "next/router";
import withAuth from "../../utils/HOC/withAuth";
import UserInfoTab from "../../components/my-account/UserInfoTab";
import WishlistTab from "../../components/my-account/WishlistTab";
import OrdersTab from "../../components/my-account/OrdersTab";
import ChangePasswordTab from "../../components/my-account/ChangePasswordTab";
import {makeTitle} from "../../utils/helpers";
import Head from "next/head";

const MyAccountPage = () => {
    const router = useRouter();
    const {tab, order_status} = router.query;

    const [activeKey, setActiveKey] = useState('account-info');

    useEffect(() => {
        if (tab) {
            setActiveKey(tab);
        }
    }, [tab]);

    return (
        <Fragment>
            <Head>
                <title>{makeTitle("All Orders")}</title>
            </Head>
            <section>
                <Container>
                    <Col className="mt-5">
                        <Tab.Container id="left-tabs-example" activeKey={activeKey}>
                            <Row>
                                <Col sm={3} className="mb-5">
                                    <Nav variant="pills"
                                         className="flex-column float-start font-16 font-lato font-lato ">
                                        <Nav.Item>
                                            <Nav.Link eventKey="account-info" className="text-capitalize rounded-0"
                                                      onClick={() => {
                                                          router.push({
                                                              pathname: '/my-account',
                                                              query: {
                                                                  'tab': 'account-info'
                                                              }
                                                          });
                                                      }}>
                                                account information
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="wishlist" className="text-capitalize rounded-0"
                                                      onClick={() => {
                                                          router.push({
                                                              pathname: '/my-account',
                                                              query: {
                                                                  'tab': 'wishlist'
                                                              }
                                                          });
                                                      }}>
                                                wish list
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="order" className="text-capitalize rounded-0"
                                                      onClick={() => {
                                                          router.push({
                                                              pathname: '/my-account',
                                                              query: {
                                                                  'tab': 'order'
                                                              }
                                                          });
                                                      }}>
                                                my order
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="change-password" className="text-capitalize rounded-0"
                                                      onClick={() => {
                                                          router.push({
                                                              pathname: '/my-account',
                                                              query: {
                                                                  'tab': 'change-password'
                                                              }
                                                          });
                                                      }}>
                                                change password
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="address" className="text-capitalize rounded-0"
                                                      onClick={() => {
                                                          router.push({
                                                              pathname: '/my-account',
                                                              query: {
                                                                  'tab': 'address'
                                                              }
                                                          });
                                                      }}>
                                                Address
                                            </Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </Col>
                                <Col sm={9} className="mb-5">
                                    <Tab.Content>
                                        <Tab.Pane eventKey="account-info" className="text-capitalize font-16 font-lato">
                                            <UserInfoTab/>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="wishlist" className="text-capitalize font-16 font-lato">
                                            <WishlistTab/>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="order" className="text-capitalize font-16 font-lato">
                                            <OrdersTab orderStatus={order_status} />
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="change-password"
                                                  className="text-capitalize font-16 font-lato">
                                            <ChangePasswordTab/>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="address" className="text-capitalize font-16 font-lato">
                                            <AddressTab/>
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Col>
                            </Row>
                        </Tab.Container>
                    </Col>
                </Container>
            </section>
        </Fragment>
    )
}

export default withAuth(MyAccountPage);