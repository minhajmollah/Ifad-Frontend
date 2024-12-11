import React, {useEffect, useState} from "react";
import Link from "next/link";
import {useRouter} from "next/router";

const ActiveLink = ({href, className, children, ...props}) => {
    const router = useRouter();

    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (router.pathname === href) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [router]);

    return (
        <Link href={href} className={className + (isActive ? ' active' : '')} {...props}>
            {children}
        </Link>
    )
};

export default ActiveLink;
