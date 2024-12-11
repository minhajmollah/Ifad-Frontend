import React, {Fragment, useState} from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {showErrorNotification, showSuccessTimerNotification} from "../Modules/helper/notificationHelper";
import axios from "../../utils/axios";

const ChangePasswordTab = () => {
  const [myPassword, setMyPassword] = useState({
    current_password: "",
    password: "",
    password_confirmation: ""
  });

  const handleChange = (e) => {
    setMyPassword({
      ...myPassword,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`/ecom/change-password`, {
        current_password: myPassword.current_password,
        password: myPassword.password,
        password_confirmation: myPassword.password_confirmation
      }).then((res) => {
        showSuccessTimerNotification("", res.data.message);
      });

      setMyPassword({
        current_password: "",
        password: "",
        password_confirmation: ""
      });
    } catch (err) {
      showErrorNotification("", err?.response?.data?.message);
    }
  }

  return (
      <Fragment>
        <h1 className="text-capitalize font-32 fw-bolder font-jost pb-4 "></h1>
        <Row>
          <Col lg={8}>
            <Form onSubmit={handleSubmit} autoComplete="off">
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Old Password <span className="text-danger">*</span></Form.Label>
                <Form.Control
                    name='current_password'
                    value={myPassword.current_password}
                    type="password"
                    required={true}
                    placeholder="Enter your old password"
                    className="rounded-0 form-deco form-padd"
                    onChange={handleChange}/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>New Password <span className="text-danger">*</span></Form.Label>
                <Form.Control
                    name='password'
                    value={myPassword.password}
                    type="password"
                    required={true}
                    placeholder="Enter new password"
                    className="rounded-0 form-deco form-padd"
                    onChange={handleChange}/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Confirm Password <span className="text-danger">*</span></Form.Label>
                <Form.Control
                    name='password_confirmation'
                    value={myPassword.password_confirmation}
                    type="password"
                    required={true}
                    placeholder="Enter confirm password"
                    className="rounded-0 form-deco form-padd"
                    autoComplete="new-password"
                    onChange={handleChange}/>
              </Form.Group>
              <Button type="submit" variant="primary"
                      className="text-capitalize font-18 px-5 mb-4 user-sub-btn rounded-0 font-jost">save</Button>{" "}
            </Form>
          </Col>
        </Row>
      </Fragment>
  )
}

export default ChangePasswordTab