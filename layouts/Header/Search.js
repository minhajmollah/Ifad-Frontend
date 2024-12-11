import React, { useEffect, useState } from "react";
import { ImSearch } from "react-icons/im";

const Search = () => {
  const [style, setStyle] = useState("addon_text_box");

  const favorite = () => {
    setStyle(style === "addon_text_box" ? "addon_text_box2" : "addon_text_box");
  };
  return (
    <>
      <div className="responsive_form">
        <form
          id="hidden-search-box"
          className="navbar-form hidden-search-box"
          role="search"
        >
          <div className="d-flex">
            <input
              className={`form-control text-black bg-white rounded-0 addon_text_box ${style}`}
              placeholder="Search for"
              type="search"
            />
            <div className="round-btn" id="show-search-box">
              <ImSearch onClick={favorite} className="res_search_icon"/>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Search;
