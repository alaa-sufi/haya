import * as React from "react";
import TripInfo from "components/page/TripInfo"
export default function TripInfoComp({dataPage}){
  return(
    <TripInfo type={"plane"} role={"admin"} dataPage={dataPage.data} />
  )
};
 
export async function getServerSideProps(context) {
  
  const { params } = context;
  const response1 = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/trip/${params.tripId}`,{headers: {language: context.locale}});
  const dataPage = await response1.json();  

  if(!dataPage){
    return {
        redirect:{
          description:"/error"
        }
    }
}
  return {
    props: { 
      dataPage
    },

  }
}

