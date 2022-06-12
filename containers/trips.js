import * as React from "react";
import Trips from "components/page/Trips"
import getT from "next-translate/getT"

const trips = (role) => {
  const wrappedComponent = (props) => (
    <Trips role={role}  dataTrip={props.dataTrip.data} dataPage={props.dataPage.data.category}/>
  );
  return wrappedComponent;
};

export async function getStaticProps({locale}) {
  const t  = await getT(locale , 'all')
  const response1 = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/category/1`,{headers: {language: t('lang')}});
  const response2 = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/trip`,{headers: {language: t('lang')}});

  const dataPage = await response1.json();  
  const dataTrip = await response2.json();  

  if(!dataPage || !dataTrip){
    return {
        redirect:{
          description:"/error"
        }
    }
}
  return {
    props: {
      dataPage,
      dataTrip
    },
    revalidate:100 //3.1s
  }
}

export default trips;