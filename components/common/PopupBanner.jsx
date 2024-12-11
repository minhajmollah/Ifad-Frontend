import React, { useState, useEffect } from "react";
import Link from "next/link";
import Modal from "react-bootstrap/Modal";
import { getStoragePath } from "../../utils/helpers";

const PopupBanner = ({ show, onClose, popupData }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const image = new Image();
    image.src = getStoragePath(
      popupData?.[0]?.item_image || "category-image/Noodles-600X600-143527.jpg"
    );

    image.onload = () => {
      setImageLoaded(true);
    };

    return () => {
      image.onload = null;
    };
  }, [popupData?.[0]?.item_image]);

  return (
    <Modal
      show={show && imageLoaded}
      onHide={onClose}
      dialogClassName="onload-modal"
      contentClassName="onload-content"
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <div className="onload-popup">
        <div className="onload-popup-img">
          <img
            src={getStoragePath(
              popupData?.[0]?.item_image ||
                "category-image/Noodles-600X600-143527.jpg"
            )}
            alt="Popup Image"
          />
        </div>
      </div>
      <span className="close" onClick={onClose}>
        <svg
          width="23"
          height="22"
          viewBox="0 0 23 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="close-icon"
        >
          <path
            d="M5.48881 15.5962L16.0954 4.98963L17.5096 6.40384L6.90302 17.0104L5.48881 15.5962Z"
            fill="%23000"
          />
          <path
            d="M16.0954 17.7176L4.7817 6.40384L6.19592 4.98963L17.5096 16.3033L16.0954 17.7176Z"
            fill="%23000"
          />
        </svg>
      </span>
      {popupData?.[0]?.item_link ? (
        <Link
          href={new URL(popupData?.[0]?.item_link).pathname}
          className="onload-popup-link"
          onClick={onClose}
        ></Link>
      ) : (
        ""
      )}
    </Modal>
  );
};

export default PopupBanner;
