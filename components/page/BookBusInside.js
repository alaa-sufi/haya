import React, { useEffect, useState } from "react";
import NumberToStrignSeat from "@/Functions/NumberToStrignSeat";
import idCard from "public/images/id.svg";
import UserInfoUl from '@/UI/Short/UserInfoUl';
import BlueArea from "@/UI/Short/BlueArea";
import usePage from "hooks/use-Page"
import Image from "next/image";
import { useAuth } from "hooks/use-Auth"
import LoadingSpinner from "@/UI/LoadingSpinner"
import useTranslation from 'next-translate/useTranslation'
export default function BookBusInside({ role, vehicle }) {
  const { t, lang } = useTranslation("all")
  const [stringSeat, setStringSeat] = useState(NumberToStrignSeat(t));
  const { loading, sendRequest, dataPage, setDataPage, errorPage } = usePage();
  const { seat } = 1;
  const { user, isLoading } = useAuth({ middleware: role === 'admin' ? 'auth' : 'user' })
  useEffect(() => {
    sendRequest({ url: `/api/seat/${seat}` }, (data) => { setDataPage(data.data) }, true);
    window.scrollTo(0, 0)

  }, [sendRequest , setDataPage ]);
  if (isLoading || (role === "admin" && !user)){
    return <div className="loading-parent"><LoadingSpinner /></div>
}
  return (
    <BlueArea loading={loading.page} errorPage={errorPage}>
      <UserInfoUl head="h3" phoneNumber={dataPage.phone_number} seatNumber={stringSeat[dataPage.seat_number]} firstName={dataPage.first_name} lastName={dataPage.last_name} email={dataPage.email} />
      <div className="row mt-3 pe-5">
        <div className="col-md-6">
          <h4 className="fw-bold">اسم الأب:</h4>
          <span>{dataPage.father_name}</span>
        </div>
        <div className="col-md-6">
          <h4 className="fw-bold">اسم ونسبة الأم:</h4>
          <span>{dataPage.mother_name}</span>
        </div>
        <div className="col-md-6">
          <h4 className="fw-bold">مكان وتاريخ الولادة:</h4>
          <span>{dataPage.date_of_birthday} </span>
        </div>
        <div className="col-md-6">
          <h4 className="fw-bold">الرقم الوطني:</h4>
          <span>{dataPage.id_number}</span>
        </div>
        <div className="col-md-6">
          <Image src={dataPage.front_idCard ? dataPage.front_idCard : idCard} alt="front_idCard" className="img-idCard w-100 my-3 radius-1" />
        </div>
        <div className="col-md-6">
          <Image src={dataPage.back_idCard ? dataPage.back_idCard : idCard} alt="back_idCard" className="img-idCard w-100 my-3 radius-1" />
        </div>
      </div>
    </BlueArea>
  );
}
