import Slider from "react-slick";
import {useEffect, useState} from "react";
import {fetchBrands} from "../../services/BrandServices";
import {getStoragePath} from "../../utils/helpers";

const BrandSection = () => {

	const [brands, setBrands] = useState([]);

	// fetch
	useEffect(() => {
		fetchBrands().then((response) => {
			if (response?.data) {
				setBrands(response.data?.[0]?.content_item);
			}
		});
	}, []);

	var settings = {
		dots: true,
		infinite: true,
		speed: 1000,
		autoplay: true,
		autoplaySpeed: 3000,
		slidesToShow: 5,
		slidesToScroll: 1,
		arrow: false,
		responsive: [
			{
				breakpoint: 992,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 2,
					infinite: true,
				},
			},
			{
				breakpoint: 767,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
				},
			},

			{
				breakpoint: 576,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
		],
	};

	return (
		<section className="brands-part pb-4">
			<div className="container">
				<div className="row">
					<h1 className="text-uppercase pt-5 fw-bold text-center font-inter fs-1 pb-3">brands</h1>
					<Slider {...settings}>
						{brands?.map((brand, key) => (
							<div key={key} className="d-flex justify-content-center">
								<img src={getStoragePath(brand.item_image)} alt={brand.item_name}
									 className="pt-3 brands-size"/>
							</div>
						))}
					</Slider>
				</div>
			</div>
		</section>
	);
};

export default BrandSection;
