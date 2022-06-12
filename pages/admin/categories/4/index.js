import * as React from "react";
import CategoriesHotel from "@/page/CategoriesHotel"
import getT from "next-translate/getT"

export default function CategoriesHotelComp({ dataPage, dataHotels }) {
  return (
    <CategoriesHotel role={"admin"} dataPage={dataPage.data.category} dataHotels={dataHotels.data.hotels} />
  )
};

export async function getStaticProps({locale}) {
  const t  = await getT(locale , 'all')
  const response1 = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/category/4`,{headers: {language: t('lang')}});
  const response2 = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/hotel` ,{headers: {language: t('lang')}});
  const dataPage = await response1.json();
  const dataHotels = await response2.json();

  if (!dataPage || !dataHotels) {
    return {
      redirect: {
        description: "/error"
      }
    }
  }
  return {
    props: {
      dataPage, dataHotels
    },
    revalidate: 100 //3.1s

  }
}

