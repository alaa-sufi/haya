import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import BlueArea from "components/UI/Short/BlueArea";
import AddEditCarType from "components/Modals/AddEditCarType"
import useSWR from "swr";
import Image from "next/image";
import { Edit, Delete } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import add from "public/images/add circle.svg"
import DeleteModal from "@/Modals/DeleteModal";
import { useAuth } from "hooks/use-Auth"
import LoadingSpinner from "@/UI/LoadingSpinner"
import NoInfo from "@/UI/NoInfo"
import useTranslation from 'next-translate/useTranslation'
export default function CarType() {
    const { user, isLoading } = useAuth({ middleware: 'auth' })
    const { t, lang } = useTranslation("all")
    const [allData, setAllData] = useState([])
    const { data, error } = useSWR(
        `${process.env.NEXT_PUBLIC_SERVER}/carType`
    );
    useEffect(() => {
        if (data) {
            setAllData(data.data.carTypes)
        }
    }, [data])
    const [addType, setAddType] = useState(false)
    const [editType, setEditType] = useState(false)
    const [editId, setEditId] = useState(false)
    const [deleteTypeId, setDeleteTypeId] = useState(null)
    const [deleteType, setDeleteType] = useState(false)
    const handleChange = (data) => {
        setAllData([data, ...allData])
    }
    const handleChangeEdit = (value) => {
        setAllData(allData.map((x) => (x.id == editId ? value : x)));
        setEditId(null)
    };
    const handledelete1 = () => {
        setAllData(allData.filter((x) => x.id !== +deleteTypeId));
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
    if (isLoading || !user || !allData) {
        return <div className="loading-parent"><LoadingSpinner /></div>
    }
    return (
        <>
            <Head>
                <title>{t("all:al_hayat_company")} - أصناف السيارات </title>
            </Head>
            <BlueArea >
                <div className="h-types ">
                    <h1 className="h-h1">أصناف السيارات</h1>
                    <button className="h-add-drivers" onClick={() => setAddType(true)} >
                        <Image src={add} alt="alt" width="50" height="50" />
                    </button>

                    <div className="row">
                        {allData && allData.length > 0 ? allData.map((data) => (
                            <div className={`col-lg-3 col-md-4  mb-sm-4`} key={data.id}>
                                <div className={`h-types-block position-relative cars-type-shapes`}>
                                    <h3 className={`h-types-h2 text-center`}>{data.name}</h3>
                                    <IconButton
                                        onClick={() => {
                                            setEditType(true);
                                            setEditId(data.id);
                                        }}
                                    >
                                        <Edit color="primary" fontSize="small" alt="edit" />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => {
                                            setDeleteType(true);
                                            setDeleteTypeId(data.id);
                                        }}
                                    >
                                        <Delete
                                            color="primary"
                                            fontSize="small"
                                            alt="delete"
                                        />
                                    </IconButton>
                                </div>
                            </div>))
                            :
                            <></>
                        }
                    </div>
                </div>
            </BlueArea>
            <AddEditCarType openModal={addType} onCloseModal={() => { setAddType(false) }} add handleChange={handleChange} />
            {editId && <AddEditCarType openModal={editType} onCloseModal={() => { setEditType(false) }} edit handleChange={handleChangeEdit} editId={editId} dataEdit={allData.find((x) => x.id === +editId)} />}
            {deleteType && (
                <DeleteModal
                    openModal={deleteType}
                    name={` السيارة بصنف ${allData.find((x) => x.id === +deleteTypeId).name || ""
                        }`}
                    url={`/carType/${deleteTypeId}`}
                    onCancle={() => setDeleteType(false)}
                    handledelete1={handledelete1}
                />
            )}
        </>
    )
}
