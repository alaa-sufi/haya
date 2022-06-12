import * as React from "react";
import TripInfo from "components/page/TripInfo"
const tripInfo = (type, role) => {
  const wrappedComponent = (props) => (
    <TripInfo type={type} role={role} dataPage={props.dataPage.data} />
  );
  return wrappedComponent;
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

export default tripInfo;