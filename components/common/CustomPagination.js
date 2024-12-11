import React from "react";
import {Pagination} from "react-bootstrap";
import _ from "lodash";

function CustomPagination({meta, setPage}) {

    let pageLinks = [];

    if (!_.isEmpty(meta)) {
        let links = meta.links;
        let newLinks = links.slice(1, -1);

        newLinks.map((item, index) => {
            return pageLinks.push(
                <Pagination.Item
                    key={index}
                    active={item.active}
                    onClick={(e) => {
                        e.preventDefault();
                        setPage(item.label);
                    }}>
                    {item.label}
                </Pagination.Item>)
        })
    }

    return (
        pageLinks.length > 1 && (
            <Pagination className="custom-pagination">
                {pageLinks}
            </Pagination>
        )
    );
}

export default CustomPagination;