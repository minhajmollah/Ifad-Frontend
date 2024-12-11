import React, {Fragment, useEffect, useState} from 'react'
import ScrollToTopButton from '../../components/common/ScrollToTopButton'
import {fetchSearchInventories} from "../../services/InventoryServices";
import ProductCard from "../../components/common/ProductCard";
import {getStoragePath, makeTitle} from "../../utils/helpers";
import CustomPagination from "../../components/common/CustomPagination";
import Head from "next/head";

const SearchInventories = ({keyword}) => {

    const [inventories, setInventories] = useState([]);

    const [meta, setMeta] = useState({});
    const [page, setPage] = useState('');

    const fetchSearchInventoriesData = (params = {}) => {
        fetchSearchInventories(params).then((response) => {
            if (response?.data?.data) {
                setInventories(response.data.data);
                setMeta({
                    links: response?.data?.links,
                    total: response?.data?.total,
                });
            }
        });
    }

    // fetch
    useEffect(() => {
        if (keyword) {
            fetchSearchInventoriesData({
                paginate: 'yes',
                keyword: keyword
            });
        }
    }, [keyword]);

    // paginate
    useEffect(() => {
        if (page && keyword) {
            fetchSearchInventoriesData({
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
            {inventories?.[0]?.product?.lifestyle_image && (
                <div className="product-banner">
                    <img src={getStoragePath(`product-image/${inventories?.[0]?.product?.lifestyle_image}`)} alt="image"
                         className="product-banner"/>
                </div>
            )}

            <div className="container">

                {/*Category Info*/}
                <div className="w-100">
                    <h1 className="fw-bolder text-center mt-5 mb-5 font-40 font-inter our-product">
                        Search
                        <small className="fs-6 d-block" style={{fontWeight: '500'}}>
                            {meta?.total} items found for "{keyword}"
                        </small>
                    </h1>
                    {/* <p className="font-lato text-center font-18 mb-5 product-des">
                        We Are Restocking as Quickly as Possible. Come Back 7/30 to OrderMore of These Flavors
                        Inspired by the Places You Call
                        Home!
                    </p> */}
                </div>

                <div className="row">
                    <div className="col-lg-12 col-md-8 col-sm-9">
                        <div className="row">
                            {inventories.map((inventory, key) => {
                                return (
                                    <div className="col-lg-3 col-md-6 text-center mb-4" key={key}>
                                        <ProductCard
                                            id={inventory.id}
                                            title={inventory.title}
                                            sku={inventory.sku}
                                            categoryName={inventory?.product?.category?.name}
                                            subCategoryName={inventory?.product?.sub_category?.name}
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
                                            cssClasses="category-product"
                                        />
                                    </div>
                                )
                            })}
                        </div>
                        <div className="my-4 d-flex justify-content-center">
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

export default SearchInventories;