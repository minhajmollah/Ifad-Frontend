import React, {Fragment, useEffect, useState} from "react";
import Image from "next/image";
import Api from "../../public/API-footer-logo.png";
import Link from "next/link";
import {FaFacebookF, FaLinkedinIn, FaYoutube, FaTwitter, FaLink} from "react-icons/fa";
import {AiOutlineInstagram} from "react-icons/ai";
import {fetchSocial} from "../../services/CommonServices";
import {BiChevronDown} from "react-icons/bi";

export default function Footer() {
  const [socials, setSocials] = useState([]);

  // fetch
  useEffect(() => {
    fetchSocial().then((response) => {
      if (response?.data) {
        setSocials(response.data[0]?.content_item);
      }
    });
  }, []);

  const linkIconMap = {
    'facebook': <FaFacebookF size="25px" className="footer-soical-link ms-2" />,
    'twitter': <FaTwitter size="25px" className="footer-soical-link ms-2" />,
    'linkedin': <FaLinkedinIn size="25px" className="footer-soical-link ms-2" />,
    'youtube': <FaYoutube size="25px" className="footer-soical-link ms-2" />,
    'instagram': <AiOutlineInstagram size="25px" className="footer-soical-link ms-2" />,
    'default': <FaLink size="25px" className="footer-soical-link ms-2" />,
  };

  return (
      <Fragment>
        <div className="container-fluid footer">
          <div className="container">
            <div className="row">
              <div className="swiper">
                <div className="row position-relative">
                  <div className="col-sm-12 d-flex justify-content-center py-4 border-bottom">
                    <nav className="navbar navbar-expand-md">
                      <div className="container-fluid">
                        <div className="footer-bg-opacity" id="navbarNav">
                          <ul className="navbar-nav text-center bg-phn">
                            <li className="nav-item">
                              <div className="dropdown">
                                <a href="#"
                                   className="my-0 me-1 py-0 nav-link-ifad dropdown-toggle d-flex justify-content-center align-items-center"
                                   type="button" id="dropdownMenuButton1"
                                   data-bs-toggle="dropdown" aria-expanded="false">
                                  about us <BiChevronDown className="ms-1"/>
                                </a>
                                <ul className="dropdown-menu ms-0"
                                    aria-labelledby="dropdownMenuButton1">
                                  <li>
                                    <Link href="/company-profile"
                                          className="dropdown-item">
                                      Who we are
                                    </Link>
                                  </li>
                                  <li>
                                    <Link href="/board-of-directors"
                                          className="dropdown-item">
                                      BOD & Leadership
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </li>
                            <li className="nav-item">
                              <Link
                                  href="/privacy-policy"
                                  className="nav-link-ifad"
                              >
                                privacy & policy
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link
                                  href="/terms-and-conditions"
                                  className="nav-link-ifad"
                              >
                                terms & conditions
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link
                                  href="/refund-policy"
                                  className="nav-link-ifad"
                              >
                                refund policy
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link
                                  href="/delivery-information"
                                  className="nav-link-ifad"
                              >
                                Delivery Information
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </nav>
                  </div>
                </div>
                <div className="row py-3">
                  <div className="col-lg-3">
                    <div className=" d-flex justify-content-center align-items-center">
                      <a href="https://ifadgroup.com/" target="_blank">
                        <img
                            alt="logo"
                            src="/logo/footer-logo.png"
                            className="img-fluid footer-logo"
                            loading="lazy"
                        />
                      </a>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className=" d-flex justify-content-center align-items-center">
                      <nav className="navbar navbar-expand-lg text-center">
                        <ul className="navbar-nav footer_manu_list">
                          <li className="nav-item footer-manu-item">
                            <Link href="/auth/login" className="nav-link-ifad">
                              login
                            </Link>
                          </li>
                          <li className="nav-item footer-manu-item">
                            <Link href="/checkout" className="nav-link-ifad">
                              checkout
                            </Link>
                          </li>
                          <li className="nav-item footer-manu-item">
                            <Link href="/my-account" className="nav-link-ifad">
                              my account
                            </Link>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div
                        className="d-flex justify-content-center align-items-center fs-4 text-white footer-social-icon">
                      <div
                          className="d-flex justify-content-center align-items-center"
                          style={{marginTop: "5px"}}
                      >
                        {socials?.map((social, index) => (
                            <Link
                                key={index}
                                href={social?.item_link}
                                target="_blank"
                            >
                              {linkIconMap[social?.item_link.includes('facebook.com') ? 'facebook' :
                                social?.item_link.includes('linkedin.com') ? 'linkedin' :
                                social?.item_link.includes('twitter.com') ? 'twitter' :
                                social?.item_link.includes('youtube.com') ? 'youtube' :
                                social?.item_link.includes('instagram.com') ? 'instagram' : 'default']}
                            </Link>
                        ))}
                      </div>
                      <div className="call-to-action">
                        <a href="tel:09612114444">
                          <h6 className="footer_number  ps-2 ms-2">
                            09612114444
                          </h6>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row py-3 ">
                  <img src="/payment-full-size.png" alt="payment-logo" className="img-fluid"/>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="text-center shadow-inner footer-bg  ">
          <div className="d-flex justify-content-center position-relative footer_width">
            <p className="text-center text-light p-0 mt-3 mb-3 pe-2 font-lato copyrights">
              © {new Date().getFullYear()} IFAD Group. All Rights Reserved | Developed by{" "}
            </p>
            <Link href="https://apisolutionsltd.com/" target="_blank" className="api_logo">
              <Image src={Api} alt="" className="logo-resize "/>
            </Link>
          </div>
        </footer>
      </Fragment>
  );
}
