import React, { Fragment } from "react";
import Link from "next/link";
import Card from "react-bootstrap/Card";
import moment from "moment";
import { tostify } from "../../utils/helpers";
import { toast } from "react-toastify";
import { SET_CART_ITEM } from "../../store/slices/CartSlice";
import { randomInt } from "next/dist/shared/lib/bloom-filter/utils";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

const ComboProductCard = ({
  id,
  categoryId,
  title,
  salePrice,
  offerPrice,
  offerStart,
  offerEnd,
  sku,
  categoryName,
  imagePath,
  viewLink,
  cssClasses,
  isTimer,
  items,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  let isRunningOffer = false;
  const today = moment().format("YYYY-MM-DD");
  const myOfferStart = offerStart
    ? moment(offerStart).format("YYYY-MM-DD")
    : null;
  const myOfferEnd = offerEnd ? moment(offerEnd).format("YYYY-MM-DD") : null;

  if (offerPrice) {
    if (myOfferStart !== null && myOfferEnd !== null) {
      isRunningOffer = myOfferStart <= today && myOfferEnd >= today;
    } else {
      isRunningOffer = true;
    }
  }

  const handleAddToCart = (event, buyNow = false) => {
    event.preventDefault();

    try {
      dispatch(
        SET_CART_ITEM({
          id: randomInt(11111111, 999999999),
          categoryId,
          combo_id: id,
          quantity: 1,
          unit_price: isRunningOffer ? offerPrice : salePrice,
          total: isRunningOffer ? offerPrice : salePrice,

          type: "combo",
          sku: sku,
          title: title,
          category_name: categoryName,
          image: imagePath,
          items,
        })
      );

      tostify(toast, "success", {
        message: "Added to Cart",
      });

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
    <Card className={`c-shadow rounded-0 ${cssClasses}`}>
      <div className="combo-img-bg position-relative">
        <Link href={viewLink}>
          <img
            src={imagePath}
            width={224}
            height={172}
            className="card-img-top mt-4 mb-4 img-fluid"
            alt={title}
          />
        </Link>
        {/* {salePrice && offerPrice && salePrice > offerPrice ? (
          <div className="position-absolute offer-token text-center">
            <span className="text-white veri-align fw-semibold font-14 pt-2">
              -{calculateDiscount(salePrice, offerPrice)}%
            </span>
          </div>
        ) : (
          ""
        )} */}
      </div>
      <Card.Body className="prod-card-body position-relative">
        <Card.Title className="text-center text-capitalize font-18">
          <Link href={`/combo/pack/${id}`} className="prod-title" title={title}>
            {title}
          </Link>
        </Card.Title>

        {isRunningOffer ? (
          <Fragment>
            <del>
              <Card.Text className="text-center text-capitalize">
                Price: {salePrice} Tk.
              </Card.Text>
            </del>
            <Card.Text className="text-center pb-3 text-capitalize">
              offer Price: {offerPrice} Tk.
            </Card.Text>
          </Fragment>
        ) : (
          <Card.Text className="text-center pb-3 text-capitalize">
            <br />
            Price: {salePrice} Tk.
          </Card.Text>
        )}
        <div className="round_offer">
          <img src="./offer_shape.png" alt="" className="offer_round_shape" />
          <div className="offer_text">
            <p className="text-uppercase fw-bold font-14 d-flex justify-content-center text-white m-0 p-0 offer_text_tab">save</p>
            <span className="font-poppins font-14 d-flex justify-content-center text-white fw-semibold m-0 offer_percent">
            {salePrice && offerPrice && salePrice > offerPrice ? (
          <div className="position-absolute offer-token text-center ps-4">
            <span className="text-white veri-align fw-semibold font-14 pt-2">
              {calculateDiscount(salePrice, offerPrice)}%
            </span>
          </div>
        ) : (
          ""
        )}
            </span>
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-success buy-now rounded-0 text-capitalize px-2 font-14 font-lato me-2"
            onClick={(event) => handleAddToCart(event, true)}
          >
            buy now
          </button>
          <button
            type="button"
            className="btn btn-warning buy-add-btn rounded-0 text-capitalize px-2 font-14 font-lato"
            onClick={(event) => handleAddToCart(event)}
          >
            add to cart
          </button>
        </div>
        {/*{isTimer && isRunningOffer && (
                    <div style={{padding: "10px 0 0", textAlign: "center", fontWeight: "bold"}}>
                        <Timer startDate={offerStart} endDate={offerEnd}/>
                    </div>
                )} */}
      </Card.Body>
    </Card>
  );
};

export default ComboProductCard;
