import React, { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import CompanyRev from "../../public/Factory.jpg";
import { Container, Row } from "react-bootstrap";
import {
  fetchAboutInfo,
  fetchMissionVision,
  fetchValues,
} from "../../services/CommonServices";
import { getStoragePath, makeTitle } from "../../utils/helpers";
import Head from "next/head";

const CompanyReview = () => {
  const [aboutInfo, setAboutInfo] = useState([]);
  const [mission, setMission] = useState([]);
  const [values, setValues] = useState([]);

  // fetch
  useEffect(() => {
    fetchAboutInfo().then((response) => {
      if (response?.data) {
        setAboutInfo(response.data[0]?.content_item);
      }
    });
  }, []);

  // fetch
  useEffect(() => {
    fetchMissionVision().then((response) => {
      if (response?.data) {
        setMission(response.data[0]?.content_item);
      }
    });
  }, []);

  // fetch
  useEffect(() => {
    fetchValues().then((response) => {
      if (response?.data) {
        setValues(response.data[0]?.content_item);
      }
    });
  }, []);

  return (
    <Fragment>
      <Head>
        <title>{makeTitle("Company Profile")}</title>
      </Head>
      <section>
        <div className="review-banner">
          <Image src={CompanyRev} alt="" className="review-img" />
        </div>
        <div className="container">
          {aboutInfo?.map((item, index) => (
            <div className="row justify-content-center" key={index}>
              <div className="col-12 col-md-7 col-lg-7 col-xxl-6">
                <h2 className="font-32 fw-bold pt-5 font-inter">
                  {item?.item_name}
                </h2>
                <p className="font-16 pt-3 pb-3 font-inter text-justify">
                  {item?.item_long_desc}
                </p>
              </div>
              <div className="col-12 col-md-5 col-lg-4 col-xxl-3">
                <div className="mt-5 p-4">
                  <img
                    src={getStoragePath(item.item_image)}
                    alt=""
                    className="review-about rounded-4"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="missionVission" className="values pt-8">
        <div className="values-wrapper">
          <div className="container">
            <div className="row">
              {mission?.map((item, key) => (
                <div key={key} className="">
                  <div className="d-flex justify-content-between">
                    <div className="text-center">
                      <img
                        src={getStoragePath(item.item_image)}
                        alt="vision"
                        height={150}
                        width={150}
                      />
                    </div>
                    <h1 className="text-center text-capitalize font-poppins fw-bold pt-5 font-40">
                      {item.item_name.split(" ")[0]}
                      <span className="theme-color">
                        {" "}
                        {item.item_name.split(" ")[1]}
                      </span>
                    </h1>
                  </div>
                  <div className=" mission">
                    <div>
                      <p className="text-justify px-3 pb-5 font-20">
                        {item.item_long_desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* value part */}
      <section>
        <Container className="pb-4">
          <Row>
            <h1 className="text-center text-capitalize font-poppins fw-bolder py-4 font-40">
              our <span className="theme-color"> values</span>
            </h1>

            {values?.map((item, key) => (
              <div
                key={key}
                className="col-lg-7 d-flex justify-content-start value-items"
              >
                <div className="col-lg-1">
                  <img
                    src={getStoragePath(item.item_image)}
                    alt=""
                    height={70}
                    width={70}
                    className="value-image"
                  />
                </div>
                <div className="col-lg-11 d-flex align-items-center">
                  <p className="font-20 ps-3">
                    <span className="fw-bold logo-color">
                      {item.item_name}{" "}
                    </span>
                    {item.item_long_desc}
                  </p>
                </div>
              </div>
            ))}
          </Row>
        </Container>
      </section>
    </Fragment>
  );
};

export default CompanyReview;
