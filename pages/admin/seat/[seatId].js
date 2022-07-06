import React, {  useState } from "react";
import {  Person, LocalPhone } from "@mui/icons-material";
import idCard from "public/images/id.svg";
import BlueArea from "@/UI/Short/BlueArea";
import { useRouter } from "next/router";
import useSWR from 'swr'
import Image from "next/image";
import LoadingSpinner from '@/UI/LoadingSpinner';
import NumberToStrignSeat from '@/Functions/NumberToStrignSeat';
import { useAuth } from "hooks/use-Auth"
import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'
import NoInfo from "@/Ui/NoInfo";

export default function AdminBookInside() {
    const {user, isLoading} = useAuth({middleware: 'auth'})
const { t, lang } = useTranslation("all")
    const router = useRouter()

    const [seat, setSeat] = useState(NumberToStrignSeat(t));
    const { data, error } = useSWR(`${process.env.NEXT_PUBLIC_SERVER}/seat/${router.query.seatId}`);
    if(error){
        return(
            <section >
            <div className="container">
                <div className="h-block-blue">
                    <NoInfo error/>
                </div>
            </div>
        </section>
        )
    }
    if (!data) {
        return <LoadingSpinner />
    }
    if (!data.data) {
        return <LoadingSpinner />
    }
    if (isLoading || !user ||!data || !data.data){
        return <div className="loading-parent"><LoadingSpinner/></div>
    }
    return (
        <>
         <Head>
        <title>{t("all:al_hayat_company")} -  تفاصيل المقعد</title>
      </Head>
        <BlueArea >
            <h1>{`المقعد ${seat[data.data.seat_number]}`}</h1>
            <ul className="h-avialabel-trip">
                <li>
                    <Person
                        color="primary"
                        fontSize="small"
                        alt="icon"
                        className="ms-2"
                    />
                    <bdi>{data.data.first_name}</bdi>
                    <bdi> </bdi>
                    <bdi>{data.data.last_name}</bdi>
                </li>
                <li>
                    <a href={`tel:${data.data.phone_number}`}>
                        <LocalPhone
                            color="primary"
                            fontSize="small"
                            alt="icon"
                            className="ms-2"
                        />
                        <bdi>{data.data.phone_number}</bdi>
                    </a>
                </li>
            </ul>
            <div className="row">
                {data.data.father_name && <div className="col-md-6">
                    <h5 className="fw-bold">اسم الأب:</h5>
                    <span>{data.data.father_name}</span>
                </div>}
               {data.data.mother_name && <div className="col-md-6">
                    <h5 className="fw-bold">اسم ونسبة الأم:</h5>
                    <span>{data.data.mother_name}</span>
                </div>}
               {data.data.date_of_birthday && <div className="col-md-6">
                    <h5 className="fw-bold">مكان وتاريخ الولادة:</h5>
                    <span>{data.data.date_of_birthday} </span>
                </div>}
               {data.data.id_number && <div className="col-md-6">
                    <h5 className="fw-bold">الرقم الوطني:</h5>
                    <span>{data.data.id_number}</span>
                </div>}
                <div className="col-md-6 position-relative">
                    <Image  src={data.data.front_idCard ? data.data.front_idCard : idCard} alt={data.data.first_name} className="img-idCard w-100 my-3 rounded-3"  responsive="relative" width="300" height="200" />
                </div>
                <div className="col-md-6 position-relative">
                    <Image src={data.data.back_idCard ? data.data.back_idCard : idCard} alt={data.data.first_name} className="img-idCard w-100 my-3 rounded-3" responsive="relative" width="300" height="200" />
                </div>
            </div>
        </BlueArea>
        </>
    );
}
