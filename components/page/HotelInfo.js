import React, { useState  , useEffect} from 'react'
import Head from "next/head"
import Weather from "@/UI/Weather"
import img from "public/temp/company1.jpg";
import DeleteModal from "@/Modals/DeleteModal"
import AddEditHotelCategory from "@/Modals/AddEditHotelCategory"
import ThreeImgs from "@/UI/ThreeImgs"
import BlueArea from "@/UI/Short/BlueArea";
import ActionButtons from "@/Base/ActionButtons"
import Link from "next/link";
import BookInUser from "@/Modals/BookInUser"
import { IconButton, Badge } from "@mui/material";
import { DateRange, AccessTime, LocalAtm, LocationOn, EventSeat, Luggage, Edit, Delete, BedroomParent } from '@mui/icons-material';
import { useRouter } from "next/router"
import { useAuth } from "hooks/use-Auth"
import LoadingSpinner from "@/UI/LoadingSpinner"
import useTranslation from 'next-translate/useTranslation'
import NoInfo from "components/UI/NoInfo";
import Image from 'next/image'
import add from "public/images/add circle.svg";
import useSWR, { useSWRConfig } from 'swr'

export default function HotelInfo({ role, dataPage, dataHotelCategory }) {
    const { t, lang } = useTranslation("all")
    const { user, isLoading } = useAuth({ middleware: role === 'admin' ? 'auth' : 'user' })
    const [addHotelCategory, setAddHotelCategory] = useState(false)
    const [hotelsCategories, setHotelsCategories] = useState(dataHotelCategory)
    const [editCatHotel, setEditCatHotel] = useState(false)
    const [editCatHotelId, setEditCatHotelId] = useState(null)
    const [deleteCatHotel, setDeleteCatHotel] = useState(false)
    const [deleteCatHotelId, setDeleteCatHotelId] = useState(null)
    const [data, setData] = useState(dataPage)
    const router = useRouter();
    const hotelId = router.query.hotelId;
    const { data: dataPageApi, error: error1 } = useSWR(`${process.env.NEXT_PUBLIC_SERVER}/hotel/${hotelId}`);
    const { data: dataHotelCategoryApi, error: error2 } = useSWR(`${process.env.NEXT_PUBLIC_SERVER}/hotelCategory/hotel/${hotelId}`);
    useEffect(() => {
        if (dataPageApi) {
          setData(dataPageApi.data.hotel)
        }
        if (dataHotelCategoryApi) {
            setHotelsCategories(dataHotelCategoryApi.data.hotelCategories)
        }
      }, [dataPageApi, dataHotelCategoryApi])
    const handleChangeAdd = (value) => {
        setHotelsCategories([value, ...hotelsCategories]);
    };
    const handleChangeEdit = (value) => {
        setHotelsCategories(hotelsCategories.map((x) => (x.id == editCatHotelId ? value : x)));
        setEditCatHotelId(null)
      };
      const handledelete1 = () => {
        setHotelsCategories(hotelsCategories.filter((x) => x.id !== +deleteCatHotelId));
      };
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
    if (isLoading || (role === "admin" && !user) || !dataPageApi || !dataHotelCategoryApi || router.isFallback) {
        return <div className="loading-parent"><LoadingSpinner /></div>
    }
    return (
        <>
            <Head>
                <title>{t("all:al_hayat_company")} - {t("details_of_the_hotel")}</title>
            </Head>
            <BlueArea >
                {role !== "user" &&
                    <button className="h-add-drivers" onClick={() => setAddHotelCategory(true)}>
                        <Image src={add} alt="alt" width="50" height="50" />
                    </button>
                }
                <div className="row align-items-center mb-3">
                    <div className="col-12">
                        <div className="h-city-weather">
                            <div className="p-3 position-relative">
                                <Image src={data.image} className="radius-2" alt="weather" width="200" height="200" />
                            </div>
                            <div className=" h-city-weather-info ">
                                <h2 className="h-h1 mb-1 text-initial ">{data.name}</h2>
                            </div>
                        </div>


                    </div>

                </div>
                <h1 className="h-h1  mb-3 ">{t("hotel_categories")}</h1>
              
                <div className="row">
                    <div className="col-12">
                        <ul className="h-trip-info-ul gap-lg-5 gap-3 flex-wrap">
                            <li>
                                <LocationOn color="primary" fontSize="small" alt="icon" className="mx-2" />
                                {data.city}</li>
                        </ul>
                    </div>
                    <div className="col">
                        {role === "user" && <a className="me-md-auto ms-md-0 mx-auto my-3 d-block h-button2 w-max" target="_blank"
                            rel="noreferrer" href={`https://wa.me/+963999999999`}>{t("book_a_journey")}</a>}
                    </div>
                </div>
                <p>
                    {data.details}
                </p>
                <div className="h-city">
                    <div className="row">
                        {hotelsCategories.length ? (
                            hotelsCategories.map((data) => (
                                <div className="col-md-4 mb-3" key={data.id}>
                                    <div className=" h-avialabel-trip radius-2 ">
                                        <ul >
                                            <li>
                                                <BedroomParent
                                                    color="primary"
                                                    fontSize="small"
                                                    alt="icon"
                                                    className="mx-2"
                                                />
                                                {data.name}
                                            </li>
                                            <li>
                                                <LocalAtm
                                                    color="primary"
                                                    fontSize="small"
                                                    alt="icon"
                                                    className="mx-2"
                                                />
                                                {data.price}
                                            </li>
                                            <li className="text-start">
                                                {role !== "user" &&
                                                    <>
                                                        <IconButton
                                                            onClick={() => {
                                                                setEditCatHotel(true);
                                                                setEditCatHotelId(data.id);
                                                            }}
                                                            className=" z-8 position-relative"
                                                        >
                                                            <Edit color="primary" fontSize="small" alt="edit" />
                                                        </IconButton>
                                                        <IconButton
                                                            onClick={() => {
                                                                setDeleteCatHotel(true);
                                                                setDeleteCatHotelId(data.id);
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
                            ))
                        ) : (
                            <NoInfo size="small" />
                        )}
                    </div>
                </div>
               
            </BlueArea>
            <AddEditHotelCategory
                openModal={addHotelCategory}
                onCloseModal={() => {
                    setAddHotelCategory(false);
                }}
                HotelId={hotelId}
                add
                handleChange={handleChangeAdd}
            />
           {editCatHotelId && <AddEditHotelCategory
                openModal={editCatHotel}
                onCloseModal={() => {
                    setEditCatHotel(false);
                }}
                HotelId={1}
                edit
                dataEdit={hotelsCategories.find((x) => x.id === +editCatHotelId)}
                handleChange={handleChangeEdit}
            />}
            {deleteCatHotelId && <DeleteModal openModal={deleteCatHotel} name={`الصنف`} url={`/hotelCategory/${deleteCatHotelId}`} onCancle={() => setDeleteCatHotel(false)}  handledelete1={handledelete1} />}
        </>
    )
}
