import React from "react";
import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";
import Image from "next/image";
import FeaturedOffer from "../../../public/offerone.jpg";
import FeaturePone from "../../../public/alloffers/chips/chips3.png";
import Button from "react-bootstrap/Button";
import { AiOutlineShoppingCart } from "react-icons/ai";

const FeatureProducts = () => {
	
	return (
		<>
			<section className="feature-product-header">
				<div className="container p-0">
					<div className="header-title mt-4 mb-4 position-relative">
						<h1 className="text-center font-24 text-capitalize font-inter py-3">Feature Products</h1>
						<Link href="#">
							<div className="d-flex justify-content-center combo-btn bg-white rounded-pill px-3 py-2 position-absolute">
								<p className=" font-16 fw-semibold">View all</p>
								<BsArrowRight className="arrow ms-2" />
							</div>
						</Link>
					</div>
				</div>
			</section>

			<section className="feature-product-content">
				<div className="container p-0">
					<div className="d-flex feature-content">
						<div className="col-lg-4 col-md-4 ps-0 pe-3">
							<Image src={FeaturedOffer} alt="Picture of the author" className="feature-img" />
						</div>
						<div className="col-lg-8 col-md-8">
							<div className="row">
								<div className="col-lg-4 col-md-4">
									<div className="">
										<div className="card rounded-0 shadow mb-3 border-0" >
											<div className="combo-img-bg position-relative">
												<Image src={FeaturePone} className="feature-card-img mt-4 mb-4" alt="..." />
												<div className="position-absolute offer-token text-center">
													<span className="text-white veri-align fw-semibold font-14 pt-2">-30%</span>
												</div>
											</div>
											<div className="card-body text-center">
												<h5 className="card-title text-capitalize font-inter font-14">Pillow Chips</h5>
												<p className="card-text pb-2 text-capitalize fw-semibold font-13">price: 100/-</p>
												<Button className="text-dark text-center rounded-0 combo-add-cart mt-2 mb-2 text-uppercase fw-semibold">
													<span className="d-flex text-center font-14 pe-0">
														<AiOutlineShoppingCart className="pt-1 pe-1" size={"20px"} />
														add to cart
													</span>
												</Button>
											</div>
										</div>
									</div>
								</div>

								<div className="col-lg-4 col-md-4">
									<div className="">
										<div className="card rounded-0 shadow mb-3 border-0" >
											<div className="combo-img-bg position-relative">
												<Image src={FeaturePone} className="feature-card-img mt-4 mb-4" alt="..." />
												<div className="position-absolute offer-token text-center">
													<span className="text-white veri-align fw-semibold font-14 pt-2">-30%</span>
												</div>
											</div>
											<div className="card-body text-center">
												<h5 className="card-title text-capitalize font-inter font-14">Pillow Chips</h5>
												<p className="card-text pb-2 text-capitalize fw-semibold font-13">price: 100/-</p>
												<Button className="text-dark text-center rounded-0 combo-add-cart mt-2 mb-2 text-uppercase fw-semibold">
													<span className="d-flex text-center font-14 pe-0">
														<AiOutlineShoppingCart className="pt-1 pe-1" size={"20px"} />
														add to cart
													</span>
												</Button>
											</div>
										</div>
									</div>
								</div>

								<div className="col-lg-4 col-md-4">
									<div className="">
										<div className="card rounded-0 shadow mb-3 border-0" >
											<div className="combo-img-bg position-relative">
												<Image src={FeaturePone} className="feature-card-img mt-4 mb-4" alt="..." />
												<div className="position-absolute offer-token text-center">
													<span className="text-white veri-align fw-semibold font-14 pt-2">-30%</span>
												</div>
											</div>
											<div className="card-body text-center">
												<h5 className="card-title text-capitalize font-inter font-14">Pillow Chips</h5>
												<p className="card-text pb-2 text-capitalize fw-semibold font-13">price: 100/-</p>
												<Button className="text-dark text-center rounded-0 combo-add-cart mt-2 mb-2 text-uppercase fw-semibold">
													<span className="d-flex text-center font-14 pe-0">
														<AiOutlineShoppingCart className="pt-1 pe-1" size={"20px"} />
														add to cart
													</span>
												</Button>
											</div>
										</div>
									</div>
								</div>

								<div className="col-lg-4 col-md-4">
									<div className="">
										<div className="card rounded-0 shadow mb-3 border-0" >
											<div className="combo-img-bg position-relative">
												<Image src={FeaturePone} className="feature-card-img mt-4 mb-4" alt="..." />
												<div className="position-absolute offer-token text-center">
													<span className="text-white veri-align fw-semibold font-14 pt-2">-30%</span>
												</div>
											</div>
											<div className="card-body text-center">
												<h5 className="card-title text-capitalize font-inter font-14">Pillow Chips</h5>
												<p className="card-text pb-2 text-capitalize fw-semibold font-13">price: 100/-</p>
												<Button className="text-dark text-center rounded-0 combo-add-cart mt-2 mb-2 text-uppercase fw-semibold">
													<span className="d-flex text-center font-14 pe-0">
														<AiOutlineShoppingCart className="pt-1 pe-1" size={"20px"} />
														add to cart
													</span>
												</Button>
											</div>
										</div>
									</div>
								</div>

								<div className="col-lg-4 col-md-4">
									<div className="">
										<div className="card rounded-0 shadow mb-3 border-0" >
											<div className="combo-img-bg position-relative">
												<Image src={FeaturePone} className="feature-card-img mt-4 mb-4" alt="..." />
												<div className="position-absolute offer-token text-center">
													<span className="text-white veri-align fw-semibold font-14 pt-2">-30%</span>
												</div>
											</div>
											<div className="card-body text-center">
												<h5 className="card-title text-capitalize font-inter font-14">Pillow Chips</h5>
												<p className="card-text pb-2 text-capitalize fw-semibold font-13">price: 100/-</p>
												<Button className="text-dark text-center rounded-0 combo-add-cart mt-2 mb-2 text-uppercase fw-semibold">
													<span className="d-flex text-center font-14 pe-0">
														<AiOutlineShoppingCart className="pt-1 pe-1" size={"20px"} />
														add to cart
													</span>
												</Button>
											</div>
										</div>
									</div>
								</div>

								<div className="col-lg-4 col-md-4">
									<div className="">
										<div className="card rounded-0 shadow mb-3 border-0" >
											<div className="combo-img-bg position-relative">
												<Image src={FeaturePone} className="feature-card-img mt-4 mb-4" alt="..." />
												<div className="position-absolute offer-token text-center">
													<span className="text-white veri-align fw-semibold font-14 pt-2">-30%</span>
												</div>
											</div>
											<div className="card-body text-center">
												<h5 className="card-title text-capitalize font-inter font-14">Pillow Chips</h5>
												<p className="card-text pb-2 text-capitalize fw-semibold font-13">price: 100/-</p>
												<Button className="text-dark text-center rounded-0 combo-add-cart mt-2 mb-2 text-uppercase fw-semibold">
													<span className="d-flex text-center font-14 pe-0">
														<AiOutlineShoppingCart className="pt-1 pe-1" size={"20px"} />
														add to cart
													</span>
												</Button>
											</div>
										</div>
									</div>
								</div>
								
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default FeatureProducts;
