import React, {Fragment, useEffect, useState} from 'react'
import ScrollToTopButton from '../../components/common/ScrollToTopButton'
import ProductCard from "../../components/common/ProductCard";
import {getStoragePath, makeTitle} from "../../utils/helpers";
import CustomPagination from "../../components/common/CustomPagination";
import {fetchSearchCombos} from "../../services/ComboServices";
import Head from "next/head";

const SearchCombos = ({keyword}) => {
    const [combos, setCombos] = useState([]);

    const [meta, setMeta] = useState({});
    const [page, setPage] = useState('');

    const fetchSearchCombosData = (params = {}) => {
        fetchSearchCombos(params).then((response) => {
            if (response?.data?.data) {
                setCombos(response.data.data);
                setMeta(response.data.meta);
            }
        });
    }

    // fetch
    useEffect(() => {
        if (keyword) {
            fetchSearchCombosData({
                paginate: 'yes',
                keyword: keyword
            });
        }
    }, [keyword]);

    // paginate
    useEffect(() => {
        if (page && keyword) {
            fetchSearchCombosData({
                page: page,
                paginate: 'yes',
                keyword: keyword
            });
        }
    }, [page]);

    return (
        <Fragment>
            <Head>
                <title>{makeTitle(keyword || 'Search')}</title>
            </Head>
            <section>

                {/*Category Banner*/}
                {combos?.[0]?.lifestyle_image && (
                    <div className="product-banner">
                        <img src={combos?.[0]?.lifestyle_image} alt="" className="product-banner"/>
                    </div>
                )}

                <div className="container">

                    {/*Category Info*/}
                    <div className="w-100">
                        <h1 className="fw-bolder text-center mt-5 mb-5 font-40 font-inter our-product">Search: {keyword}</h1>
                        {/* <p className="font-lato text-center font-18 mb-5 product-des">
                        We Are Restocking as Quickly as Possible. Come Back 7/30 to OrderMore of These Flavors
                        Inspired by the Places You Call
                        Home!
                    </p> */}
                    </div>

                    <div className="row">
                        <div className="col-lg-12 col-md-8 col-sm-9">
                            <div className="row">
                                {combos.map((combo, key) => {
                                    return (
                                        <div className="col-lg-3 col-md-6 text-center mb-4" key={key}>
                                            <ProductCard
                                                id={combo.id}
                                                title={combo.title}
                                                sku={combo.sku}
                                                categoryName={combo?.combo_category?.name}
                                                salePrice={combo.sale_price}
                                                offerPrice={combo.offer_price}
                                                offerStart={combo.offer_start}
                                                offerEnd={combo.offer_end}
                                                imagePath={getStoragePath(`inventory-image/${combo?.image}`)}
                                                viewLink={`/combo/pack/${combo.id}`}
                                                cssClasses="category-product"
                                            />
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="my-3 d-flex justify-content-center">
                                <CustomPagination meta={meta} setPage={setPage}/>
                            </div>
                        </div>
                    </div>
                </div>

                <ScrollToTopButton/>
            </section>
        </Fragment>
    )
}

export default SearchCombos;