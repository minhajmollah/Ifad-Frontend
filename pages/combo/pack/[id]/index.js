import React, {Fragment, useEffect, useState} from "react";
import {useRouter} from "next/router";
import moment from "moment";
import {getStoragePath, makeTitle, tostify} from "../../../../utils/helpers";
import {toast} from "react-toastify";
import Button from "react-bootstrap/Button";
import {AiOutlineMinus, AiOutlinePlus} from "react-icons/ai";
import {useDispatch, useSelector} from "react-redux";
import {SET_CART_ITEM} from "../../../../store/slices/CartSlice";
import {randomInt} from "next/dist/shared/lib/bloom-filter/utils";
import Timer from "../../../../components/common/Timer";
import {fetchCombo} from "../../../../services/ComboServices";
import ComboImageSection from "../../../../components/combo/ComboImageSection";
import ComboProductDescription from "../../../../components/combo/ComboProductDescription";
import Head from "next/head";

const SingleComboPage = () => {
  const dispatch = useDispatch();

  const router = useRouter();
  const { id } = router.query;

  const cart = useSelector((state) => state.cart);

  const [combo, setCombo] = useState({});
  const [isRunningOffer, setIsRunningOffer] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);

  const [quantity, setQuantity] = useState(1);

  const incQuantity = (event) => {
    event.preventDefault();
    setQuantity(quantity + 1);
  };

  const decQuantity = (event) => {
    event.preventDefault();

    if (quantity > 1) {
      setQuantity(quantity - 1);
    } else {
      alert("Minimum quantity 1");
      setQuantity(1);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCombo(id).then((response) => {
        if (response?.data) {
          const combo = response.data;
          // console.log(combo)

          setCombo(combo);

          const today = moment().format("YYYY-MM-DD");
          const myOfferStart = combo.offer_start
            ? moment(combo.offer_start).format("YYYY-MM-DD")
            : null;
          const myOfferEnd = combo.offer_end
            ? moment(combo.offer_end).format("YYYY-MM-DD")
            : null;

          if (combo?.offer_price) {
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

  const handleAddToCart = (event, combo, buyNow = false) => {
    event.preventDefault();

    try {
      if (!quantity) {
        tostify(toast, "warning", {
          message: "Quantity shouldn't empty!",
        });
        return false;
      }

      const unitPrice = isRunningOffer ? combo.offer_price : combo.sale_price;

      dispatch(
        SET_CART_ITEM({
          id: randomInt(11111111, 999999999),
          combo_id: combo.id,
          quantity: quantity,
          unit_price: unitPrice,
          total: quantity * unitPrice,

          type: "combo",
          sku: combo.sku,
          title: combo.title,
          category_name: combo?.combo_category?.name,
          image: getStoragePath(`combo-image/${combo?.image}`),
          items: combo.combo_items,
        })
      );

      tostify(toast, "success", {
        message: "Added to Cart",
      });

      setQuantity(1);

      if (buyNow) {
        setTimeout(() => {
          router.push("/checkout");
        }, 2000);
      }
    } catch (err) {
      tostify(toast, "warning", {
        message: err.message,
      });
    }
  };

  const calculateDiscount = (sale, offer) => {
    return Math.round(((sale - offer) / sale) * 100);
  };

  return (
      <Fragment>
        <Head>
          <title>{makeTitle(combo?.title || "Combo Product")}</title>
        </Head>
    <section className="view-single-pro">
      {combo?.lifestyle_image && (
        <div className="product-banner">
          <img
            src={
              combo?.lifestyle_image
                ? getStoragePath(`combo-life-style/${combo?.lifestyle_image}`)
                : "/combo-default.jpg"
            }
            alt="lifestyle-image"
            className="product-banner"
          />
        </div>
      )}

      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-6">
            <div className="mt-5">
              <ComboImageSection combo={combo} className="sec-height" />
            </div>
          </div>

          <div className="col-lg-6 col-md-6 ps-5">
            <div className="border-bottom position-relative">
              <h3 className="mt-5 color font-jost display-6 fw-bolder text-capitalize mb-3">
                {combo?.title}
              </h3>

              {combo && combo.combo_items && combo.combo_items.length > 0 && (
                <div className="mb-3">
                  <h2 className="mb-1">Package Items:</h2>
                  {combo.combo_items.map((item, index) => (
                    <p key={index}>
                      {index + 1}. {item?.inventory?.title}{" "}
                      {item?.quantity ? `(Qty. ${item.quantity})` : ""}
                    </p>
                  ))}
                </div>
              )}

              <p className="font-lato font-20 text-dark mb-3">
                {isRunningOffer ? (
                  <Fragment>
                    <del>Price: {combo?.sale_price} Tk.</del>
                    <br />
                    Offer Price: {combo?.offer_price} Tk
                  </Fragment>
                ) : (
                  <Fragment>Price: {combo?.sale_price} Tk.</Fragment>
                )}
              </p>
              {combo?.sale_price && combo?.offer_price && combo?.offer_price < combo?.sale_price && (
              <div className="single_pro_offer" >
                <img src="/offer_shape.png" alt="" className="single_pro_offer_img"/>
                <div className="single_offer_text">
                  <p className="text-uppercase fw-bold font-16 d-flex justify-content-center text-white m-0 p-0 offer_text_tab">save</p>
                  <span className="text-white veri-align fw-semibold font-16">
                    {calculateDiscount(combo?.sale_price, combo?.offer_price)}%
                  </span>
                </div>
              </div>
              )}
            </div>

            <div className="d-flex justify-content-start align-items-center counter mt-3">
              <p className="text-capitalize pe-3 font-lato">quantity :</p>

              <div className="d-flex justify-content-between align-items-center border border-secondary rounded-0 counter">
                <Button
                  onClick={(event) => decQuantity(event)}
                  className="button-two border-0 ms-2"
                >
                  <AiOutlineMinus className="text-dark minus-icon" />
                </Button>

                <h2 className="px-4 font-14 count-padding">{quantity}</h2>

                <Button
                  onClick={(event) => incQuantity(event)}
                  className="button-one border-0 me-2"
                >
                  <AiOutlinePlus className="text-dark plus-icon" />
                </Button>
              </div>
            </div>
            <div className="d-flex justify-content-start counter mt-4 mb-4">
              <div className="ms-2">
                <button
                  type="button"
                  className="btn btn-success buy-btn rounded-0 text-capitalize px-4 font-lato"
                  onClick={(event) => handleAddToCart(event, combo, true)}
                >
                  buy now
                </button>
              </div>
              <div className="ms-2">
                <button
                  type="button"
                  className="btn btn-warning buy-btn2 rounded-0 text-capitalize px-4 font-lato"
                  onClick={(event) => handleAddToCart(event, combo)}
                >
                  add to cart
                </button>
              </div>
            </div>

            {/*Timer*/}
            {isRunningOffer && combo?.offer_end && (
              <div className="offer-countdown mb-4">
                <div className="fs-6 mb-1">Hurry up! Offer is ongoing.</div>
                <div
                  className="fs-2 fw-light border-2 border-warning d-inline-block px-3 py-2 text-center"
                  style={{
                    padding: "10px 0 0",
                    textAlign: "left",
                    fontWeight: "bold",
                  }}
                >
                  <Timer startDate={null} endDate={combo?.offer_end} />
                </div>
              </div>
            )}
          </div>
          <ComboProductDescription combo={combo} className="mb-5 tabs" />
        </div>
      </div>
    </section>
      </Fragment>
  );
};

export default SingleComboPage;
