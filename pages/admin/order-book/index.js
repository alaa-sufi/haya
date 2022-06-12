import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Pagination } from '@mui/material';
import { Tabs, Tab } from 'react-bootstrap';
import BlueArea from "@/UI/Short/BlueArea";
import useSWR, { useSWRConfig } from 'swr'
import LoadingSpinner from "@/UI/LoadingSpinner"
import { useAuth } from "hooks/use-Auth"
import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'
import NoInfo from "@/ui/NoInfo"

export default function AdminOrderBook() {
    const {user, isLoading} = useAuth({middleware: 'auth'})
const { t, lang } = useTranslation("all")
    const { mutate } = useSWRConfig()
    const router = useRouter()
    const [paidPage, setPaidPage] = useState(1);
    const [notPaidPage, setNotPaidPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const paidUrl = `${process.env.NEXT_PUBLIC_SERVER}/paidBooking?page=${paidPage}`
    const notPaidUrl = `${process.env.NEXT_PUBLIC_SERVER}/notPaidBooking?page=${notPaidPage}`
    const { data: paid, error: errorPaid } = useSWR(paidUrl);
    const { data: notPaid, error: errorNotPaid } = useSWR(notPaidUrl);
    useEffect(() => {
        setLoading(paid && notPaid ? false : true)
    }, [paid, notPaid])
    if(errorPaid || errorNotPaid){
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
    if (isLoading || !user ||!paid || !notPaid){
        return <div className="loading-parent"><LoadingSpinner/></div>
    }
    return (
        <>
          <Head>
        <title>{t("all:al_hayat_company")} - طلبات الحجوزات</title>
      </Head>
        <BlueArea  >
            <h1 className="h-h1 text-center ">طلبات الحجوزات</h1>
            {loading ?
                <LoadingSpinner />
                :
                <Tabs defaultActiveKey="paid" id="uncontrolled-tab-example" className="mb-3 h-order-book">
                    <Tab eventKey="paid" title="مدفوع">
                        {paid && paid.data.map((paidbook, i) => (
                            <div key={i}>
                                <span className="c-blue fw-bold p-3 d-block">{paidbook.date}</span>
                                {paidbook.list && paidbook.list.map((paid, j) => (
                                    <Link
                                        href={`${router.asPath}/${paid.id}?paid=true`}

                                        key={`${i}-${j}`}
                                    >
                                        <a className="h-tap-block-element">
                                            <span>{paid.booking_name}</span> - <bdi>{paid.seat_count} </bdi><bdi> شخص  </bdi>{" "}<bdi>{paid.with_delivery ? " - " : ""}</bdi>
                                            <bdi>{paid.with_delivery ? " توصيل سيارة " : ""}</bdi>
                                        </a>
                                    </Link>
                                ))}
                            </div>
                        ))}
                        {!loading && <Pagination count={paid && paid.total} color="primary" page={paidPage} onChange={(event, value) => { setPaidPage(value); mutate(paidUrl) }} />}

                    </Tab>
                    <Tab eventKey="notpaid" title="غير مدفوع">
                        {notPaid && notPaid.data.map((notpaidbook, i) => (
                            <div key={`n${i}`}>
                                <span className="c-blue fw-bold p-3 d-block">{notpaidbook.date}</span>
                                {notpaidbook.list && notpaidbook.list.map((notPaid, j) => (
                                    <Link
                                        href={`${router.asPath}/${notPaid.id}?paid=false`}

                                        key={`${i}-${j}`}
                                    >
                                        <a className="h-tap-block-element">
                                            <span>{notPaid.booking_name}</span> - <bdi>{notPaid.seat_count} </bdi><bdi> شخص  </bdi>{" "}<bdi>{notPaid.with_delivery ? " - " : ""}</bdi>
                                            <bdi>{notPaid.with_delivery ? " توصيل سيارة " : ""}</bdi>
                                        </a>
                                    </Link>
                                ))}
                            </div>
                        ))}
                        {!loading && <Pagination count={notPaid && notPaid.total} color="primary" page={notPaidPage} onChange={(event, value) => { setNotPaidPage(value); mutate(notPaidUrl) }} />}
                    </Tab>
                </Tabs>
            }
        </BlueArea>
        </>
    );
}
