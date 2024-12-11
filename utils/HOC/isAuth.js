import {useRouter} from 'next/router';
import {useEffect} from 'react';
import {isLoggedIn} from "../auth";

const isAuth = (Component) => {
    return (props) => {
        const router = useRouter();

        const isAuthenticated = isLoggedIn();

        useEffect(() => {
            if (isAuthenticated) {
                router.push('/my-account');
            }
        }, []);

        return !isAuthenticated ? <Component {...props} /> : null;
    };
};

export default isAuth;