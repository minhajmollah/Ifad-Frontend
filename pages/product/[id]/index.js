import React, {Fragment, useEffect, useState} from "react";
import {FaHeart} from "react-icons/fa";
import ImageSection from "../../../components/product/ImageSection";
import ProductDescription from "../../../components/product/ProductDescription";
import {fetchInventory} from "../../../services/InventoryServices";
import {useRouter} from "next/router";
import StarRatings from "react-star-ratings";
import moment from "moment";
import {syncWishlist, wishlistStatus} from "../../../services/WishlistServices";
import {getStoragePath, makeTitle, tostify} from "../../../utils/helpers";
import {toast} from "react-toastify";
import {isLoggedIn} from "../../../utils/auth";
import Button from "react-bootstrap/Button";
import {AiOutlineMinus, AiOutlinePlus} from "react-icons/ai";
import {useDispatch, useSelector} from "react-redux";
import {SET_CART_ITEM} from "../../../store/slices/CartSlice";
import {randomInt} from "next/dist/shared/lib/bloom-filter/utils";
import Timer from "../../../components/common/Timer";
import Head from "next/head";
import {BsCartCheck, BsFillCartXFill} from "react-icons/bs";

const SingleInventoryPage = () => {
    const dispatch = useDispatch();

    const router = useRouter();
    const {id} = router.query;

    const cart = useSelector((state) => state.cart);

    const [inventory, setInventory] = useState({});
    const [isWishlist, setIsWishlist] = useState(false);
    const [isRunningOffer, setIsRunningOffer] = useState(false);

    const [quantity, setQuantity] = useState(1);

    const incQuantity = (event) => {
        event.preventDefault()
        setQuantity(quantity + 1);
    }

    const decQuantity = (event) => {
        event.preventDefault()

        if (quantity > 1) {
            setQuantity(quantity - 1);
        } else {
            alert("Minimum quantity 1")
            setQuantity(1);
        }
    }

    useEffect(() => {
        if (id) {
            fetchInventory(id).then((response) => {
                if (response?.data) {
                    const inventory = response.data;

                    setInventory(inventory);

                    const today = moment().format('YYYY-MM-DD');
                    const myOfferStart = inventory.offer_start ? moment(inventory.offer_start).format('YYYY-MM-DD') : null;
                    const myOfferEnd = inventory.offer_end ? moment(inventory.offer_end).format('YYYY-MM-DD') : null;

                    if (inventory?.offer_price) {
                        if (myOfferStart !== null && myOfferEnd !== null) {
                            setIsRunningOffer(myOfferStart <= today && myOfferEnd >= today);
                        } else {
                            setIsRunningOffer(true);
                        }
                    }
                }
            });
        }
    }, [id]);

    useEffect(() => {
        if (inventory?.id && isLoggedIn()) {
            wishlistStatus(inventory?.id).then((response) => {
                if (response?.data) {
                    setIsWishlist(response?.data?.favourite)
                }
            });
        }
    }, [inventory?.id]);

    const handleFavourite = () => {
        syncWishlist({
            inventory_id: inventory?.id
        }).then((response) => {
            if (response?.data) {
                tostify(toast, 'success', response);

                if (response?.data?.data) {
                    setIsWishlist(response?.data?.data?.favourite)
                }
            }
        });
    };

    const handleAddToCart = (event, inventory, buyNow = false) => {
        event.preventDefault();

        try {

            if (!quantity) {
                tostify(toast, 'warning', {
                    message: "Quantity shouldn't empty!"
                });
                return false;
            }

            const unitPrice = isRunningOffer ? inventory.offer_price : inventory.sale_price;

            dispatch(SET_CART_ITEM({
                id: randomInt(11111111, 999999999),
                inventory_id: inventory.id,
                quantity: quantity,
                unit_price: unitPrice,
                total: quantity * unitPrice,

                type: 'product',
                sku: inventory.sku,
                title: inventory.title,
                category_name: inventory?.product?.category?.name,
                sub_category_name: inventory?.product?.sub_category?.name,
                image: inventory?.image
                    ? getStoragePath(`inventory-image/${inventory?.image}`)
                    : getStoragePath(`product-image/${inventory?.product?.image}`),
                variations: '',
                variant_id: inventory.inventory_variants[0].variant.id,
                variant_name: inventory.inventory_variants[0].variant.name,
                variant_quantity: inventory.inventory_variants[0].variant_option.name
            }));

            tostify(toast, 'success', {
                message: "Added to Cart"
            });

            setQuantity(1);

            if (buyNow) {
                setTimeout(() => {
                    router.push('/checkout');
                }, 2000);
            }
        } catch (err) {
            tostify(toast, 'warning', {
                message: err.message
            });
        }
    }

    return (
        <Fragment>
            <Head>
                <title>{makeTitle(inventory?.title || "Product")}</title>
            </Head>
            <section className="view-single-pro">
                {inventory?.product?.lifestyle_image && (
                    <div className="product-banner">
                        <img src={getStoragePath(`product-image/${inventory?.product?.lifestyle_image}`)} alt=""
                             className="product-banner"/>
                    </div>
                )}
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-6">
                            <div className="mt-5">
                                <ImageSection inventory={inventory} className="sec-height"/>
                            </div>
                        </div>

                        <div className="col-lg-6 col-md-6 ps-5">
                            <div className="border-bottom">
                                <h3 className="mt-5 color font-jost display-6 fw-bolder text-capitalize">
                                    {inventory?.title}
                                </h3>
                                <div className="d-flex justify-content-start align-items-center mb-3 mt-2">
                                    <StarRatings
                                        rating={parseInt(inventory?.star_ratting || 0)}
                                        starRatedColor="orange"
                                        numberOfStars={5}
                                        starDimension="20px"
                                        starSpacing="1px"
                                        name='rating'
                                    />
                                    <p className="text-secondary ps-2 fw-bold">
                                        ( {inventory?.reviews_count} review )
                                    </p>
                                </div>
                                <p className="font-lato font-20 text-dark mb-3">
                                    {isRunningOffer ? (
                                        <Fragment>
                                            <del>
                                                Price: {inventory?.sale_price} Tk.
                                            </del>
                                            <br/>
                                            Offer Price: {inventory?.offer_price} Tk.
                                        </Fragment>
                                    ) : (
                                        <Fragment>
                                            Price: {inventory?.sale_price} Tk.
                                        </Fragment>
                                    )}
                                </p>
                            </div>

                            {inventory?.inventory_variants && (
                                <div className="variation-infos">
                                    <table className="table table-bordered">
                                        <tbody>
                                        {inventory.inventory_variants.map((item, key) => (
                                            <tr key={key}>
                                                <td width={250}>{item?.variant?.name}</td>
                                                <td className="d-flex">
                                                    {item?.variant_option?.name}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            <div className="d-flex justify-content-start align-items-center counter mt-3">
                                <p className="text-capitalize pe-3 font-lato">quantity :</p>

                                <div
                                    className="d-flex justify-content-between align-items-center border border-secondary rounded-0 counter">
                                    <Button onClick={(event) => decQuantity(event)}
                                            className="button-two border-0 ms-2">
                                        <AiOutlineMinus className="text-dark minus-icon"/>
                                    </Button>

                                    <h2 className="px-4 font-14 count-padding">
                                        {quantity}
                                    </h2>

                                    <Button onClick={(event) => incQuantity(event)}
                                            className="button-one border-0 me-2">
                                        <AiOutlinePlus className="text-dark plus-icon"/>
                                    </Button>
                                </div>
                            </div>

                            <div className="d-flex justify-content-start align-items-center counter mt-4">
                                {inventory?.stock_quantity > 0 ? (
                                    <h4 className="text-success font-bold d-flex justify-content-center align-items-center">
                                        <BsCartCheck className="me-2"/> In Stock ({inventory?.stock_quantity})
                                    </h4>
                                ) : (
                                    <h4 className="text-danger font-bold d-flex justify-content-center align-items-center">
                                        <BsFillCartXFill className="me-2"/> Not In Stock
                                    </h4>
                                )}
                            </div>

                            <div className="d-flex justify-content-start counter mt-4 mb-4">
                                {isLoggedIn() && (
                                    <div className="border border-success px-2">
                                        <FaHeart
                                            className={`mt-1 cursor-pointer favourite-icon ${isWishlist ? 'favourite-icon-onclick' : 'favourite-icon'}`}
                                            onClick={(event) => handleFavourite(event)}
                                        />
                                    </div>
                                )}
                                <div className="ms-2">
                                    <button type="button"
                                            className="btn btn-success buy-btn rounded-0 text-capitalize px-4 font-lato"
                                            onClick={(event) => handleAddToCart(event, inventory, true)}
                                    >
                                        buy now
                                    </button>
                                </div>
                                <div className="ms-2">
                                    <button
                                        type="button"
                                        className="btn btn-warning buy-btn2 rounded-0 text-capitalize px-4 font-lato"
                                        onClick={(event) => handleAddToCart(event, inventory)}
                                    >
                                        add to cart
                                    </button>
                                </div>
                            </div>

                            {/*Timer*/}
                            {(isRunningOffer && inventory?.offer_end) && (
                                <div className="offer-countdown mb-4">
                                    <div className="fs-6 mb-1">Hurry up! Offer is ongoing.</div>
                                    <div
                                        className="fs-2 fw-light border-2 border-warning d-inline-block px-3 py-2 text-center"
                                        style={{padding: "10px 0 0", textAlign: "left", fontWeight: "bold"}}>
                                        <Timer startDate={null} endDate={inventory?.offer_end}/>
                                    </div>
                                </div>
                            )}
                            { /*
                        {/*Video*
                        {inventory?.product?.product_video_path && (
                            <div className="product-video mb-4">
                                <ReactPlayer
                                    controls={true}
                                    url={getStoragePath('product-video/' + inventory.product.product_video_path)}
                                />
                            </div>
                        )}

                        {/*Brochure*
                        {inventory?.product?.product_brochure && (
                            <div className="product-brochure mb-5">
                                <a href={getStoragePath('product-brochure/' + inventory.product.product_brochure)}
                                   className="btn btn-outline-dark rounded-0 w-50" target="_blank">
                                    <div className="d-flex flex-column justify-content-center">
                                        <div className="mb-1 p-1">
                                            <img src="https://cdn-icons-png.flaticon.com/512/543/543829.png"
                                                 width={35} className="d-inline" alt="icon"/>
                                        </div>
                                        <span className="fs-5">Product Brochure</span>
                                    </div>
                                </a>
                            </div>
                        )}

                        */}
                        </div>

                        <ProductDescription inventory={inventory} className="mb-5 tabs"/>
                    </div>
                </div>
            </section>
        </Fragment>
    );
};

export default SingleInventoryPage;
