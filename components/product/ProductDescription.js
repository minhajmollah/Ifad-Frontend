import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import React, {Fragment, useEffect, useState} from "react";
import StarRatings from "react-star-ratings";
import {hasInventoryReviewAbility, saveReview, fetchInventoryReviews} from "../../services/ReviewServices";
import {tostify} from "../../utils/helpers";
import {toast} from "react-toastify";

const ProductDescription = ({inventory}) => {
	const [key, setKey] = useState("home");
	const [reviewAbility, setReviewAbility] = useState(false);
	const [reviews, setReviews] = useState([]);

	const [formData, setFormData] = useState({
		ratting_number: '',
		comments: ''
	});

	const hasInventoryReviewAbilityStatus = (inventoryId) => {
		hasInventoryReviewAbility(inventoryId).then((response) => {
			if (response?.data) {
				setReviewAbility(response.data.capability);
			}
		});
	}

	useEffect(() => {
		if (inventory?.id) {
			hasInventoryReviewAbilityStatus(inventory.id);
		}
	}, [inventory?.id])

	useEffect(() => {
		if (inventory?.id) {
			fetchInventoryReviews(inventory.id).then(response => {
				setReviews(response?.data || [])
			});
		}
	}, [inventory?.id])

	// console.log(reviewAbility, reviews)

	const handleChange = (event) => {
		event.preventDefault();

		setFormData({
			...formData,
			[event.target.name]: event.target.value
		});
	}

	const handleChangeRating = (value) => {
		setFormData({
			...formData,
			ratting_number: value
		});
	}

	const handleSubmit = (event) => {
		event.preventDefault();

		if (!formData?.ratting_number /*|| !formData?.comments*/) {
			tostify(toast, 'warning', {
				message: "Invalid review data!"
			});
			return false
		}

		saveReview({
			ratting_number: formData?.ratting_number,
			// comments: formData?.comments,
			inventory_id: inventory?.id,
		}).then((response) => {
			tostify(toast, 'success', response);
			hasInventoryReviewAbilityStatus(inventory.id);
		});
	}

	// const averageReview = reviews?.reduce((acc, item) => {
	// 	return acc + item?.ratting_number || 0
	// }, 0) / (reviews?.length || 1)

	return inventory?.id && (
		<Fragment>
			<Tabs id="controlled" activeKey={key} onSelect={(k) => setKey(k)} className="mb-3 border-0">
				<Tab eventKey="home" title="Description" className="pb-5 ps-0 border-0 font-lato">
					<p className="font-16 font-lato border-top pt-2 border-warning text-justify">
						{inventory?.product?.product_short_desc}
					</p>
				</Tab>
				{/* <Tab eventKey="spacification" title="Spacification" className="pb-5 font-lato">
					<div className="detail-table border-top border-warning pt-3">
						{inventory?.product?.product_long_desc}
					</div>
				</Tab> */}
				<Tab eventKey="review" title="Customer Review" className="pb-5 font-lato">
					<div className="border-top border-warning  pt-3">
						<div className="row">
							<div className="col-lg-4">
								<div className="d-flex justify-content-start w-100">
									<h2 className="font-48 text-warning pe-2 fw-bold font-inter">5.0</h2>
									<div className="">
										<p className="text-capitalize ps-2">avarage rating</p>
										<div className="d-flex justify-content-start align-items-center">
											<StarRatings
												rating={parseInt(inventory?.star_ratting || 0)}
												starRatedColor="orange"
												numberOfStars={5}
												starDimension="20px"
												starSpacing="0px"
												name='rating'
											/>
											<p className="text-secondary ps-2">
												( {inventory?.reviews_count || 0} review )
											</p>
										</div>
									</div>
								</div>
							</div>
							<div className="col-lg-8">
								{reviewAbility ? (
									<form onSubmit={(event) => handleSubmit(event)}>
										<div className="">
											<p className="text-capitalize font-16">
												give your review *
											</p>

											<StarRatings
												rating={parseInt(formData?.ratting_number || 0)}
												starRatedColor="orange"
												starHoverColor="orange"
												numberOfStars={5}
												starDimension="40px"
												starSpacing="2px"
												name='rating'
												changeRating={handleChangeRating}
											/>

											<br/>
											<br/>

											<label htmlFor="textarea" className="form-label font-16">
												Your comment *
											</label>
											<div className="form-floating">
												<textarea className="form-control rounded-0" name="comments"
														  value={formData?.comments}
														  placeholder="Leave a comment here" id="textarea"
														  style={{height: "150px"}}
														  onChange={(event) => handleChange(event)}>{formData?.comments}</textarea>
												<label htmlFor="floatingTextarea2">Comments</label>
											</div>
											<button type="submit"
													className="btn btn-primary submit-btn rounded-0 mt-3 px-5 py-2">
												Submit
											</button>
										</div>
									</form>
								) : (
									<h3 className="mt-3">
										You are not eligible to post a review,<br/> Thank you.
									</h3>
								)}
							</div>
						</div>

						<div className="border-top pt-4 mt-4">
							<h4 className="font-24 fw-bold mb-4">Customer Reviews</h4>
							{reviews && reviews.length > 0 ? (
								reviews.map((review, index) => (
									<div key={index} className="border-bottom pb-3 mb-3">
										<div className="align-items-center mb-2">
											<h5 className="mb-0 me-2">{review?.customer?.name || ""}</h5>
											<StarRatings
												rating={review?.ratting_number}
												starRatedColor="orange"
												numberOfStars={5}
												starDimension="20px"
												starSpacing="0px"
												name={`review-rating-${index}`}
											/>
											<p>{review?.comments || ""}</p>
											
										</div>
										<p className="text-secondary">{review.comment}</p>
									</div>
								))
							) : (
								<p className="text-secondary">No reviews yet!</p>
							)}
						</div>
					</div>
				</Tab>
			</Tabs>
		</Fragment>
	);
};

export default ProductDescription;
