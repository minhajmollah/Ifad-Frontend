import React, {useEffect, useState} from "react";
import Row from "react-bootstrap/Row";
import {getStoragePath, tostify} from "../../utils/helpers";
import ProductCard from "../common/ProductCard";
import {deleteWishlist, fetchWishlist} from "../../services/WishlistServices";
import Col from "react-bootstrap/Col";
import {toast} from "react-toastify";

const WishlistTab = () => {
	const [myWishlist, setMyWishList] = useState([]);

	const fetchWishlistData = async () => {
		fetchWishlist().then((response) => {
			if (response?.data?.data) {
				setMyWishList(response.data.data);
			}
		});
	}

	useEffect(() => {
		fetchWishlistData();
	}, []);

	const handleRemove = (event, id) => {
		event.preventDefault();

		if (confirm("Are you sure?")) {
			deleteWishlist(id).then((response) => {
				if (response?.data?.message) {
					tostify(toast, 'success', response);

					fetchWishlistData();
				}
			});
		}
	}

	return (
		<Row>
			<h1 className="text-capitalize font-32 fw-bolder font-jost pb-4 ">Wish list</h1>
			{myWishlist.map((item, key) => (
				<Col lg={4} key={key} className="mb-3">
					<div className="text-end">
						<button className="btn btn-outline-danger btn-sm"
								onClick={(event) => handleRemove(event, item?.id)}>Remove
						</button>
					</div>
					<ProductCard
						id={item?.inventory?.id}
						title={item?.inventory?.title}
						salePrice={item?.inventory?.sale_price}
						offerPrice={item?.inventory?.offer_price}
						offerStart={item?.inventory?.offer_start}
						offerEnd={item?.inventory?.offer_end}
						variants={item?.inventory?.inventory_variants}
						imagePath={
							item?.inventory?.image
								? getStoragePath(`inventory-image/${item?.inventory?.image}`)
								: getStoragePath(`product-image/${item?.inventory?.product?.image}`)
						}
						viewLink={`/product/${item?.inventory?.id}`}
						cssClasses="category-product"
					/>
				</Col>
			))}
		</Row>
	);
};

export default WishlistTab;
