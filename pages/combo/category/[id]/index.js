import React, {Fragment, useEffect, useState} from 'react'
import Link from "next/link";
import {IoIosArrowRoundForward} from "react-icons/io";
import {fetchComboCategories, fetchComboCategory} from "../../../../services/ComboCategoryServices";
import {useRouter} from "next/router";
import {fetchCombosByCategory} from "../../../../services/ComboServices";
import {getStoragePath, makeTitle} from "../../../../utils/helpers";
import ScrollToTopButton from "../../../../components/common/ScrollToTopButton";
import CustomPagination from "../../../../components/Modules/pagination/CustomPagination";
import ComboProductCard from "../../../../components/common/ComboProductCard";
import Head from "next/head";

const ComboCategoryPage = () => {
    const router = useRouter();
    const {id} = router.query;

    const [comboCategory, setComboCategory] = useState({});
    const [comboCategories, setComboCategories] = useState([]);
    const [combos, setCombos] = useState([]);

    const [meta, setMeta] = useState({});
    const [page, setPage] = useState('');

    useEffect(() => {
        fetchComboCategories({
            paginate: 'no'
        }).then((response) => {
            if (response?.data) {
                setComboCategories(response.data);
            }
        });
    }, []);

    // fetch
    useEffect(() => {
        if (id) {
            fetchComboCategory(id).then((response) => {
                if (response?.data) {
                    setComboCategory(response.data);
                }
            });
        }
    }, [id]);

    const fetchCombosByCategoryData = (id, params = {}) => {
        fetchCombosByCategory(id, params).then((response) => {
            if (response?.data?.data) {
                setCombos(response.data.data);
                setMeta(response.data.meta);
            }
        });
    }

    // fetch
    useEffect(() => {
        if (id) {
            fetchCombosByCategoryData(id, {
                paginate: 'yes'
            });
        }
    }, [id]);

    // paginate
    useEffect(() => {
        if (page && id) {
            fetchCombosByCategoryData(id, {
                page: page,
                paginate: 'yes'
            });
        }
    }, [page]);

    return (
        <Fragment>
            <Head>
                <title>{makeTitle(comboCategory?.name || "Combo Category Products")}</title>
            </Head>
        <section>

            {/*Category Banner*/}
            {comboCategory?.image && (
                <div className="product-banner">
                    <img
                        // src={getStoragePath(`combo-category-image/${comboCategory?.image}`)}
                        src="/combo-default.jpg"
                        alt="category-image"
                        className="product-banner"
                    />
                </div>
            )}

            <div className="container">

                {/*Category Info*/}
                <div className="w-100 mb-5">
                    <h1 className="fw-bolder text-center mt-5 font-40 font-inter our-product">Combo Pack</h1>
                    {/* <p className="font-lato text-center font-18 mb-5 product-des">
                        We Are Restocking as Quickly as Possible. Come Back 7/30 to OrderMore of These Flavors
                        Inspired by the Places You Call
                        Home!
                    </p> */}
                </div>

                <div className="row">

                    {/*Category Sidebar*/}
                    <div className="col-lg-3 col-md-4 col-sm-4">
                        <ul className="stickyContent list-unstyled text-start ps-5 font-20 lh-lg card-border py-3 ">
                            {comboCategories?.map((item, key) => (
                                <li key={key}>
                                    <Link href={`/combo/category/${item.id}`}>
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
                    <div className="col-lg-9 col-md-8 col-sm-9">
                        <div className="row">
                            {combos.map((combo, key) => {
                                return (
                                    <div className="col-lg-4 col-md-6 text-center mb-4" key={key}>
                                        <ComboProductCard
                                            id={combo.id}
                                            categoryId={combo.combo_category_id}
                                            title={combo.title}
                                            sku={combo.sku}
                                            categoryName={combo?.combo_category?.name}
                                            subCategoryName={combo?.product?.sub_category?.name}
                                            salePrice={combo.sale_price}
                                            offerPrice={combo.offer_price}
                                            offerStart={combo.offer_start}
                                            offerEnd={combo.offer_end}
                                            imagePath={getStoragePath(`combo-image/${combo?.image}`)}
                                            viewLink={`/combo/pack/${combo.id}`}
                                            cssClasses="category-product"
                                            isTimer={true}
                                            items={combo.combo_items}
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

export default ComboCategoryPage;