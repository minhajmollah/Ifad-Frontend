import React, {Fragment, useState} from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import {FreeMode, Navigation, Thumbs} from "swiper";
import {getStoragePath} from "../../utils/helpers";

const ComboImageSection = ({combo}) => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

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
                <SwiperSlide>
                    <img src={getStoragePath(`combo-image/${combo?.image}`)} alt="product-img-two"
                         className="single-object"/>
                </SwiperSlide>

                {combo?.combo_images?.map((combo_image, key) => (
                    <SwiperSlide key={key}>
                        <img src={getStoragePath(`combo-image/${combo_image?.image}`)} alt="product-img-two"
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
                className="mySwiper"
            >
                <SwiperSlide>
                    <img src={getStoragePath(`combo-image/${combo?.image}`)} alt="product-img-two"
                         className="single-object"/>
                </SwiperSlide>
                {combo?.combo_images?.map((combo_image, key) => (
                    <SwiperSlide key={key}>
                        <img src={getStoragePath(`combo-image/${combo_image?.image}`)} alt="product-img-two"
                             className="single-object"/>
                    </SwiperSlide>
                ))}
            </Swiper>
        </Fragment>
    );
}

export default ComboImageSection