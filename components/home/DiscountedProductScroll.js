import React, {Fragment, useEffect, useState} from "react";
import Slider from "react-slick";
import Link from "next/link";
import {BsArrowRight} from "react-icons/bs";
import {getStoragePath} from "../../utils/helpers";
import {fetchDiscountedInventories} from "../../services/InventoryServices";
import ProductCard from "../common/ProductCard";

const DiscountedProductScroll = ({title}) => {

    const [inventories, setInventories] = useState([]);

    // fetch
    useEffect(() => {
        fetchDiscountedInventories({
            paginate: 'no'
        }).then(response => {
            if (response?.data) {
                setInventories(response.data);
            }
        });
    }, []);

    var settings = {
        dots: false,
        infinite: true,
        speed: 2000,
        autoplay: true,
        autoplaySpeed: 2500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrow: true,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
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
        <Fragment>
            <section className="combo-pack">

                {/*Title Bar*/}
                <div className="container border-top m- p-0">
                    <div className="header-title mt-4 mb-3 position-relative rounded">
                        <h1 className="text-center font-24 text-capitalize font-inter py-3 combo-title">{title}</h1>
                        <Link href={`/discounted`}>
                            <div
                                className="d-flex justify-content-center combo-btn bg-white px-3 py-2 position-absolute rounded-pill">
                                <p className=" font-16 fw-semibold view-all">View all</p>
                                <BsArrowRight className="arrow ms-2"/>
                            </div>
                        </Link>
                    </div>
                </div>

                {/*Scroll View*/}
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-12 col-md-12 p-0 slider-primary">
                            <Slider {...settings}>
                                {inventories.map((inventory, key) => {
                                    return (
                                        <div className="mt-0" key={key}>
                                            <div className="ms-3 me-3 mb-3">
                                                <ProductCard
                                                    id={inventory.id}
                                                    categoryId={inventory?.product.category_id}
                                                    title={inventory.title}
                                                    salePrice={inventory.sale_price}
                                                    offerPrice={inventory.offer_price}
                                                    offerStart={inventory.offer_start}
                                                    offerEnd={inventory.offer_end}
                                                    variants={inventory.inventory_variants}
                                                    imagePath={
                                                        inventory?.image
                                                            ? getStoragePath(`inventory-image/${inventory?.image}`)
                                                            : getStoragePath(`product-image/${inventory?.product?.image}`)
                                                    }
                                                    viewLink={`/product/${inventory.id}`}
                                                    isTimer={true}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </Slider>
                        </div>
                    </div>
                </div>
            </section>
        </Fragment>
    );
};

export default DiscountedProductScroll;
