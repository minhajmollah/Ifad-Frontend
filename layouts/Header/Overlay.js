import {useRef, Fragment} from 'react';
import {AiOutlineBars} from "react-icons/ai";
import Link from "next/link";
import NavDropdown from "react-bootstrap/NavDropdown";

function Overlay() {
    const overlayRef = useRef();

    const openSearch = () => {
        overlayRef.current.style.width = '100%';
    };

    const closeSearch = () => {
        overlayRef.current.style.width = '0%';
    };

    return (
        <Fragment>
            <div className='main'>
                <button onClick={openSearch} className='open-button'>
                    <AiOutlineBars className='font-30 overlay-icon me-4'/>
                </button>
            </div>

            <div ref={overlayRef} className='overlay'>
                <button className='close-button' onClick={closeSearch}>
                    &times;
                </button>
                <div className='overlay-content text-uppercase font-24 fw-semibold'>
                    <ul className='lh-lg font-20'>
                        <li>
                            <Link href="/" onClick={closeSearch} className='overlay-content-itema'>home</Link>
                        </li>
                        <li>
                            <NavDropdown
                                className="p-0  rounded-0 about-btn"
                                title={
                                    <span
                                        className="overlay-content-itema text-white text-inter py-2 font-20 me-3 d-flex all-side-icons align-items-center ">about us</span>
                                }
                                id="navbarScrollingDropdown"
                            >
                                <NavDropdown.Item className="text-capitalize all-icons text-dark px-4 py-2 d-block">
                                    <Link href="/company-profile" className="cate-drop" onClick={closeSearch}>
                                        who we are
                                    </Link>
                                </NavDropdown.Item>
                                <NavDropdown.Item className="text-capitalize all-icons text-dark px-4 py-2 d-block">
                                    <Link href="/board-of-directors" className="cate-drop" onClick={closeSearch}>
                                        BOD & Leadership
                                    </Link>
                                </NavDropdown.Item>
                            </NavDropdown>
                        </li>
                        <li>
                            <Link href="/delivery-information" onClick={closeSearch}
                                  className='overlay-content-itema'>delivery information</Link>
                        </li>
                        <li>
                            <Link href="/contact" onClick={closeSearch}
                                  className='overlay-content-itema'>contacts</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </Fragment>
    );
}

export default Overlay;