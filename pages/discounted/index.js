import React, {Fragment, useEffect, useState} from 'react'
import ScrollToTopButton from '../../components/common/ScrollToTopButton'
import {fetchDiscountedInventories} from "../../services/InventoryServices";
import Image from "next/image";
import ProductBanner from "../../public/product.png";
import ProductCard from "../../components/common/ProductCard";
import {getStoragePath, makeTitle} from "../../utils/helpers";
import CustomPagination from "../../components/common/CustomPagination";
import Head from "next/head";

const DiscountedPage = () => {
    const [inventories, setInventories] = useState([]);

    const [meta, setMeta] = useState({});
    const [page, setPage] = useState('');

    const fetchDiscountedInventoriesData = (params = {}) => {
        fetchDiscountedInventories(params).then((response) => {
            if (response?.data?.data) {
                setInventories(response.data.data);
                setMeta(response.data.meta);
            }
        });
    }

    // fetch
    useEffect(() => {
        fetchDiscountedInventoriesData({
            paginate: 'yes'
        });
    }, []);

    // paginate
    useEffect(() => {
        if (page && id) {
            fetchDiscountedInventoriesData(id, {
                page: page,
                paginate: 'yes'
            });
        }
    }, [page]);

    return (
        <Fragment>
            <Head>
                <title>{makeTitle("Discounted Products")}</title>
            </Head>
        <section>

            {/*Category Banner*/}
            <div className="product-banner">
                <Image src={ProductBanner} alt="" className="product-banner"/>
            </div>

            <div className="container">

                {/*Category Info*/}
                <div className="w-100">
                    <h1 className="fw-bolder text-center mt-5 font-40 font-inter our-product">Discounted Products</h1>
                    <p className="font-lato text-center font-18 mb-5 product-des">
                        We Are Restocking as Quickly as Possible. Come Back 7/30 to OrderMore of These Flavors
                        Inspired by the Places You Call
                        Home!
                    </p>
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

export default DiscountedPage;