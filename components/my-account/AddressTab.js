import React, {useEffect, useState} from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from 'react-bootstrap/Card';
import {MdDeleteOutline, MdEdit} from 'react-icons/md';
import {toast} from "react-toastify";
import {tostify} from "../../utils/helpers";
import {showErrorNotification, showSuccessNotification} from "../Modules/helper/notificationHelper";
import {
  deleteAddress,
  editAddress,
  fetchAddresses,
  saveAddress,
  updateDefaultBillingAddress,
  updateDefaultShippingAddress
} from "../../services/AddressServices";
import AddressModal from './AddressModal'

const AddressTab = () => {
  const [addresses, setAddresses] = useState([]);

  // fetch
  useEffect(() => {
    fetchAddresses().then((response) => {
      if (response?.data) {
        setAddresses(response.data);
      }
    });
  }, []);

  const defaultAddress = {
    id: null,
    title: "",
    name: "",
    address_line_1: "",
    address_line_2: "",
    division_id: "",
    district_id: "",
    upazila_id: "",
    postcode: "",
    phone: "",
    email: "",
  }

  const [myAddress, setMyAddress] = useState(defaultAddress);

  const handleChange = (e) => {
    setMyAddress({
      ...myAddress,
      [e.target.name]: e.target.value,
    })
  }

  const createAddress = async (e) => {
    e.preventDefault();
    // console.log(myAddress)
    // return

    const data = {
      id: myAddress.id,
      title: myAddress.title,
      name: myAddress.name,
      address_line_1: myAddress.address_line_1,
      address_line_2: myAddress.address_line_2,
      division_id: parseInt(myAddress.division_id),
      district_id: parseInt(myAddress.district_id),
      upazila_id: parseInt(myAddress.upazila_id),
      postcode: myAddress.postcode,
      phone: myAddress.phone,
      email: myAddress.email,
    };

    if (
        data.title === "" ||
        data.name === "" ||
        data.address_line_1 === "" ||
        data.division_id === "" ||
        data.district_id === "" ||
        data.upazila_id === "" ||
        data.postcode === "" ||
        data.phone === ""
    ) {
      tostify(toast, 'error', {
        message: 'Fields must not be empty!'
      });
      return;
    }

    // const isTitleExist = addresses.some(item => item.title == data.title);

    // if (isTitleExist) {
    //   tostify(toast, 'error', {data: {message: "Set unique title"}});
    //   // console.log("Set unique title!")
    //   return;
    // }

    if (isEditing) {
      try {
        editAddress(data).then((res) => {
          // const updatedAddress = addresses.map((item) => (item.id === data.id ? data : item));
          // setAddresses(updatedAddress);

          showSuccessNotification("Success", "Address updated.")

          fetchAddresses().then((response) => {
            if (response?.data) {
              setAddresses(response.data);
              setMyAddress(defaultAddress);
              handleClose();
            }
          });
        });
      } catch (err) {
        showErrorNotification("Error", err.message);
      }
    } else {
      if (addresses?.length === 0) {
        data.is_default_billing = 1;
        data.is_default_shipping = 1;
      }
      try {
        saveAddress(data).then((res) => {

          showSuccessNotification("Success", "Address saved.")

          fetchAddresses().then((response) => {
            if (response?.data) {
              setAddresses(response.data);
              setMyAddress(defaultAddress);
              handleClose();
            }
          });
        });
      } catch (err) {
        showErrorNotification("Error", err.message);
      }
    }
  }

  const handleDelete = (event, id) => {
    event.preventDefault();

    if (confirm("Are you sure?")) {
      deleteAddress(id).then((response) => {
        if (response?.data?.message) {
          tostify(toast, 'success', response);
          const updatedAddress = addresses.filter((item) => item.id !== id);
          setAddresses(updatedAddress)
        }
      });
    }
  }

  // modal
  const [show, setShow] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDefaultBilling = (id) => {
    updateDefaultBillingAddress(id);
    const updatedAddress = addresses.map((item) => (item.id === id ? {...item, is_default_billing: 1} : {
      ...item,
      is_default_billing: null
    }));
    setAddresses(updatedAddress);
  }

  const handleDefaultShipping = (id) => {
    updateDefaultShippingAddress(id);
    const updatedAddress = addresses.map((item) => (item.id === id ? {...item, is_default_shipping: 1} : {
      ...item,
      is_default_shipping: null
    }));
    setAddresses(updatedAddress);
  }

  return (
      <>
        <Row>
          <Col lg={6}>
            <h1 className="text-capitalize font-32 fw-bolder font-jost pb-4">Address</h1>
          </Col>
          <Col lg={6} className="address-col">
            <div className="d-flex justify-content-end">
              <Button
                  onClick={() => {
                    setIsEditing(false);
                    handleShow()
                    setMyAddress(defaultAddress)
                  }}
                  variant="primary"
                  className="text-capitalize rounded-0 nav-link active mb-4 p-2"
              >
                Add new address
              </Button>
            </div>
          </Col>
        </Row>

        <Row>
          {addresses &&
          addresses.length > 0 ? addresses.map((item, index) => (
              <Col md={6} className="mb-4" key={index}>
                <Card className="rounded-0" style={{width: '100%'}}>
                  <Card.Body>
                    <div className="d-flex justify-content-between">
                      <span className="c-tag text-white">{item.title}</span>
                      <div className="d-flex">
                        <MdEdit
                            onClick={() => {
                              setIsEditing(true);
                              handleShow()
                              setMyAddress(item)
                            }}
                            className="c-icon"
                        />
                        <MdDeleteOutline
                            onClick={(event) => handleDelete(event, item?.id)}
                            className="c-icon"
                        />
                      </div>
                    </div>
                    <Card.Text>
                      <span className="d-block">Name: {item.name}</span>
                      <span className="d-block">Address Line 1: {item.address_line_1}</span>
                      <span className="d-block">Address Line 2: {item.address_line_2}</span>
                      <span className="d-block">Post Code: {item.postcode}</span>
                      <span className="d-block">Phone: {item.phone}</span>
                      <span className="d-block">
                        Email: <span className="text-lowercase">{item.email}</span>
                      </span>
                    </Card.Text>
                    <div className="d-flex justify-content-start mt-3">
                      <Button
                          variant={item.is_default_billing ? "primary bg-primary" : "outline-secondary"}
                          className="btn btn-sm text-capitalize rounded-0 me-2 d-flex"
                          onClick={() => handleDefaultBilling(item.id)}
                      >
                        Default billing
                      </Button>
                      <Button
                          variant={item.is_default_shipping ? "primary bg-primary" : "outline-secondary"}
                          className="btn btn-sm text-capitalize rounded-0"
                          onClick={() => handleDefaultShipping(item.id)}
                      >
                        Default shipping
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
          )) : <h5>No address created, please create address.</h5>}

          <AddressModal
              show={show}
              handleClose={handleClose}
              handleShow={handleShow}
              myAddress={myAddress}
              handleChange={handleChange}
              createAddress={createAddress}
              isEditing={isEditing}
          />
        </Row>
      </>
  )
}

export default AddressTab