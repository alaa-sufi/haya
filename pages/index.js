import Head from 'next/head'
import React from 'react'
import CarouselHome from "@/home/CarouselHome"
import DownloadHome from "@/home/DownloadHome"
import ServicesHome from "@/home/ServicesHome"
import useTranslation from 'next-translate/useTranslation'
import getT from "next-translate/getT"

export default function Home({categoryData }) {
  const { t, lang } = useTranslation()

  return (
    <>
      <Head>
        <title>{t("all:al_hayat_tourism_and_travel_company")}</title>
      </Head>
      <div className="h-home">
        <CarouselHome data={categoryData.data.categories}/>
        <DownloadHome />
        <ServicesHome />
      </div>
    </>
  )
}


export async function getStaticProps({locale}) {
  const t  = await getT(locale , 'all')
  const response1 = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/category`,{headers: {language: t('lang')}});
  const categoryData = await response1.json();  

  if(!categoryData){
    return {
        redirect:{
          description:"/error"
        }
    }
}
  return {
    props: {
      categoryData
    },
    revalidate:100 //3.1s

  }
}

