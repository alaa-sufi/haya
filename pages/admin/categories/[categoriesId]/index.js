import * as React from "react";
import CategoriesOther2 from "@/page/CategoriesOther2"
export default function CategoriesOther2Comp ({dataTrips , dataPage}) {
  return(
    <CategoriesOther2 role={"admin"} dataTrips={dataTrips.data.trips} dataPage={dataPage.data.category}/>
  )
};


export async function getServerSideProps(context) {
  const { params } = context;

  const response1 = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/category/${params.categoriesId}`,{headers: {language: context.locale}});
  const response2 = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/trip/category/${params.categoriesId}`,{headers: {language: context.locale}});
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
    props: 
     { dataPage,
      dataTrips
      },
    }
}