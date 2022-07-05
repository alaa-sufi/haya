/* eslint-disable @next/next/no-css-tags */
import "bootstrap/dist/css/bootstrap.min.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/zoom";
import Router from "next/router";
import NProgress from "nprogress";
import { createTheme, ThemeProvider } from "@mui/material";
import useTranslation from 'next-translate/useTranslation'
import "public/css/all.min.css"
import useSWR, { SWRConfig } from 'swr'
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());
NProgress.configure({ showSpinner: false });
import Nav from "@/home/NavHome";
import { Toaster } from "react-hot-toast";
import Head from 'next/head';
import Footer from "@/home/FooterHome";
import LoadingSpinner from "@/UI/LoadingSpinner";
import axios from '@/lib/axios'

const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(0, 173, 238)",
    },
    white: {
      main: "rgb(255,255,255)",
    },
  },
});
function MyApp({ Component, pageProps }) {
  const { t, lang } = useTranslation()
  if (Component.getLayout) {
    return (
      <SWRConfig
        value={{
          // refreshInterval: 3000,
          // fetcher: (resource, init) => fetch(resource, {headers:{ language: lang} }).then(res => res.json())
          fetcher: (url) => axios.get(url).then(res => res.data)
        }}
      >
        <ThemeProvider theme={theme}>
          <Head>
            <HeadShort />
          </Head>
          {/* {loading && <div className="loading-parent"><LoadingSpinner/></div> } */}
          <Toaster position="bottom-right" />
          <Component {...pageProps} />
        </ThemeProvider>
      </SWRConfig>
    );
  }
  return (
    <SWRConfig
      value={{
        // refreshInterval: 3000,
        fetcher: (url) => axios.get(url).then(res => res.data)
      }}
    >
      <ThemeProvider theme={theme}>
        <Head>
          <HeadShort />
        </Head>
        {/* {loading && <div className="loading-parent"><LoadingSpinner/></div>} */}
        <Nav />
        <Toaster position="bottom-right" />
        <Component {...pageProps} />
        <Footer />
      </ThemeProvider>
    </SWRConfig>
  );
}
function HeadShort() {
  const { t, lang } = useTranslation();
  var dir;

  return (
    <>
      <html lang={lang} />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="theme-color" content="#ffffff" />
      <meta property="og:image" content="template-Landscape-min.jpg" />
      <meta property="og:image:width" content="1024" />
      <meta property="og:image:height" content="512" />
      <meta property="og:image" content="template-Portrait-min.jpg" />
      <meta property="og:image:width" content="800" />
      <meta property="og:image:height" content="1200" />
      <meta property="og:image" content="template-Facebook-min.jpg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta property="og:image" content="template-Linkedin-min.jpg" />
      <meta property="og:image:width" content="180" />
      <meta property="og:image:height" content="110" />

      <meta property="og:image" content="template-Pinterest-min.jpg" />
      <meta property="og:image:width" content="736" />
      <meta property="og:image:height" content="1128" />
      <meta name="description" content="Free Web tutorials"/>

    </>
  )

}
export default MyApp;
