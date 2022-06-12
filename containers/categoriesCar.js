import * as React from "react";
import CategoriesCar from "@/page/CategoriesCar"
import getT from "next-translate/getT"

const categoriesCar = (role) => {
  const wrappedComponent = (props) => (
    <CategoriesCar role={role} dataPage={props.dataPage.data.category} dataTrips={props.dataTrips.data.cars} />
  );

  return wrappedComponent;
};

export async function getStaticProps({locale}) {
  const t  = await getT(locale , 'all')
  const response1 = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/category/3`,{headers: {language: t('lang')}});
  const response2 = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/car/available`);
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

export default categoriesCar;