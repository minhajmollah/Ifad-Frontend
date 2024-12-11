import React, { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import Slider from "react-slick";
import { fetchCategories } from "../../services/CategoryServices";
import { getStoragePath } from "../../utils/helpers";

const CategoryShowcase = () => {
  const [categories, setCategories] = useState([]);

  // fetch
  useEffect(() => {
    fetchCategories({
      paginate: "no",
    }).then((response) => {
      if (response?.data) {
        setCategories(response.data);
      }
    });
  }, []);

  var settings = {
    dots: true,
    infinite: true,
    speed: 2000,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 3,
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
    <Fragment>
      <section className="categories">
        <div className="container p-0">
          <h1 className="font-24 text-center font-inter pt-3 pb-3 mt-3 mb-3 text-stroke home-cat-title">
            Categories
          </h1>
          <div className="row">
            <Slider {...settings}>
              {categories &&
                categories.map((category, key) => {
                  return (
                    <div className="col-lg-4" key={key}>
                      <Link href={`/category/${category.id}`}>
                        <div className="position-relative mb-3 mx-2 img-demo">
                          <img
                            src={getStoragePath(
                              `category-image/${category.image}`
                            )}
                            alt={category.name}
                            className="category-img-one"
                          />
                          <div className="wavy-chips position-absolute">
                            <p className="position-absolute category-title text-center text-capitalize text-light font-30 fw-bold">
                              {category.name}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
            </Slider>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default CategoryShowcase;
