import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import {updateCustomer} from "../../services/AuthServices";
import {tostify} from "../../utils/helpers";
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import {API_URL} from "../../utils/constants";
import {SET_AUTH_DATA} from "../../store/slices/AuthSlice";

const UserInfoTab = () => {
	const dispatch = useDispatch();
	const router = useRouter();
	const {prev} = router.query;
	const auth = useSelector((state) => state.auth);

	const [errors, setErrors] = useState({});
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		date_of_birth: "",
		gender: "",
		phone_number: "",
		old_image: "",
		image: "",
	});

	useEffect(() => {
		if (auth) {
			setFormData({
				name: auth?.name,
				email: auth?.email,
				phone: auth?.phone,
				date_of_birth: auth?.date_of_birth,
				gender: auth?.gender,
				phone_number: auth?.phone_number,
				old_image: auth?.image,
			});
		}
	}, [auth])

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		})
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		setErrors({});

		updateCustomer({
			_method: 'PUT',
			name: formData.name,
			date_of_birth: formData.date_of_birth,
			gender: formData.gender,
      email: formData.email,
			phone_number: formData.phone_number,
			old_image: formData.old_image,
			image: formData.image,
		}, setErrors).then((response) => {
			if (response?.data?.message) {
				tostify(toast, 'success', response);

				const customer = response?.data?.data;

				if (customer) {
					dispatch(SET_AUTH_DATA(customer));

					setFormData({
						name: customer?.name,
						email: customer?.email,
						phone: customer?.phone,
						date_of_birth: customer?.date_of_birth,
						gender: customer?.gender,
						phone_number: customer?.phone_number,
						old_image: customer?.image,
					});

					if (prev && prev === "register") {
						router.push({
							pathname: '/my-account',
							query: {
								'tab': 'address'
							}
						});
					}
				}
			}
		});
	};

	const [selectedImage, setSelectedImage] = useState(null);

	const handleImageUpload = (event) => {
		const file = event.target.files[0];

		if (file) {
			const reader = new FileReader();

			reader.onload = (e) => {
				setSelectedImage(e.target.result);
			};

			reader.readAsDataURL(file);
		}
	}

	return (
		<div className="user-information">
			<Form onSubmit={handleSubmit}>
				<Row>
					<h1 className="text-capitalize fo nnt-32 fw-bolder font-jost pb-4 ">account information</h1>
					<Col lg={3}>
						<div className="d-flex justify-content-center">
							<Image
								// src={formData?.old_image ? `${API_URL}/${formData.old_image}` : '/user/man.png'}
								src={selectedImage ? selectedImage : formData?.old_image ? `${API_URL}/${formData.old_image}` : '/user/man.png'}
								alt="profile" height="200" weight="200" className="profile-picture mb-3"/>
						</div>
						<Form.Group controlId="formFile" className="mb-3">
							<Form.Control
								name="img"
								type="file"
								accept="image/*"
								className="rounded-0 form-deco"
								onChange={
									(e) => {
										setFormData({...formData, image: e.target.files[0]})
										handleImageUpload(e)
									}
								}
							/>
							<small className="text-muted text-lowercase">Max size 2MB and type jpg, png & gif
								format.</small>
							{errors?.image && (
								<p className="text-danger">{errors?.image}</p>
							)}
						</Form.Group>
					</Col>
					<Col lg={9}>
						<Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label>Full Name <span className="text-danger"> *</span></Form.Label>
							<Form.Control name="name" type="text" placeholder="Enter Full Name"
										  value={formData.name} onChange={handleChange}
										  className="form-padd rounded-0 form-deco" required={true}/>
						</Form.Group>
						<div className="row">
							<div className="col">
								<Form.Group className="mb-3" controlId="formBasicEmail">
									<Form.Label>Email<span className="text-danger"> *</span></Form.Label>
									<Form.Control name="email" type="email" value={formData.email} onChange={handleChange}
												  className="form-padd rounded-0 form-deco"
                          // readOnly={true}
												  // disabled={true}
                          />
								</Form.Group>
							</div>
							<div className="col">
								<Form.Group className="mb-3" controlId="formBasicEmail">
									<Form.Label>Phone<span className="text-danger"> *</span></Form.Label>
									<Form.Control name="phone_number" type="text" value={formData.phone_number} onChange={handleChange}
												  className="form-padd rounded-0 form-deco"
                          // readOnly={true}
												  // disabled={true}
                          />
								</Form.Group>
							</div>
						</div>
						<Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label htmlFor="" className="form-label text-capitalize">
								Date of Birth
								{/* <span className="text-danger"> *</span> */}
							</Form.Label>
							<Form.Control
								type="date"
								name="date_of_birth"
								value={formData?.date_of_birth}
								onChange={handleChange}
								className="form-padd rounded-0 form-deco"
								// required={true}
							/>
						</Form.Group>

						<Form.Group className="mb-3">
							<Form.Label>Gender</Form.Label>
							<Form.Select name="gender" value={formData.gender} onChange={handleChange}
										 aria-label="Default select example"
										 className="form-padd rounded-0 form-deco">
								<option> Select gender</option>
								<option value="Male">Male</option>
								<option value="Female">Female</option>
								<option value="Others">Others</option>
							</Form.Select>
						</Form.Group>

						{/* <Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label>Phone number<span className="text-danger"> *</span></Form.Label>
							<Form.Control name="phone_number" type="number" placeholder="Enter number"
										  value={formData.phone_number} onChange={handleChange}
										  className="form-padd rounded-0 form-deco" required={true}/>
						</Form.Group> */}
						<Button type="submit" variant="primary"
								className="text-capitalize font-18 px-5 mb-4 user-sub-btn rounded-0 font-lato">submit</Button>{" "}
					</Col>
				</Row>
			</Form>
		</div>
	);
};

export default UserInfoTab;
