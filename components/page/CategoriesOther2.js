import React, { useState, useEffect } from "react";
import Head from "next/head";
import BlueArea from "components/UI/Short/BlueArea";
import {
  DateRange, Room, LocalAtm, Edit, Delete,
  ArrowBack, ArrowForward
} from "@mui/icons-material";
import NoInfo from "components/UI/NoInfo";
import ActionButtons from "components/Base/ActionButtons";
import AddEditCategories from "@/Modals/AddEditCategories";
import DeleteModal from "components/Modals/DeleteModal";
import add from "public/images/add circle.svg";
import Image from "next/image";
import AddEditOther2 from "@/Modals/AddEditOther2";
import { IconButton } from "@mui/material";
import { useAuth } from "hooks/use-Auth"
import { useRouter } from "next/router"
import Link from "next/link";
import LoadingSpinner from "@/UI/LoadingSpinner"
import useSWR, { useSWRConfig } from 'swr'
import useTranslation from 'next-translate/useTranslation'
import axios from '@/lib/axios';

export default function CategoriesOther2({ dataPage, dataTrips, role }) {
  const { t, lang } = useTranslation("all")
  const router = useRouter();
  const { user, isLoading } = useAuth({ middleware: role === 'admin' ? 'auth' : 'user' })
  const [editCategory, setEditCategory] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState(false);
  const [addOther, setAddOther] = useState(false);
  const [deletePlaneId, setDeletePlaneId] = useState();
  const [deletePlane, setDeletePlane] = useState(false);
  const [trips, setTrips] = useState(dataTrips);
  const [editOtherId, setEditPlanId] = useState(null);
  const [editOther, setEditPlane] = useState(null);
  const [data, setdata] = useState(dataPage)
  const [fromCities, setFromCities] = useState([])
  const [fromCity, setFromCity] = useState("")
  const [toCities, setToCities] = useState([])
  const [toCity, setToCity] = useState("")
  const [fromCityError, setFromCityError] = useState(false)
  const [toCityError, setToCityError] = useState(false)
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [tripsError, setTripsError] = useState(false)
  const handleChangeAdd = (value) => {
    setTrips([value, ...trips]);
  };
  const handleChangeEdit = (value) => {
    setTrips(trips.map((x) => (x.id == editOtherId ? value : x)));
    setEditPlanId(null)
  };
  const handledelete1 = () => {
    setTrips(trips.filter((x) => x.id !== +deletePlaneId));
  };
  const handleChange = (dataHundle) => {
    setdata({ name: dataHundle.name, image: dataHundle.image, description: dataHundle.description, id: data.id })
  }
  const { data: dataPageApi, error: error1 } = useSWR(`${process.env.NEXT_PUBLIC_SERVER}/category/${router.query.categoriesId}`);
  const { data: dataTripsApi, error: error2 } = useSWR(`${process.env.NEXT_PUBLIC_SERVER}/trip/category/${router.query.categoriesId}`);
  useEffect(() => {
    if (dataTripsApi) {
      setTrips(dataTripsApi.data.trips)
    }
    if (dataPageApi) {
      setdata(dataPageApi.data.category)
    }
  }, [dataPageApi, dataTripsApi])
  useEffect(() => {
    setLoadingTrips(true)
    axios
      .post(`${process.env.NEXT_PUBLIC_SERVER}/city/fromCity`, { 'category_id': router.query.categoriesId })
      .then(res => {
        setFromCities(res.data.data.cities);
        setFromCityError(false)
        setLoadingTrips(false)

      })
      .catch(error => {
        setFromCityError(true);
        setLoadingTrips(false)
      })

  }, [addOther])
  useEffect(() => {
    setLoadingTrips(true)

    axios
      .post(`${process.env.NEXT_PUBLIC_SERVER}/city/toCity`, { 'category_id': router.query.categoriesId, "from_city": fromCity })
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
      .get(`${process.env.NEXT_PUBLIC_SERVER}/trip/category/${router.query.categoriesId}?${fromCity && `filter[from_city_id]=${fromCity ? fromCity : ""}`}${toCity ? `&filter[to_city_id]=${toCity ? toCity : ""}` : ""}`)
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
  if (error1 || error2) {
    return (
      <section >
        <div className="container">
          <div className="h-block-blue">
            <NoInfo error />
          </div>
        </div>
      </section>
    )
  }
  if (isLoading || (role === "admin" && !user) || !dataPageApi || !dataTripsApi || router.isFallback) {
    return <div className="loading-parent"><LoadingSpinner /></div>
  }
  return (
    <>
      <Head>
        <title>{t("all:al_hayat_company")} - {data.name}</title>
      </Head>
      <BlueArea  >
        {role !== "user" &&
          <button className="h-add-drivers" onClick={() => setAddOther(true)}>
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
                  }, {
                    icon: "delete",
                    link: false,
                    onOpenModal: () => setDeleteCategory(true),
                  }
                ]}
              />
            </div>
          )}
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
        <div className="position-relative">
          {loadingTrips ? <LoadingSpinner /> :
            <div className="h-city">
              <div className="row position-relative">
                {trips.length ? (
                  trips.map((trip) => (
                    <div className="col-lg-4 col-md-6 " key={trip.id}>
                      <ul className="h-avialabel-trip islink radius-2">
                        <Link href={`${router.asPath}/trip/${trip.id}`}  >
                          <a className="h-global-a"></a>
                        </Link>
                        <li>
                          <Room
                            color="primary"
                            fontSize="small"
                            alt="icon"
                            className="mx-2"
                          />
                          <bdi>{trip.from_city}</bdi>
                          {lang === "ar" ? <ArrowBack
                            color="primary"
                            fontSize="small"
                            alt="icon"
                            className="mx-2"
                          />
                            :
                            <ArrowForward
                              color="primary"
                              fontSize="small"
                              alt="icon"
                              className="mx-2"
                            />
                          }
                          <bdi>{trip.to_city}</bdi>
                        </li>

                        <li>
                          <DateRange
                            color="primary"
                            fontSize="small"
                            alt="icon"
                            className="mx-2"
                          />
                          {new Date(trip.begin_date).toLocaleDateString('zh-Hans-CN')}
                        </li>
                        <li>
                          <LocalAtm
                            color="primary"
                            fontSize="small"
                            alt="icon"
                            className="mx-2"
                          />
                          {trip.price}
                          {" "}
                          {t("s_p")}
                        </li>


                        <li className="text-start  z-8 position-relative">
                          {role !== "user" &&
                            <>
                              <IconButton className="z-2"
                                onClick={() => {
                                  setEditPlane(true);
                                  setEditPlanId(trip.id);
                                }}
                              >
                                <Edit color="primary" fontSize="small" alt="edit" />
                              </IconButton>
                              <IconButton className="z-2"
                                onClick={() => {
                                  setDeletePlane(true);
                                  setDeletePlaneId(trip.id);
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
                  <NoInfo size="small" />
                )}
              </div>
            </div>
          }
        </div>
      </BlueArea>

      <AddEditCategories openModal={editCategory} onCloseModal={() => { setEditCategory(false) }} edit dataEdit={{ name: data.name, image: data.image, description: data.description }} handleChange={handleChange} editId={data.id} />
      <AddEditOther2
        openModal={addOther}
        onCloseModal={() => {
          setAddOther(false);
        }}
        add
        dataEdit={trips.find((x) => x.id === +editOtherId)}
        handleChange={handleChangeAdd}
        category_id={data.id}
      />
      {editOtherId && (
        <AddEditOther2
          openModal={editOther}
          onCloseModal={() => {
            setEditPlanId(false);
          }}
          edit
          dataEdit={trips.find((x) => x.id === +editOtherId)}
          handleChange={handleChangeEdit}
          editId={editOtherId}
          category_id={data.id}
        />
      )}

      {deletePlane && (
        <DeleteModal
          openModal={deletePlane}
          name={`  الرحلة الجوية ${trips.find((x) => x.id === +deletePlaneId).type || ""
            }`}
          url={`/trip/${deletePlaneId}`}
          onCancle={() => setDeletePlane(false)}
          handledelete1={handledelete1}
        />
      )}
      {deleteCategory && (
        <DeleteModal
          openModal={deleteCategory}
          name={`  الصنف  ${data.name}`}
          url={`/category/${data.id}`}
          onCancle={() => setDeleteCategory(false)}
          handledelete1={handledelete1}
          back={"/admin/categories"}

        />
      )}
    </>
  );
}
