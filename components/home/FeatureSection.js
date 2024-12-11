import Container from "react-bootstrap/Container";
import {MdOutlineVerifiedUser} from "react-icons/md";
import {RiServiceLine} from "react-icons/ri";
import {BsTruck} from "react-icons/bs";
import {IoIosPricetags} from "react-icons/io";

const FeatureSection = () => {
	return (
			<section className="support py-4">
				<Container>
					<div className="row">
						<div className="col-lg-3 col-md-3 col-sm-6">
							<div className="support-div mb-4 border rounded">
								<div className="py-4 shadow rounded">
									<MdOutlineVerifiedUser className="support-icons mnicons"/>
									<p className="text-capitalize text-center font-16 fw-semibold">
										100% percent secured
									</p>
								</div>
							</div>
						</div>
						<div className="col-lg-3 col-md-3 col-sm-6">
							<div className="support-div mb-4 border rounded ">
								<div className="py-4 shadow rounded">
									<RiServiceLine className="support-icons"/>
									<p className="text-capitalize text-center font-16 fw-semibold">
										24 hours / 7days support
									</p>
								</div>
							</div>
						</div>
						<div className="col-lg-3 col-md-3 col-sm-6 ">
							<div className="support-div mb-4 border rounded ">
								<div className="py-4 shadow rounded">
									<BsTruck className="support-icons"/>
									<p className="text-capitalize text-center font-16 fw-semibold">
										On Time Delivery
									</p>
								</div>
							</div>
						</div>
						<div className="col-lg-3 col-md-3 col-sm-6 ">
							<div className="support-div mb-4 border rounded">
								<div className="py-4 shadow rounded">
									<IoIosPricetags className="support-icons"/>
									<p className="text-capitalize text-center font-16 fw-semibold">
										best price guaranteed
									</p>
								</div>
							</div>
						</div>
					</div>
				</Container>
			</section>
	);
};

export default FeatureSection;