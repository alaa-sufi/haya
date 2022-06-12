import * as React from "react";
import UserBook from "components/page/UserBook"
import getT from "next-translate/getT"

const userBook = (vehicle) => {
  const wrappedComponent = (props) => (
    <UserBook  vehicle={vehicle} dataPage={props.dataPage.data} />
  );
  return wrappedComponent;
};
   
export async function getStaticProps({locale}) {
  const t  = await getT(locale , 'all')
  const response1 = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/city/1`,{headers: {language: t('lang')}});
  const dataPage = await response1.json();  

  if(!dataPage ){
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
    revalidate:100 //3.1s

  }
}

export default userBook;