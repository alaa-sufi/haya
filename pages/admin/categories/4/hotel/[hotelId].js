import * as React from "react";
import HotelInfo from "components/page/HotelInfo"
export default function HotelInfoComp({dataPage,dataHotelCategory}) {
  return(
    <HotelInfo  role={"admin"} dataPage={dataPage.data} dataHotelCategory={dataHotelCategory.data.hotelCategories} />
  )
};
 
export async function getServerSideProps(context) {
  
  const { params } = context;
  const response1 = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/hotel/${params.hotelId}`,{headers: {language: context.locale}});
  const dataPage = await response1.json();  
  const response2 = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/hotelCategory/hotel/${params.hotelId}`,{headers: {language: context.locale}});
  const dataHotelCategory = await response2.json();  

  if(!dataPage || !dataHotelCategory){
    return {
        redirect:{
          description:"/error"
        }
    }
}
  return {
    props: { 
      dataPage,dataHotelCategory
    },

  }
}

