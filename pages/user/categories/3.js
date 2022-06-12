import * as React from "react";
import CategoriesCar from "@/page/CategoriesCar"
import getT from "next-translate/getT"

export default function CategoriesCarComp({ dataPage, dataTrips }) {
  return (
    <CategoriesCar role={"user"} dataPage={dataPage.data.category} dataTrips={dataTrips.data.cars} />
  )
};

export async function getStaticProps({locale}) {
  const t  = await getT(locale , 'all')
  const response1 = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/category/3`,{headers: {language: t('lang')}});
  const response2 = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/car/available`,{headers: {language: t('lang')}});
  const dataPage = await response1.json();
  const dataTrips = await response2.json();

  if (!dataPage || !dataTrips) {
    return {
      redirect: {
        description: "/error"
      }
    }
  }
  return {
    props: {
      dataPage, dataTrips
    },
    revalidate: 100 //3.1s

  }
}

