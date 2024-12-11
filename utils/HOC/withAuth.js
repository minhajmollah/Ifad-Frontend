import {useRouter} from 'next/router';
import {useEffect} from 'react';
import {isLoggedIn} from "../auth";

const withAuth = (Component) => {
    return (props) => {
        const router = useRouter();

        const isAuthenticated = isLoggedIn();

        useEffect(() => {
            if (!isAuthenticated) {
                const currentPath = router.asPath.replace(/^\//, '');
                localStorage.setItem('redirectTo', currentPath);
                // location.href = '/auth/login';
                router.push('/auth/login');
            }
    }, [isAuthenticated, router.asPath]);

        return isAuthenticated ? <Component {...props} /> : null;
    };
};

export default withAuth;