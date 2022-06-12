import * as React from "react";
import loadNamespaces from 'next-translate/loadNamespaces'

import CategoriesOther2 from "@/page/CategoriesOther2"
import getT from "next-translate/getT"

const categoriesOther2 = (role) => {
  const wrappedComponent = (props) => (
    <CategoriesOther2 role={role} dataTrips={props.dataTrips.data.trips} dataPage={props.dataPage.data.category}/>
  );

  return wrappedComponent;
};

export async function getServerSideProps({context}) {
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
      await loadNamespaces({
        ...ctx,
        dataPage,
      dataTrips
      }),
    }
}

export default categoriesOther2;