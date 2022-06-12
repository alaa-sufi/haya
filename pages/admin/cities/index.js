import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Types from "components/Base/Types"
import BlueArea from "components/UI/Short/BlueArea";
import AddEditCity from "components/Modals/AddEditCity"
import AddEditTypes from "@/Modals/AddEditCategories"
import DeleteModal from "components/Modals/DeleteModal"
import ActionButtons from "components/Base/ActionButtons"
import Image from "next/image";
import add from "public/images/add circle.svg";
import NoInfo from "components/UI/NoInfo"
import { Edit, AddCircle, Delete, DirectionsBus, LocalAtm, EventSeat, DirectionsCar,BusAlert } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useAuth } from "hooks/use-Auth"
import LoadingSpinner from "@/UI/LoadingSpinner"
import useSWR, { useSWRConfig } from 'swr'
import useTranslation from 'next-translate/useTranslation'
export default function City() {
    const { t, lang } = useTranslation("all")
    const { user, isLoading } = useAuth({ middleware: 'auth' })
    const [openCityModal, setOpenCityModal] = useState(false)
    const [allData, setAllData] = useState([])
    const [editCityId, setEditCityId] = useState(null);
    const [editCity, setEditCity] = useState(null);
    const [deleteCity, setDeleteCity] = useState(null);
    const [deleteCityId, setDeleteCityId] = useState(null);
    const { data: dataPage, error } = useSWR(`${process.env.NEXT_PUBLIC_SERVER}/city`);

    useEffect(() => {
        if (dataPage) {
            setAllData(dataPage.data.cities || [])
        }
    }, [dataPage])
    const handleChange = (data) => {
        setAllData([...allData, data])
    }
    const handleChangeEdit = (value) => {
        setAllData(allData.map((x) => (x.id == editCityId ? value : x)));
        setEditCityId(null)
    };
    const handledelete1 = () => {
        setAllData(allData.filter((x) => x.id !== +deleteCityId));
    };
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
    if (isLoading || !user || !dataPage) {
        return <div className="loading-parent"><LoadingSpinner /></div>
    }
    return (
        <>
            <Head>
                <title>{t("all:al_hayat_company")} - المواقع</title>
            </Head>
            <BlueArea  >

                <button className="h-add-drivers" onClick={() => setOpenCityModal(true)}>
                    <Image src={add} alt="alt" width="50" height="50" />
                </button>
                <div className="h-types ">
                    <h1 className="h-h1">المواقع</h1>
                    <div className="h-city">
                        <div className="row position-relative">
                            {allData.length ? (
                                allData.map((data) => (
                                    <div className="col-md-6 " key={data.id}>
                                        <div className=" h-avialabel-trip radius-2 ">
                                            <div className="row">
                                                <div className="col-sm-6 position-relative p-0 px-sm-3">
                                                    <Image
                                                        src={data.image_main}
                                                        width="100"
                                                        height="100"
                                                        layout="responsive"
                                                        className="rounded-3 w-100 object-cover"
                                                        alt={data.name}
                                                    />
                                                </div>
                                                <ul className="col-sm-6">
                                                    <li>
                                                        <LocalAtm
                                                            color="primary"
                                                            fontSize="small"
                                                            alt="icon"
                                                            className="mx-2"
                                                        />
                                                        {data.name}
                                                    </li>
                                                    <li>
                                                        <BusAlert
                                                            color="primary"
                                                            fontSize="small"
                                                            alt="icon"
                                                            className="mx-2"
                                                        />
                                                        {data.starting_place}
                                                    </li>
                                                    <li className="text-start">
                                                            <>
                                                                <IconButton
                                                                    onClick={() => {
                                                                        setEditCity(true);
                                                                        setEditCityId(data.id);
                                                                    }}
                                                                    className=" z-8 position-relative"
                                                                >
                                                                    <Edit color="primary" fontSize="small" alt="edit" />
                                                                </IconButton>
                                                                <IconButton
                                                                    onClick={() => {
                                                                        setDeleteCity(true);
                                                                        setDeleteCityId(data.id);
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
                </div>
            </BlueArea>
            <AddEditCity openModal={openCityModal} onCloseModal={() => { setOpenCityModal(false) }} add handleChange={handleChange} />
            {editCityId && <AddEditCity openModal={editCity} onCloseModal={() => { setEditCity(false) }} dataEdit={allData.find((x) => x.id === +editCityId)} edit handleChange={handleChangeEdit} editId={editCityId} />}
            {deleteCity && <DeleteModal openModal={deleteCity} name={`الموقع ${allData.find((x) => x.id === +deleteCityId).name || ""}`} url={`/city/${deleteCityId}`} onCancle={() => setDeleteCity(false)} handledelete1={handledelete1} />}
        </>
    )
}
