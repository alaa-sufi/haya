import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Logo } from "public/svg";
import { ExitToApp, NotificationsNone } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { ToggleImg } from "public/svg"
import { useAuth } from "hooks/use-Auth"
import { Modal, Button } from "react-bootstrap";
import { ButtonsField } from '@/UI/Inputs';
import { HeaderField } from "@/UI/Inputs"
import useTranslation from 'next-translate/useTranslation'
import setLanguage from 'next-translate/setLanguage'
import LoadingSpinner from "@/UI/LoadingSpinner";


export default function NavHome() {
  const { t, lang } = useTranslation("all")
  const [langSelect, setLangSelect] = useState(lang || "ar")
  const handleChange = async (lang) => {
    var pathname;
    setLangSelect(lang)
  //   if(window.location.pathname.split("/")[1] === "en" || window.location.pathname.split("/")[1] === "ar" ){
  //     pathname = window.location.pathname.slice(3)
  //    }else{
  //    pathname = window.location.pathname
  //  }
    if (lang === "ar") {
      await setLanguage('ar'); document.documentElement.dir = "rtl"     
      window.location.reload();
      // window.location.href = `${window.location.host}/ar/${pathname}`
    } else {
      await setLanguage('en'); document.documentElement.dir = "ltr"
      window.location.reload();
      // window.location.href = `${window.location.host}/en/${pathname}`
    }
  }
  // usePersistLocaleCookie();

  const router = useRouter()
  const [openLang, setOpenLang] = useState(false);
  const [openCity, setOpenCity] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);
  const [city, setCity] = useState({ value: "aleppo", lable: "حلب" });
  const [top, setTop] = useState()
  const [toggle, setToggle] = useState(false)
  // let { id, type } = useParams();
  let id = 1;
  let type = 1;
  function myFunction() {
    var scrollpercent =
      (document.body.scrollTop + document.documentElement.scrollTop) /
      (document.documentElement.scrollHeight -
        document.documentElement.clientHeight);

    var draw = 10 * scrollpercent;
    setTop(draw)
  }
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", myFunction);
  }
  const { logout , loadingLogout} = useAuth()
  const handleLogout = () => {
    logout()
}
return (
  <>
    <div
      style={{ backgroundPositionX: `${top}%` }}
      className={`${toggle && "open"} h-home-nav ${router.pathname === "/"
        ? ""
        : "user"
        }`}
    >
      <div className="container-fluid">
        <div className="row align-items-start dir-rtl">
          <div className="col-sm-8 col-9 text-right">
            {router.asPath.startsWith("/user") || router.asPath === "/" ?
              <ul className="ul">
                <li>
                  <div className="custom-select">
                    <span onClick={() => { setOpenLang(!openLang) }}>{langSelect === "ar" ? "العربية" : "English"}</span>
                    <ul className={`custom-select-lang ${openLang && "active"}`} >
                      <li className="active" onClick={() => handleChange("ar")}>العربية</li>
                      <li onClick={() => handleChange("en")}>English</li>
                    </ul>
                  </div>
                </li>
                {/* <li>
 {window.location.pathname.split("/")[1] === "user" ? <a href={`${window.location.origin}#contact`}>تواصل معنا</a>:<a href="#contact">تواصل معنا</a>}
 </li> */}
                {router.asPath === "/" && <li>
                  <Link href="/user/about"><a>{t("who_are_we")}</a></Link>
                </li>}
                <li>
                  {/* {location.pathname === "/" ? */}
                </li>
              </ul> :
              <>
                {(router.asPath.startsWith("/admin") || router.asPath.startsWith("/super-admin/")) && <ToggleImg className="h-nav-toggle" width="50" onClick={() => { setToggle(!toggle) }} />}
                {router.asPath === "/super-admin" &&
                  <>
                    <a>
                      <IconButton onClick={(e) => { e.preventDefault(); logout() }}>
                        <ExitToApp color="white" fontSize="large" alt="add" />
                      </IconButton>
                    </a>
                    <Link href={`/super-admin/notification`}>
                      <a>
                        <IconButton>
                          <NotificationsNone color="white" fontSize="large" alt="add" />
                        </IconButton>
                      </a>
                    </Link>
                  </>
                }
              </>
            }

          </div>
          <div className="col-sm-4 col-3">
            <Link href="/">
              <a>
                <Logo />
              </a>
            </Link>
          </div>
        </div>
      </div>
      <div className="h-nav-ul-parent" onClick={() => { setToggle(!toggle) }}>
        <ul className="h-nav-ul">
          {router.asPath.startsWith("/admin") &&
            <>
              <li><Link href="/admin/categories">الأصناف</Link></li>
              <li><Link href="/admin/cities">المواقع</Link></li>
              <li><Link href="/admin/cars-type">أنواع السيارات</Link></li>
              <li><Link href="/admin/order-book">طلبات الحجوزات</Link></li>
              <li><Link href="/admin/order-delivery">طلبات التوصيل</Link></li>
              <li><Link href="/admin/drivers">السائقين</Link></li>
              <li><Link href="/admin/notification">الاشعارات</Link></li>
              <li><Link href="/admin/barren"> الجرد</Link></li>
            </>
          }
          <li><a onClick={() => setOpenLogout(true)} className="cursor-pointer">تسجيل الخروج</a></li>
        </ul>
      </div>
    </div>
    <Modal show={openLogout} onHide={() => setOpenLogout(false)} centered>
      <HeaderField title={`هل أنت متأكد من تسجيل الخروج `} />
      {/* <form onSubmit={handleLogout}> */}
        <Modal.Footer className="d-flex justify-content-center gap-3">
          <Button className="btn h-button position-relative" onClick={handleLogout} >
          {loadingLogout ? <><LoadingSpinner /> <span className="opacity-0">load</span>  </> : "موافق"}
          </Button>
          <span className="btn h-button cancle" onClick={() => setOpenLogout(false)} >الغاء</span>
        </Modal.Footer>
      {/* </form> */}
    </Modal>
  </>

);
}
