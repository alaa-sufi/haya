import Head from 'next/head'
import React from 'react'
import BlueArea from "components/UI/Short/BlueArea";
import useTranslation from 'next-translate/useTranslation'
export default function Privacy() {
  const { t, lang } = useTranslation("all")
  return (
    <>
      <Head>
        <title>{t("all:al_hayat_company")} - {t("privacy_policy")}</title>
      </Head>
      <BlueArea>
        <h1 className="h-h1">{t("privacy_policy")}</h1>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vitae assumenda sint pariatur, commodi earum itaque animi necessitatibus. Distinctio debitis architecto veritatis, voluptatum, numquam maiores dicta perspiciatis vero eius aperiam rerum.</p>
      </BlueArea>
    </>
  )
}

