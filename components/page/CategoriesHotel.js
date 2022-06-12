import Head from "next/head";
import React, { useState, useEffect } from "react";
import BlueArea from "components/UI/Short/BlueArea";
import Image from "next/image";
import SeatCount from "@/Functions/SeatCount";
import ActionButtons from "components/Base/ActionButtons";
import AddEditCategories from "@/Modals/AddEditCategories";
import AddEditHotel from "@/Modals/AddEditHotel";
import DeleteModal from "@/Modals/DeleteModal";
import add from "public/images/add circle.svg";
import { Edit, AddCircle, Delete, DirectionsBus, AirportShuttle, LocationOn } from "@mui/icons-material";
import { IconButton, Badge } from "@mui/material";
import NoInfo from "components/UI/NoInfo";
import useSWR, { useSWRConfig } from 'swr'
import Link from "next/link";
import axios from '@/lib/axios';

import {
    LocalAtm,
    EventSeat,
    DirectionsCar,
    Luggage
} from "@mui/icons-material";
import { useAuth } from "hooks/use-Auth"
import LoadingSpinner from "@/UI/LoadingSpinner"
import useTranslation from 'next-translate/useTranslation'
export default function CategoriesHotel({ dataPage, dataHotels, role }) {
    const { t, lang } = useTranslation("all")
    const { user, isLoading } = useAuth({ middleware: role === 'admin' ? 'auth' : 'user' })
    const [editCategory, setEditCategory] = useState(false);
    const [addHotel, setAddHotel] = useState(false);
    const [editHotel, setEditHotel] = useState(false);
    const [hotels, setHotels] = useState(dataHotels);
    const [editHotelId, setEditHotelId] = useState(null);
    const [deleteHotel, setDeleteHotel] = useState(null);
    const [deleteHotelId, setDeleteHotelId] = useState(null);
    const [fromCities, setFromCities] = useState([])
    const [fromCity, setFromCity] = useState("")
    const [fromCityError, setFromCityError] = useState(false)
    const [data, setdata] = useState(dataPage)
    const [loadingHotels, setLoadingHotels] = useState(false);

    const { data: dataPageApi, error: error1 } = useSWR(`${process.env.NEXT_PUBLIC_SERVER}/category/4`);
    const { data: dataHotelsApi, error: error2 } = useSWR(`${process.env.NEXT_PUBLIC_SERVER}/hotel`);
    useEffect(() => {
        if (dataHotelsApi) {
            setHotels(dataHotelsApi.data.hotels)
        }
        if (dataPageApi) {
            setdata(dataPageApi.data.category)
        }
    }, [dataPageApi, dataHotelsApi])
    useEffect(() => {
        setLoadingHotels(true)
        axios
            .get(`${process.env.NEXT_PUBLIC_SERVER}/city/hotel`)
            .then(res => {
                setFromCities(res.data.data.cities);
                setFromCityError(false)
                setLoadingHotels(false)

            })
            .catch(error => {
                if (error.response.status !== 409) {
                    setFromCityError(true);
                    setLoadingHotels(false)

                }
            })

    }, [addHotel])

    useEffect(() => {

        setLoadingHotels(true)
        axios
            .get(`${process.env.NEXT_PUBLIC_SERVER}/hotel?${fromCity && `filter[city_id]=${fromCity ? fromCity : ""}`} : ""}`)
            .then(res => {
                setHotels(res.data.data.hotels);
                setLoadingHotels(false)


            })
            .catch(error => {
                if (error.response.status !== 409) {
                    setLoadingHotels(false)

                }
            })



    }, [fromCity])
    const handleChangeAdd = (value) => {
        setHotels([value, ...hotels]);
    };
    const handleChangeEdit = (value) => {
        setHotels(hotels.map((x) => (x.id == editHotelId ? value : x)));
        setEditHotelId(null)
    };
    const handledelete1 = () => {
        setHotels(hotels.filter((x) => x.id !== +deleteHotelId));
    };
    const handleChange = (dataHundle) => {
        setdata({ name: dataHundle.name, image: dataHundle.image, id: data.id })
    }
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
    if (isLoading || (role === "admin" && !user) || !dataPageApi || !dataHotelsApi) {
        return <div className="loading-parent"><LoadingSpinner /></div>
    }
    return (
        <>
            <Head>
                <title>{t("all:al_hayat_company")} - {data.name}</title>
            </Head>
            <BlueArea >
                {role !== "user" &&
                    <button className="h-add-drivers" onClick={() => setAddHotel(true)}>
                        <Image src={add} alt="alt" width="50" height="50" />
                    </button>
                }
                <div className="row">
                    {role !== "user" && (
                        <div className="col-md-3 col-2">
                            <ActionButtons
                                icons={[
                                    {
                                        icon: "edit",
                                        link: false,
                                        onOpenModal: () => setEditCategory(true),
                                    },
                                ]}
                            />
                        </div>
                    )}
                </div>
                <h1 className="h-h1">{data.name}</h1>
                <div className="row ">
                    <div className="col-md-6 d-flex gap-2 justify-content-center align-items-center mb-4">
                        {t("city")}
                        <select className='h-input form-control m-0 light' onChange={(e) => { setFromCity(e.target.value) }} value={fromCity}>
                            <option value=""> {t("choose_a_city")}</option>
                            {(fromCities && !fromCityError) && fromCities.map((fromC, index) => (
                                <option key={index} value={fromC.id}>{fromC.name}</option>
                            ))}
                        </select>

                    </div>

                </div>
                <div className="h-city">
                    <div className="row position-relative">
                        {loadingHotels ? <LoadingSpinner /> :
                            hotels.length ? (
                                hotels.map((data) => (
                                    <div className="col-md-6 mb-3" key={data.id}>
                                        <div className=" h-avialabel-trip islink radius-2 position-relative">
                                            <div className="row">
                                                <div className="col-sm-6  p-0 px-sm-3">
                                                    <Link href={`/${role}/categories/4/hotel/${data.id}`}  >
                                                        <a className="h-global-a"></a>
                                                    </Link>
                                                    <Image
                                                        src={data.image}
                                                        width="100"
                                                        height="100"
                                                        layout="responsive"
                                                        className="rounded-3 w-100 object-cover"
                                                        alt={data.name}
                                                    />
                                                </div>
                                                <ul className="col-sm-6">
                                                    <li>
                                                        <Luggage
                                                            color="primary"
                                                            fontSize="small"
                                                            alt="icon"
                                                            className="mx-2"
                                                        />
                                                        {data.name}
                                                    </li>
                                                    <li>
                                                        <LocationOn
                                                            color="primary"
                                                            fontSize="small"
                                                            alt="icon"
                                                            className="mx-2"
                                                        />
                                                        {data.city}
                                                    </li>
                                                    <br />
                                                    <li className="text-start">
                                                        {role !== "user" &&
                                                            <>
                                                                <IconButton
                                                                    onClick={() => {
                                                                        setEditHotel(true);
                                                                        setEditHotelId(data.id);
                                                                    }}
                                                                    className=" z-8 position-relative"
                                                                >
                                                                    <Edit color="primary" fontSize="small" alt="edit" />
                                                                </IconButton>
                                                                <IconButton
                                                                    onClick={() => {
                                                                        setDeleteHotel(true);
                                                                        setDeleteHotelId(data.id);
                                                                    }}
                                                                    className=" z-8 position-relative"
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
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <NoInfo size="small" />
                            )}
                    </div>
                </div>
            </BlueArea>
            <AddEditCategories openModal={editCategory} onCloseModal={() => { setEditCategory(false) }} edit dataEdit={{ name: data.name, image: data.image, description: data.description }} handleChange={handleChange} editId={4} />

            <AddEditHotel
                openModal={addHotel}
                onCloseModal={() => {
                    setAddHotel(false);
                }}
                add
                handleChange={handleChangeAdd}
            />
            {editHotelId && (
                <AddEditHotel
                    openModal={editHotel}
                    onCloseModal={() => {
                        setEditHotel(false);
                    }}
                    edit
                    dataEdit={hotels.find((x) => x.id === +editHotelId)}
                    handleChange={handleChangeEdit}
                    editId={editHotelId}
                />
            )}
            {deleteHotel && (
                <DeleteModal
                    openModal={deleteHotel}
                    name={` الفندق  ${hotels.find((x) => x.id === +deleteHotelId).name || ""
                        }`}
                    url={`/hotel/${deleteHotelId}`}
                    onCancle={() => setDeleteHotel(false)}
                    handledelete1={handledelete1}
                />
            )}
        </>
    );
}
