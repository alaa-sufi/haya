import * as React from "react";
import CategoriesPlane from "@/page/CategoriesPlane"
import getT from "next-translate/getT"

export default function CategoriesPlaneComp({dataPage , dataTrips}) {
  return(
    <CategoriesPlane role={"admin"} dataPage={dataPage.data.category} dataTrips={dataTrips.data.trips} />
  )
};

export async function getStaticProps({locale}) {
const t  = await getT(locale , 'all')
  const response1 = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/category/2`,{headers: {language: t('lang')}});
  const response2 = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/trip/category/2`,{headers: {language: t('lang')}});

  const dataPage = await response1.json();  
  const dataTrips = await response2.json();  


  if(!dataPage || !dataTrips){
    return {
        redirect:{
          description:"/error"
        }
    }
}
  return {
    props: {
      dataPage,dataTrips
    },
    revalidate:100 //3.1s

  }
}

