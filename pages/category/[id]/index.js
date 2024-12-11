import React, {Fragment, useEffect, useState} from 'react'
import ScrollToTopButton from '../../../components/common/ScrollToTopButton'
import {useRouter} from "next/router";
import {fetchCategories, fetchCategory} from "../../../services/CategoryServices";
import {fetchInventoriesByCategory} from "../../../services/InventoryServices";
import Link from "next/link";
import {IoIosArrowRoundForward} from "react-icons/io";
import ProductCard from "../../../components/common/ProductCard";
import {getStoragePath, makeTitle} from "../../../utils/helpers";
import Head from "next/head";

const CategoryPage = () => {
    const router = useRouter();
    const {id} = router.query;

    const [category, setCategory] = useState({});
    const [categories, setCategories] = useState([]);
    const [inventories, setInventories] = useState([]);

    const [meta, setMeta] = useState({});
    const [page, setPage] = useState('');

    // fetch
    useEffect(() => {
        fetchCategories({
            paginate: 'no'
        }).then((response) => {
            if (response?.data) {
                setCategories(response.data);
            }
        });
    }, []);

    // fetch
    useEffect(() => {
        if (id) {
            fetchCategory(id).then((response) => {
                if (response?.data) {
                    setCategory(response.data);
                }
            });
        }
    }, [id]);

    const fetchInventoriesByCategoryData = (id, params = {}) => {
        fetchInventoriesByCategory(id, params).then((response) => {
            // if (response?.data?.data) { // if paginate: "yes"
            //     setInventories(response.data.data);
            //     setMeta(response.data.meta);
            // }
            if (response?.data) { // if paginate: "no"
                setInventories(response.data);
            }
        });
    }

    // fetch
    useEffect(() => {
        if (id) {
            fetchInventoriesByCategoryData(id, {
                paginate: 'no',
                order_column: 'updated_at',
                order_by: 'DESC',
            });
        }
    }, [id]);

    // paginate
    useEffect(() => {
        if (page && id) {
            fetchInventoriesByCategoryData(id, {
                page: page,
                paginate: 'yes',
                order_column: 'updated_at',
                order_by: 'DESC',
            });
        }
    }, [page]);

    return (
        <Fragment>
            <Head>
                <title>{makeTitle(category?.name || "Category Products")}</title>
            </Head>
        <section>

            {/*Category Banner*/}
            {category?.lifestyle_image && (
                <div className="product-banner">
                    <img src={getStoragePath(`category-image/${category?.lifestyle_image}`)} alt="category-image"
                         className="product-banner"/>
                </div>
            )}

            <div className="container">

                {/*Category Info*/}
                <div className="w-100 mb-5">
                    <h1 className="fw-bolder text-center mt-5 font-40 font-inter our-product">{category?.name && category.name}</h1>
                    {/* <p className="font-lato text-center font-18 mb-5 product-des">
                        We Are Restocking as Quickly as Possible. Come Back 7/30 to OrderMore of These Flavors
                        Inspired by the Places You Call
                        Home!
                    </p> */}
                </div>

                <div className="row">

                    {/*Category Sidebar*/}
                    <div className="col-lg-3 col-md-4 col-sm-5 mb-3">
                        <ul className="stickyContent list-unstyled text-start ps-5 font-20 lh-lg card-border py-3 ">
                            {categories?.map((item, key) => (
                                <li key={key}>
                                    <Link href={`/category/${item.id}`}>
                                        <button className="d-flex category-btn">
                                            <IoIosArrowRoundForward className="icon-space me-2"/>
                                            <span> {item.name}</span>
                                        </button>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/*Category Products*/}
                    <div className="col-lg-9 col-md-8 col-sm-7">
                        <div className="row">
                            {inventories.map((inventory, key) => {
                                return (
                                    <div className="col-lg-4 col-md-6 text-center mb-4" key={key}>
                                        <ProductCard
                                            id={inventory.id}
                                            categoryId={inventory?.product.category_id}
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
                        {/* <div className="my-3 d-flex justify-content-center">
                            <CustomPagination meta={meta} setPage={setPage}/>
                        </div> */}
                    </div>
                </div>
            </div>

            <ScrollToTopButton/>
        </section>
        </Fragment>
    )
}

export default CategoryPage;