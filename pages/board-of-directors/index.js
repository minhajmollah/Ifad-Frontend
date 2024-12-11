import React, { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import Row from "react-bootstrap/Row";
import Head from "next/head";
import { makeTitle, getStoragePath } from "../../utils/helpers";
import {
  fetchBoardOfDirectors,
  fetchMD,
  fetchLeadershipTeam,
} from "../../services/CommonServices";

const FallbackImage = "/no-image.png";
const FallbackBanner = "/bod/Banner.png";

function Director({ item }) {
  const [imageSrc, setImageSrc] = useState(getStoragePath(item?.item_image));

  return (
    <div className="col-lg-4 col-md-4 mb-4">
      <div className="text-center">
        <img
          src={imageSrc}
          alt=""
          className="rounded-pill chairman-img"
          width={200}
          height={200}
          onError={() => setImageSrc(FallbackImage)} // Set fallback on error
        />
        <h2 className="font-20 fw-bold pt-2 pb-2">{item?.item_name || ""}</h2>
        <p className="about_titledesign position-relative pt-2">
          {item?.item_short_desc || ""}
        </p>
      </div>
    </div>
  );
}

function TeamMD({ item }) {
  const [imageSrc, setImageSrc] = useState(getStoragePath(item?.item_image));

  return (
    <div className="col-lg-4 col-md-4 mb-4">
      <div className="text-center">
        <img
          src={imageSrc}
          alt=""
          className="rounded leadership-team"
          width={300}
          height={320}
          onError={() => setImageSrc(FallbackImage)}
        />
        <h2 className="font-20 fw-bold pt-2 pb-1">{item?.item_name || ""}</h2>
        <p className="position-relative pt-1">{item?.item_short_desc || ""}</p>
      </div>
    </div>
  );
}

function TeamMember({ item }) {
  const [imageSrc, setImageSrc] = useState(getStoragePath(item?.item_image));

  return (
    <div className="col-lg-3 col-md-3 col-sm-6 mb-4">
      <div className="text-center">
        <img
          src={imageSrc}
          alt=""
          className="rounded new-team-member"
          width={180}
          height={200}
          onError={() => setImageSrc(FallbackImage)}
        />
        <h2 className="font-20 fw-bold pt-2 pb-1">{item?.item_name || ""}</h2>
        <p className="position-relative pt-1">{item?.item_short_desc || ""}</p>
      </div>
    </div>
  );
}

function Chairman({ item }) {
  const [imageSrc, setImageSrc] = useState(getStoragePath(item?.item_image));

  return (
    <div className="col-lg-4 col-md-4 mb-4">
      <div className="text-center">
        <img
          src={imageSrc}
          alt=""
          className="rounded-pill chairman-img"
          width={180}
          height={200}
          onError={() => setImageSrc(FallbackImage)}
        />
        <h2 className="font-20 fw-bold pt-2 pb-2">{item?.item_name || ""}</h2>
        <p className="about_titledesign position-relative pt-2">
          {item?.item_short_desc || ""}
        </p>
      </div>
    </div>
  );
}

const BoardOfDirectors = () => {
  const [boardOfDirectors, setBoardOfDirectors] = useState([]);
  const [md, setMD] = useState(null);
  const [leadershipTeam, setLeadershipTeam] = useState([]);
  const [bannerImageSrc, setBannerImageSrc] = useState(FallbackBanner);

  useEffect(() => {
    fetchBoardOfDirectors().then((response) => {
      if (response?.data) {
        setBoardOfDirectors(response.data[0]?.content_item || []);
      }
    });
  }, []);

  useEffect(() => {
    fetchMD().then((response) => {
      if (response?.data) {
        setMD(response.data[0]?.content_item?.[0] || {});
      }
    });
  }, []);

  useEffect(() => {
    fetchLeadershipTeam().then((response) => {
      if (response?.data) {
        setLeadershipTeam(response.data[0]?.content_item || []);
        setBannerImageSrc(getStoragePath(response.data[0]?.module_image));
      }
    });
  }, []);

  return (
    <Fragment>
      <Head>
        <title>{makeTitle("Board of Directors")}</title>
      </Head>
      <section>
        <div className="">
          <img
            src={bannerImageSrc}
            alt=""
            className="bod-img"
            width={1440}
            height={500}
            onError={() => setBannerImageSrc(FallbackBanner)}
          />
        </div>
        <div className="container-bod">
          <h1 className="bod-page-title text-capitalize font-40 fw-bold text-center py-5 font-inter">
            board of directors
          </h1>

          <div className="" style={{ paddingBottom: "30px" }}>
            <Row className="d-flex justify-content-md-center">
              {boardOfDirectors?.slice(0, 2)?.length
                ? boardOfDirectors
                    .slice(0, 2)
                    .map((item, index) => <Chairman key={index} item={item} />)
                : null}
            </Row>
          </div>

          <div className="row d-flex justify-content-evenly">
            {boardOfDirectors.slice(2)?.length
              ? boardOfDirectors
                  .slice(2)
                  .map((item, index) => <Director key={index} item={item} />)
              : ""}
          </div>

          <h1 className="text-capitalize font-40 fw-bold text-center py-4 font-inter">
            leadership team
          </h1>
          <div className="d-flex justify-content-center">
            {md ? <TeamMD item={md} /> : null}
          </div>
          <div className="row">
            {leadershipTeam?.length
              ? leadershipTeam.map((item, index) => (
                  <TeamMember key={index} item={item} />
                ))
              : ""}
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default BoardOfDirectors;
