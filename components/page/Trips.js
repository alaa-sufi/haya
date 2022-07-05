import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Weather from "components/UI/Weather"
import ZoomImages from "components/UI/ZoomImages"
import BlueArea from "components/UI/Short/BlueArea";
import AvailableTrip from "components/Base/AvailableTrip";
import ActionButtons from "components/Base/ActionButtons"
import AddEditBusTrip from "components/Modals/AddEditBusTrip"
import DeleteModal from "components/Modals/DeleteModal"
import Image from "next/image";
import axios from '@/lib/axios';
import add from "public/images/add circle.svg";
import useSWR, { useSWRConfig } from 'swr'

import {
    DateRange, AccessTime, LocalAtm, Room, EventSeat, LocationOn, DirectionsBusFilled,
    DirectionsCar, Edit, Delete
} from '@mui/icons-material';
import NoInfo from "components/UI/NoInfo"
import { IconButton } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import AddEditCategories from "@/Modals/AddEditCategories";
import { useAuth } from "hooks/use-Auth"
import LoadingSpinner from "@/UI/LoadingSpinner"
import useTranslation from 'next-translate/useTranslation'

export default function Trips({ role, dataTrip, dataPage }) {
    const { t, lang } = useTranslation("all")

    const { user, isLoading } = useAuth({ middleware: role === 'admin' ? 'auth' : 'user' })

    const [loadingData, setLoadingData] = useState(true)
    const [addTrip, setAddTrip] = useState(false)
    const [deleteTrip, setDeleteTrip] = useState(false)
    const [deleteTripId, setDeleteTripId] = useState(false)
    const [nameEdit, setNameEdit] = useState("")
    const [deleteCompany, setDeleteCompany] = useState(false)
    const [openCityModal, setOpenCityModal] = useState(false)
    const [fromCities, setFromCities] = useState([])
    const [fromCity, setFromCity] = useState("")
    const [toCities, setToCities] = useState([])
    const [toCity, setToCity] = useState("")
    const [fromCityError, setFromCityError] = useState(false)
    const [toCityError, setToCityError] = useState(false)
    const [tripsError, setTripsError] = useState(false)
    const [trips, setTrips] = useState(dataTrip.trips);
    const [loadingTrips, setLoadingTrips] = useState(false);
    const [editCategory, setEditCategory] = useState(false);
    const [data, setdata] = useState(dataPage)

    const router = useRouter();
    const handleChange = (dataHundle) => {
        setdata({ name: dataHundle.name, image: dataHundle.image, id: data.id })
    }
    const handledelete1 = () => {
        setTrips(trips.filter((x) => x.id !== +deleteTripId));
    }
    const { data: dataPageApi, error: error1 } = useSWR(`${process.env.NEXT_PUBLIC_SERVER}/category/1`);
    const { data: dataTripsApi, error: error2 } = useSWR(`${process.env.NEXT_PUBLIC_SERVER}/trip/category/1`);
    useEffect(() => {
        if (dataTripsApi) {
            setTrips(dataTripsApi.data)
        }
        if (dataPageApi) {
            setdata(dataPageApi.data.category);
            //console.log("dataPageApi",dataPageApi.data.category)
            setLoadingData(false)

        }
    }, [dataPageApi, dataTripsApi])
    useEffect(() => {
        setLoadingTrips(true)
        axios
            .post(`${process.env.NEXT_PUBLIC_SERVER}/city/fromCity`, { 'category_id': 1 })
            .then(res => {
                setFromCities(res.data.data.cities);
                setFromCityError(false)
                setLoadingTrips(false)

            })
            .catch(error => {

                setFromCityError(true);
                setLoadingTrips(false)
            })

    }, [addTrip])
    useEffect(() => {
        setLoadingTrips(true)

        axios
            .post(`${process.env.NEXT_PUBLIC_SERVER}/city/toCity`, { 'category_id': 1, "from_city": fromCity })
            .then(res => {

                setToCities(res.data.data.cities);
                setToCityError(false)
                setLoadingTrips(false)


            })
            .catch(error => {
              
                setToCityError(true)
                setLoadingTrips(false)
            })

    }, [fromCity])
    useEffect(() => {

        setLoadingTrips(true)
        axios
            .get(`${process.env.NEXT_PUBLIC_SERVER}/trip/category/1?${fromCity && `filter[from_city_id]=${fromCity ? fromCity : ""}`}${toCity ? `&filter[to_city_id]=${toCity ? toCity : ""}` : ""}`)
            .then(res => {
                setTrips(res.data.data.trips);
                setTripsError(false);
                setLoadingTrips(false)


            })
            .catch(error => {
               
                setTripsError(true);
                setLoadingTrips(false)
            })



    }, [fromCity, toCity])
    if(error1 || error2){
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
    if (isLoading || (role === "admin" && !user) ||loadingData ||!dataPageApi||!dataTripsApi) {
        return <div className="loading-parent"><LoadingSpinner /></div>
    }
    return (
        <>
            <Head>
                <title>{t("all:al_hayat_company")} - {dataPage.name}</title>
            </Head>
            <BlueArea  >
                <div className="row">
                    {role !== "user" && <div className="col-md-3 col-2">
                        <ActionButtons icons={[{ icon: "edit", link: false, onOpenModal: () => setEditCategory(true) }]} />
                    </div>}
                    {role !== "user" &&
                        <button className="h-add-drivers" onClick={() => router.push(`/admin/categories/1/add-trip`)}>
                            <Image src={add} alt="alt" width="50" height="50" />
                        </button>
                    }
                </div>
               <h1 className="h-h1">{data.name}</h1>
                <div className="row ">
                    <div className="col-md-6 d-flex gap-2 justify-content-center align-items-center mb-4">
                        {t("from")}
                        <select className='h-input form-control m-0 light' onChange={(e) => { setFromCity(e.target.value) }} value={fromCity}>
                            <option value=""> {t("choose_a_city")}</option>
                            {(fromCities && !fromCityError) && fromCities.map((fromC, index) => (
                                <option key={index} value={fromC.id}>{fromC.name}</option>
                            ))}
                        </select>

                    </div>
                    <div className="col-md-6 d-flex gap-2 justify-content-center align-items-center mb-4">
                        {t("to")}
                        <select className='h-input form-control m-0 light' onChange={(e) => { setToCity(e.target.value) }} value={toCity}>
                            <option value="">{t("choose_a_city")}</option>
                            {(toCities && !toCityError) && toCities.map((toc, index) => (
                                <option key={index} value={toc.id}>{toc.name}</option>
                            ))}
                        </select>

                    </div>
                </div>
                <h2 className="h-h1">{t("savings_trips")}</h2>
                <div className="position-relative">
                    {loadingTrips ? <LoadingSpinner /> :
                        <div className="h-city">
                            <div className="row position-relative">
                                {trips.length ? (
                                    trips.map((trip) => (
                                        <div className="col-lg-4 col-md-6 " key={trip.id}>
                                            <ul className="h-avialabel-trip islink radius-2">
                                                <Link href={`${router.asPath}/trip/${trip.id}`}>
                                                    <a className="h-global-a"></a>
                                                </Link>
                                                <li>
                                                    <DateRange color="primary" fontSize="small" alt="icon" className="mx-2" />
                                                    {new Date(trip.begin_date).toLocaleDateString('zh-Hans-CN')}
                                                </li>
                                                <li>
                                                    <AccessTime color="primary" fontSize="small" alt="icon" className="mx-2" />
                                                    {trip.period} {t("days")}</li>
                                                <li>
                                                    <LocalAtm color="primary" fontSize="small" alt="icon" className="mx-2" />
                                                    {trip.price} {t("s_p")}</li>
                                                <li>
                                                    <LocationOn color="primary" fontSize="small" alt="icon" className="mx-2" />
                                                    {t("from")} {trip.from_city}</li>
                                                <li>
                                                    <LocationOn color="primary" fontSize="small" alt="icon" className="mx-2" />
                                                    {t("to")} {trip.to_city}</li>
                                                <li className="text-start  z-8 position-relative">
                                                    {role !== "user" &&
                                                        <>
                                                            <IconButton className="z-2"

                                                            >
                                                                <Link href={`/admin/categories/1/bus-company/${trip.id}`}>
                                                                    <a >
                                                                        <DirectionsBusFilled color="primary" fontSize="small" alt="edit" />
                                                                    </a>
                                                                </Link>
                                                            </IconButton>
                                                            <IconButton className="z-2"
                                                                onClick={() => {
                                                                    setDeleteTrip(true);
                                                                    setDeleteTripId(trip.id);
                                                                }}
                                                            >
                                                                <Delete
                                                                    color="primary"
                                                                    fontSize="small"
                                                                    alt="delete"
                                                                />
                                                            </IconButton>
                                                        </>

                                                    }
                                                </li>
                                            </ul>
                                        </div>
                                    ))
                                ) : (
                                    <></>
                                    // <NoInfo size="small" />
                                )}
                            </div>
                        </div>
                    }
                </div>
            </BlueArea>
            <AddEditCategories openModal={editCategory} onCloseModal={() => { setEditCategory(false) }} edit dataEdit={{ name: data.name, image: data.image }} handleChange={handleChange} editId={1} />
            <AddEditBusTrip openModal={addTrip} onCloseModal={() => { setAddTrip(false) }} add />
            {deleteTrip && (
                <DeleteModal
                    openModal={deleteTrip}
                    name={`  الرحلة  ${trips.find((x) => x.id === +deleteTripId).name || ""
                        }`}
                    url={`/trip/${deleteTripId}`}
                    onCancle={() => setDeleteTrip(false)}
                    handledelete1={handledelete1}
                />
            )}
        </>
    )
}
