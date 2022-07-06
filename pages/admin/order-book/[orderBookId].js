import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import BlueArea from "@/UI/Short/BlueArea";
import NumberToStrignSeat from "@/Functions/NumberToStrignSeat";
import { LocationOn } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import img from "public/temp/company1.jpg";
import UserInfoUl from '@/UI/Short/UserInfoUl';
import LoadingSpinner from '@/UI/LoadingSpinner';
import useSWR, { useSWRConfig } from 'swr'
import axios from '@/lib/axios'
import { useAuth } from "hooks/use-Auth"
import toast from "react-hot-toast";
import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'
import NoInfo from "@/Ui/NoInfo";

export default function AdminOrderBookInside() {
    const { t, lang } = useTranslation("all")
    const {user, isLoading} = useAuth({middleware: 'auth'})

    const router = useRouter()
    const [alldata, setAlldata] = useState([])
    const [paid, setPaid] = useState()
    const [loadingButton, setLoadingButton] = useState(false)
    const [stringSeat, setStringSeat] = useState(NumberToStrignSeat(t));
    const { data, error } = useSWR(`${process.env.NEXT_PUBLIC_SERVER}/booking/${router.query.orderBookId}`);
    useEffect(() => {
        setPaid(router.query.paid);
    }, [router])
    const backOrderBook = () => {
        setLoadingButton(true)
        axios
            .post(`${process.env.NEXT_PUBLIC_SERVER}/paidDone/${router.query.orderBookId}`)
            .then((response) => {
                router.push("/admin/order-book");
        setLoadingButton(false)

            })
            .catch((error) => {
                console.error("There was an error!", error);
                setLoadingButton(false)
                toast.error("عذرا حدثت مشكلة ما");

        setLoadingButton(false)

            });
    }
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
    if (isLoading || !user ){
        return <div className="loading-parent"><LoadingSpinner/></div>
    }
    return (
        <>
         <Head>
        <title>{t("all:al_hayat_company")} - تفاصيل طلبات التوصيل </title>
      </Head>
        <BlueArea >
            <h1 className="h-h1  text-end mb-3 small">
                <bdi>{data.data.city}</bdi>
                <bdi>{" - "}</bdi>
                <bdi>{data.data.seat_count}</bdi>
                <bdi>{" أشخاص "}</bdi>
                <bdi>{data.data.with_delivery ? " - " : ""}</bdi>
                <bdi>{data.data.with_delivery ? " توصيل سيارة " : ""}</bdi>
            </h1>
            <h5>
                <LocationOn color="primary" fontSize="small" alt="icon" className="ms-2" />
                <bdi>{data.data.region}</bdi> - <bdi>{data.data.street}</bdi>
            </h5>
            <div className="row">
                {data.data.seats && data.data.seats.map((seat, index) => (
                    <div className="col-md-6 mb-3" key={index}>
                        <UserInfoUl head="h4" seatNumber={stringSeat[seat.seat_number]} firstName={seat.first_name} lastName={seat.last_name} phoneNumber={seat.phone_number}  link={`/admin/seat/${seat.id}`} />
                    </div>
                ))}
            </div>

            {paid === 'false' && <button className="btn h-button2 me-auto d-block position-relative  " onClick={() => { backOrderBook() }}>
                {loadingButton ? <><LoadingSpinner small/><span className="opacity-0">load</span></> : "تثبيت الحجز"}
                </button>}
        </BlueArea>
        </>
    );
}
