import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Types from "components/Base/Types"
import BlueArea from "components/UI/Short/BlueArea";
import AddEditCategories from "components/Modals/AddEditCategories"
import { useAuth } from "hooks/use-Auth"
import LoadingSpinner from "@/UI/LoadingSpinner"
import useSWR, { useSWRConfig } from 'swr'
import useTranslation from 'next-translate/useTranslation'
import NoInfo from "@/Ui/NoInfo";

export default function Categories() {
    const { user, isLoading } = useAuth({ middleware: 'auth' })
    const { data: dataPage, error } = useSWR(`${process.env.NEXT_PUBLIC_SERVER}/category`);
    const { t, lang } = useTranslation("all")

    const [openTypesModal, setOpenTypesModal] = useState(false)
    const [allData, setAllData] = useState();

    useEffect(() => {
        if (dataPage) {
            setAllData(dataPage.data.categories)
        }
    }, [dataPage])
    const handleChange = (data) => {
        setAllData([...allData, data])
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
    if (isLoading || !user ||!dataPage || !allData) {
        return <div className="loading-parent"><LoadingSpinner /></div>
    }
    return (
        <>
            <Head>
                <title>{t("all:al_hayat_company")} - كل الأصناف</title>
            </Head>
            <BlueArea >
                <Types head="أصناف ثابتة" aspectRatio="2 / 1" grid="2" role={"admin"} datas={allData ? allData.slice(0, 4) : []} onOpenModal={() => setOpenTypesModal(true)} notInfo/>
                {allData && allData.length > 4 && <Types head="أصناف متغيرة" aspectRatio="2 / 1" grid="2" role={"admin"} datas={allData ? allData.slice(4) : []} onOpenModal={() => setOpenTypesModal(true)} notInfo />}
            </BlueArea>
            <AddEditCategories openModal={openTypesModal} onCloseModal={() => { setOpenTypesModal(false) }} add handleChange={handleChange} />
        </>
    )
}
