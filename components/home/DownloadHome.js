import React, { useState } from 'react'
import { AndroidIcon, AppleIcon } from "public/svg"
import downloadtop from "public/images/downloadtop.png"
import Image from 'next/image'
import useTranslation from 'next-translate/useTranslation'

export default function DownloadHome() {
    const { t, lang } = useTranslation("all")

    const [top, setTop] = useState()
    const [left, setLeft] = useState()
    /**banner-move**/
    function touches(e) {
        var x = e.touches ? e.touches[0].clientX : e.clientX,
            y = e.touches ? e.touches[0].clientY : e.clientY;
        var w = window.innerWidth / 2;
        var h = window.innerHeight / 2;
        var l = 3 * (-(x - w) / (w / 1) - 1);
        var t = 3 * (-(y - h) / (h / 1) - 1);
        setTop(t);
        setLeft(l);
    }
    if (typeof window !== "undefined" && window.innerWidth > "600") {
        window.addEventListener("mousemove", touches);
        window.addEventListener("touchstart", touches);
        window.addEventListener("touchmove", touches);
    }
    return (
        <div className="h-home-download">
            <div className="container">
                <div className="row align-items-center ">
                    <div className="col-md-5 p-md-0 order-1 order-md-0 h-home-download-info">
                        <h2 className="c-blue h-head">{t("download_the_application")}</h2>
                        <p>{t("the_reservation_of_flights_has_become_easier_and_accessible_to_your_hand")}<br />{t("download_the_life_application_for_tourism_now")}</p>
                        <div className="row mb-3">
                            <div className="col-6 ">
                                <a href="#">
                                    <AppleIcon className="w-100 apple appleIcon" />
                                </a>
                            </div>
                            <div className="col-6 ">
                                <a href="#">
                                    <AndroidIcon className="w-100 android androidicon" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-7 p-md-0 order-0 order-md-0 position-relative" >
                        <div className="blue-shape"></div>
                        <div className="h-home-download-man"
                            style={{ left: `${left}%`, top: `${top}%` }}
                        >
                            <Image src={downloadtop} alt="man" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
