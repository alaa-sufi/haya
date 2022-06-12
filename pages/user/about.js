import Head from 'next/head'
import React from 'react'
import BlueArea from "components/UI/Short/BlueArea";
import useTranslation from 'next-translate/useTranslation'
export default function About() {
  const { t, lang } = useTranslation("all")
  return (
    <>
      <Head>
        <title>{t("all:al_hayat_company")} - {t("who_are_we")}</title>
      </Head>
      <BlueArea>
        <h1 className="h-h1">{t("who_are_we")}</h1>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iure libero porro neque accusamus commodi magni tenetur voluptatum ullam? Hic ab cum impedit eum necessitatibus aperiam maxime repellat provident? Quas, dicta.</p>
      </BlueArea>
    </>
  )
}

