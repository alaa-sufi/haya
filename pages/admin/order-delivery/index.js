import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Pagination } from '@mui/material';
import { Tabs, Tab } from 'react-bootstrap';
import BlueArea from "@/UI/Short/BlueArea";
import useSWR, { useSWRConfig } from 'swr'
import ShowOrderWait from "@/Modals/ShowOrderWait"
import ShowOrderAccept from "@/Modals/ShowOrderAccept"
import { useAuth } from "hooks/use-Auth"
import LoadingSpinner from "@/UI/LoadingSpinner"
import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'
import NoInfo from "@/ui/NoInfo"

export default function OrderDelivery() {
    const {user, isLoading} = useAuth({middleware: 'auth'})
const { t, lang } = useTranslation("all")
    const { mutate } = useSWRConfig()
    const router = useRouter()
    const [waitPage, setPaidPage] = useState(1);
    const [waitData, setWaitData] = useState(null);
    const [acceptData, setAcceptData] = useState(null);
    const [showOrderWait, setShowOrderWait] = useState(false);
    const [showOrderAccept, setShowOrderAccept] = useState(false);
    const [acceptPage, setNotPaidPage] = useState(1);
    const waitUrl = `${process.env.NEXT_PUBLIC_SERVER}/deliveryBookings?page=${waitPage}`
    const acceptUrl = `${process.env.NEXT_PUBLIC_SERVER}/acceptDeliveryBookings?page=${acceptPage}`
    const { data: wait, error: errorWait } = useSWR(waitUrl);
    const { data: accept, error: errorAccept } = useSWR(acceptUrl);
    const handleChangeWait = () => {
        mutate(waitUrl);
        mutate(acceptUrl);
    }
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(wait && accept ? false : true)
    }, [wait, accept])
    if(errorWait || errorAccept){
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
      if (isLoading || !user ||!wait || !accept){
        return <div className="loading-parent"><LoadingSpinner/></div>
    }
    return (
        <>
         <Head>
        <title>{t("all:al_hayat_company")} - طلبات التوصيل</title>
      </Head>
            <BlueArea  >
                <h1 className="h-h1 text-center ">طلبات التوصيل</h1>
                {loading ?
                    <LoadingSpinner />
                    :
                    <Tabs defaultActiveKey="wait" id="uncontrolled-tab-example" className="mb-3 h-order-book">
                        <Tab eventKey="wait" title="طلبات معلقة">
                            {wait && wait.data.map((paidbook, i) => (
                                <div key={i}>
                                    <span className="c-blue fw-bold p-3 d-block">{paidbook.date}</span>
                                    {paidbook.list && paidbook.list.map((wait, j) => (
                                        <button key={`${i}-${j}`} className="h-tap-block-element" onClick={() => { setShowOrderWait(true); setWaitData(wait) }}>
                                            <span>{new Date(wait.begin_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}&nbsp;</span>-<bdi>&nbsp; {wait.region} &nbsp;</bdi>-<bdi>&nbsp;{wait.seat_count}&nbsp;</bdi><bdi> شخص  </bdi>{" "}<bdi>{wait.with_delivery ? " - " : ""}</bdi>
                                            <bdi>{wait.with_delivery ? " توصيل سيارة " : ""}</bdi>
                                        </button>
                                    ))}
                                </div>
                            ))}
                            {!loading && <Pagination count={wait && wait.total} color="primary" page={waitPage} onChange={(event, value) => { { setPaidPage(value); mutate(waitUrl) } }} />}
                        </Tab>
                        <Tab eventKey="notpaid" title="طلبات مقبولة">
                            {accept && accept.data.map((notpaidbook, i) => (
                                <div key={`n${i}`}>
                                    <span className="c-blue fw-bold p-3 d-block">{notpaidbook.date}</span>
                                    {notpaidbook.list && notpaidbook.list.map((accept, j) => (
                                        <button key={`${i}-${j}`} className="h-tap-block-element" onClick={() => { setShowOrderAccept(true); setAcceptData(accept) }}>
                                            <span>{new Date(accept.begin_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}&nbsp;</span>-<bdi>&nbsp; {accept.region} &nbsp;</bdi>-<bdi>&nbsp;{accept.seat_count}&nbsp;</bdi><bdi> شخص  </bdi>{" "}<bdi>{accept.with_delivery ? " - " : ""}</bdi>
                                            <bdi>{accept.with_delivery ? " توصيل سيارة " : ""}</bdi>
                                        </button>
                                    ))}
                                </div>
                            ))}
                            {!loading && <Pagination count={accept && accept.total} color="primary" page={acceptPage} onChange={(event, value) => { setNotPaidPage(value); mutate(acceptUrl) }} />}
                        </Tab>
                    </Tabs>
                }
            </BlueArea>
            {waitData && <ShowOrderWait openModal={showOrderWait} onCloseModal={() => setShowOrderWait(false)} data={waitData} handleChangeWait={handleChangeWait} />}
            {acceptData && <ShowOrderAccept openModal={showOrderAccept} onCloseModal={() => setShowOrderAccept(false)} data={acceptData} />}
        </>
    );
}
