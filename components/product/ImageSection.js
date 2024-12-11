import React, {Fragment, useState} from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import {FreeMode, Navigation, Thumbs} from "swiper";
import {getStoragePath} from "../../utils/helpers";

const ImageSection = ({inventory}) => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    let thumbnailImage = '';
    let galleryImages = [];

    if (inventory?.image) {
        thumbnailImage = getStoragePath(`inventory-image/${inventory?.image}`);
    } else {
        thumbnailImage = getStoragePath(`product-image/${inventory?.product?.image}`);
    }

    if (inventory?.inventory_images) {
        inventory?.inventory_images?.map((inventory_image) => {
            galleryImages.push(getStoragePath(`inventory-multi-image/${inventory_image?.image}`))
        });
    } else {
        inventory?.product?.product_images?.map((product_image) => {
            galleryImages.push(getStoragePath(`product-multi-image/${product_image?.image}`))
        });
    }

    return (
        <Fragment>
            <Swiper
                style={{
                    "--swiper-navigation-color": "#fff",
                    "--swiper-pagination-color": "#fff",
                }}
                spaceBetween={10}
                navigation={true}
                thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : undefined}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mySwiper2"
            >
                {thumbnailImage && (
                    <SwiperSlide>
                        <img src={thumbnailImage} alt="product-img-two"
                             className="single-object"/>
                    </SwiperSlide>
                )}

                {galleryImages.map((galleryImage, key) => (
                    <SwiperSlide key={key}>
                        <img src={galleryImage} alt="product-img-two"
                             className="single-object"/>
                    </SwiperSlide>
                ))}
            </Swiper>

            <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="prod-detail-small-slider"
            >
                 {thumbnailImage && (
                    <SwiperSlide>
                        <img src={thumbnailImage} alt="product-img-two"
                             className="single-object"/>
                    </SwiperSlide>
                )}
                {galleryImages.map((galleryImage, key) => (
                    <SwiperSlide key={key}>
                        <img src={galleryImage} alt="product-img-two"
                             className="single-object"/>
                    </SwiperSlide>
                ))}
            </Swiper>
        </Fragment>
    );
}
export default ImageSection