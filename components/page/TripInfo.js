import React, { useState } from 'react'
import Head from "next/head"
import Weather from "@/UI/Weather"
import img from "public/temp/company1.jpg";
import DeleteModal from "@/Modals/DeleteModal"
import ThreeImgs from "@/UI/ThreeImgs"
import BlueArea from "@/UI/Short/BlueArea";
import ActionButtons from "@/Base/ActionButtons"
import BookInUser from "@/Modals/BookInUser"
import { DateRange, AccessTime, LocalAtm, LocationOn, EventSeat } from '@mui/icons-material';
import { useRouter } from "next/router"
import { useAuth } from "hooks/use-Auth"
import LoadingSpinner from "@/UI/LoadingSpinner"
import useTranslation from 'next-translate/useTranslation'
export default function TripInfo({ type, role, dataPage }) {
    const { t, lang } = useTranslation("all")
    const { user, isLoading } = useAuth({ middleware: role === 'admin' ? 'auth' : 'user' })
    const [nameEdit, setNameEdit] = useState("")
    const [openBookUser, setOpenBookUser] = useState(false)
    const [deleteCompany, setDeleteCompany] = useState(false)
    const [tripId, setTripId] = useState();
    const router = useRouter();
    if (isLoading || (role === "admin" && !user) || router.isFallback ||!dataPage ) {
        return <div className="loading-parent"><LoadingSpinner /></div>
    }
    return (
        <>
            <Head>
                <title>{t("all:al_hayat_company")} - {t("details_of_the_trip")}</title>
            </Head>
            <BlueArea >
                <div className="row align-items-center mb-3">
                    <div className="col-12">
                        {role === "user" &&
                            <Weather city={dataPage.city} />
                        }

                    </div>

                </div>
                {role === "user" && <ThreeImgs image1={dataPage.city.image1} image2={dataPage.city.image2} image3={dataPage.city.image3} />}
                <h1 className="h-h1  text-end mb-3 ">{t("details_of_the_trip")}</h1>
                <div className="row">
                    <div className="col-12">
                        <ul className="h-trip-info-ul gap-lg-5 gap-3 flex-wrap">
                            {type === 'bus' ?
                                <>
                                    <li>
                                        <DateRange color="primary" fontSize="small" alt="icon" className="mx-2" />
                                        {new Date(dataPage.trip.begin_date).toLocaleDateString('zh-Hans-CN')}
                                    </li>
                                    <li>
                                        <AccessTime color="primary" fontSize="small" alt="icon" className="mx-2" />
                                        {dataPage.trip.period} {t("days")}</li>

                                    <li>
                                        <LocalAtm color="primary" fontSize="small" alt="icon" className="mx-2" />
                                        {dataPage.trip.price}{" "}{t("s_p")}</li>
                                    <li>
                                        <EventSeat color="primary" fontSize="small" alt="icon" className="mx-2" />
                                        {dataPage.trip.avilable_seats} {t("available")}</li>
                                    <li>
                                        <LocationOn color="primary" fontSize="small" alt="icon" className="mx-2" />
                                        {t("from")} {dataPage.trip.from_city}</li>
                                    <li>
                                        <LocationOn color="primary" fontSize="small" alt="icon" className="mx-2" />
                                        {t("to")} {dataPage.trip.to_city}</li>
                                </>
                                : type === 'plane' ?
                                    <>
                                        <li>
                                            <DateRange color="primary" fontSize="small" alt="icon" className="mx-2" />
                                            {new Date(dataPage.trip.begin_date).toLocaleDateString('zh-Hans-CN')}
                                        </li>
                                        <li>
                                            <AccessTime color="primary" fontSize="small" alt="icon" className="mx-2" />
                                            {new Date(dataPage.trip.begin_date).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })}
                                        </li>
                                        <li>
                                            <LocationOn color="primary" fontSize="small" alt="icon" className="mx-2" />
                                            {t("from")} {dataPage.trip.from_city}</li>
                                        <li>
                                            <LocationOn color="primary" fontSize="small" alt="icon" className="mx-2" />
                                            {t("to")} {dataPage.trip.to_city}</li>
                                    </>
                                    :
                                    <>
                                        <li>
                                            <DateRange color="primary" fontSize="small" alt="icon" className="mx-2" />
                                            {new Date(dataPage.trip.begin_date).toLocaleDateString('zh-Hans-CN')}
                                        </li>
                                        <li>
                                            <LocalAtm color="primary" fontSize="small" alt="icon" className="mx-2" />
                                            {dataPage.trip.price}{" "}{t("s_p")}</li>
                                        <li>
                                            <LocationOn color="primary" fontSize="small" alt="icon" className="mx-2" />
                                            {t("from")} {dataPage.trip.from_city}</li>
                                        <li>
                                            <LocationOn color="primary" fontSize="small" alt="icon" className="mx-2" />
                                            {t("to")} {dataPage.trip.to_city}</li>
                                    </>
                            }


                        </ul>

                    </div>
                    <div className="col">
                        {role === "user" ?
                            type === "bus" ? <button className="mr-md-auto ml-md-0 mx-auto my-3 d-block h-button2" onClick={() => { setOpenBookUser(true) }}>{t("book_a_journey")}</button>
                                :
                                <a className="mr-md-auto ml-md-0 mx-auto my-3 d-block h-button2 w-max" target="_blank"
                                    rel="noreferrer" href={`https://wa.me/+963999999999`}>{t("book_a_journey")}</a>
                            :
                            <></>
                        }
                    </div>
                </div>
                <p>
                    {dataPage.trip.details}
                </p>
            </BlueArea>
            <BookInUser openModal={openBookUser} onCloseModal={() => { setOpenBookUser(false) }} avilable_seats={dataPage.trip.avilable_seats} />
        </>
    )
}
