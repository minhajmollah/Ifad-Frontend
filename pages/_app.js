import '@/styles/globals.css'
import '../styles/normalize.css';
import '../styles/main.css';
import '../styles/footer.css';
import '../styles/TopManu.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'tailwindcss/tailwind.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {SSRProvider} from 'react-bootstrap';
// import NextNProgress from 'nextjs-progressbar';
/*import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';*/
import AOS from "aos";
import {Fragment, useEffect, useState} from 'react';
import "aos/dist/aos.css";
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify';
import Layout from "../layouts/Layout";
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor, store} from "../store";
import MessengerChatBot from "../components/common/MessengerChatBot";
import PopupBanner from '../components/common/PopupBanner';
import { fetchPopupData } from '../services/CommonServices';

export default function App({Component, pageProps}) {

    useEffect(() => {
        AOS.init({
            easing: "ease-out-cubic",
            once: true,
            offset: 50,
        });
    }, []);

    // https://www.npmjs.com/package/nextjs-progressbar
    const [popupData, setPopupData] = useState(null);
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
      fetchPopupData().then((response) => {
        if (response?.data) {
          // console.log(response.data[0]?.content_item)
          setPopupData(response.data[0]?.content_item);
          setDataLoaded(true);
        }
      });
    }, []);

    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
      const delay = setTimeout(() => {
        const hasVisited = sessionStorage.getItem('hasVisited');

        if (!hasVisited && dataLoaded) {
          setShowPopup(true);
          sessionStorage.setItem('hasVisited', 'visited');
        }
      }, 5000);

      return () => clearTimeout(delay);
    }, [dataLoaded]);

    const closePopup = () => {
      setShowPopup(false);
    };

    return (
        <Fragment>
            <SSRProvider>
                <Layout>
                    {/* <NextNProgress options={{easing: 'ease', speed: 500}}/> */}

                    <Provider store={store}>
                        <PersistGate loading={null} persistor={persistor}>
                            <Component {...pageProps} />
                        </PersistGate>
                    </Provider>

                    <ToastContainer
                        autoClose={2500}
                        position="bottom-right"
                    />

                    <MessengerChatBot />

                    <PopupBanner
                      show={showPopup && dataLoaded}
                      onClose={closePopup}
                      popupData={popupData}
                    />
                </Layout>
            </SSRProvider>
        </Fragment>
    )
}
