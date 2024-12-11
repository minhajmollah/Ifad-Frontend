import React from "react";

function LoaderOverly({active, children}) {
    return (
        <div className="loader-overly position-relative">
            {active && (
                <div
                    className="position-absolute bg-white w-100 h-100 z-index-2 opacity-4 rounded-3 d-flex justify-content-center">
                    {/*<span className="text-white mt-8 fs-4">
                        Loading...
                        <img src="https://media.tenor.com/v_OKGJFSkOQAAAAC/loading-gif.gif" alt=""/>
                    </span>*/}
                </div>
            )}

            {children}
        </div>
    );
}

export default LoaderOverly;