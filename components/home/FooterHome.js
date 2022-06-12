import React from 'react'
import Link from "next/link"
import Image from "next/image"
import {useRouter}from "next/router"
import sand from "public/images/sand.jpg"
import { WhatsappFooter, LocationFooter, FacebookFooter, WebsiteFooter, EmailFooter, LevantFooter} from "public/svg"
import useTranslation from 'next-translate/useTranslation'

export default function FooterHome() {
    const router = useRouter();
    const { t, lang } = useTranslation()

    if((router.pathname === "/") || (router.pathname.startsWith("/user/"))){
    return (
        <footer className="h-home-footer" id="contact">
            <div className="h-home-footer-background">
            <Image src={sand} alt="background" layout='fill'/>
            </div>
            <div className="container">
               <h2 className="h-big">{t("all:connect_with_us")}</h2>
               <div className="row">
                    <div className="col-md-6">
                        <ul className="h-home-footer-ul">
                            <li>
                            <WhatsappFooter width="50" className="px-3"/>
                            <a href={`https://wa.me/09875421591`} >09875421591</a></li>
                            <li>
                            <LocationFooter  width="50" className="px-3"/>
                            {t("all:al_azizia_building_arabism")} </li>
                            <li>
                                <Link href="/user/privacy-policy" className="px-3">
                                    <a >
                                    {t("all:privacy_policy")}
                                    </a>
                                </Link>
                                </li>
                        </ul>
                    </div>
                    <div className="col-md-2 d-md-block d-none"></div>
                    <div className="col-md-4">
                        <ul className="h-home-footer-ul">
                            <li>
                            <EmailFooter width="50" className="px-3"/>
                            <a href={`mailto:email.test.com`} >email.test.com</a></li>
                            <li>
                            <FacebookFooter width="50" className="px-3"/>
                            <a className="text-end" href="https://website.com">facebook</a></li>
                            <li>
                            <WebsiteFooter  width="50" className="px-3"/>
                            <bdi><a href={`website.com`}>website.com</a></bdi></li>
                        </ul>
                    </div>
                    <div className="col-12 text-center my-3">
                        <a href="https://levant.sy/">
                            {'Powered & Designed By Levant Company'}
                            <LevantFooter width="80" className="px-3"/>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )}else{
        return <></>
    }
}
