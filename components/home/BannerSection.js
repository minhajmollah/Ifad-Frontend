import React, {useEffect, useState} from "react";
import Carousel from 'react-bootstrap/Carousel';
import {fetchBanners} from "../../services/BannerServices";
import {getStoragePath} from "../../utils/helpers";

const BannerSection = () => {

    const [banners, setBanners] = useState([]);

    // fetch
    useEffect(() => {
        fetchBanners().then((response) => {
            if (response?.data) {
                setBanners(response.data?.[0]?.content_item);
            }
        });
    }, []);

    return (
        <div className="mb-3">
            <Carousel fade>
                {banners && banners.map(((banner, key) =>
                        <Carousel.Item key={key}>
                            <img
                                src={getStoragePath(banner.item_image)}
                                alt="Picture of the author"
                                className="banner-img-size"
                            />
                        </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
};

export default BannerSection;
