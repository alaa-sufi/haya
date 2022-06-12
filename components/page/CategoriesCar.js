import Head from "next/head";
import React, { useState, useEffect } from "react";
import BlueArea from "components/UI/Short/BlueArea";
import Image from "next/image";
import SeatCount from "@/Functions/SeatCount";
import ActionButtons from "components/Base/ActionButtons";
import AddEditCategories from "@/Modals/AddEditCategories";
import AddEditCar from "@/Modals/AddEditCar";
import DeleteModal from "@/Modals/DeleteModal";
import add from "public/images/add circle.svg";
import { Edit, AddCircle, Delete, DirectionsBus, AirportShuttle } from "@mui/icons-material";
import { IconButton, Badge } from "@mui/material";
import NoInfo from "components/UI/NoInfo";
import useSWR, { useSWRConfig } from 'swr'

import {
  LocalAtm,
  EventSeat,
  DirectionsCar,
} from "@mui/icons-material";
import { useAuth } from "hooks/use-Auth"
import LoadingSpinner from "@/UI/LoadingSpinner"
import useTranslation from 'next-translate/useTranslation'
export default function CategoriesCar({ dataPage, dataTrips, role }) {
  const { t, lang } = useTranslation("all")
  const { user, isLoading } = useAuth({ middleware: role === 'admin' ? 'auth' : 'user' })
  const [editCategory, setEditCategory] = useState(false);
  const [addCar, setAddCar] = useState(false);
  const [editCar, setEditCar] = useState(false);
  const [trips, setTrips] = useState(dataTrips);
  const [editCarId, setEditCarId] = useState(null);
  const [deleteCar, setDeleteCar] = useState(null);
  const [deleteCarId, setDeleteCarId] = useState(null);
  const [data, setdata] = useState(dataPage)
  const { data: dataPageApi, error: error1 } = useSWR(`${process.env.NEXT_PUBLIC_SERVER}/category/3`);
  const { data: dataTripsApi, error: error2 } = useSWR(`${process.env.NEXT_PUBLIC_SERVER}/car`);
  useEffect(() => {
    if (dataTripsApi && role === "admin") {
      setTrips(dataTripsApi.data.cars)
    }else if(dataTripsApi && role === "user"){
      setTrips(dataTripsApi.data.cars.filter(x=>x.is_available === 1))
    }
    if (dataPageApi) {
      setdata(dataPageApi.data.category)

    }
  }, [dataPageApi, dataTripsApi])
  const handleChangeAdd = (value) => {
    setTrips([value, ...trips]);
  };
  const handleChangeEdit = (value) => {
    setTrips(trips.map((x) => (x.id == editCarId ? value : x)));
    setEditCarId(null)
  };
  const handledelete1 = () => {
    setTrips(trips.filter((x) => x.id !== +deleteCarId));
  };
  const handleChange = (dataHundle) => {
    setdata({ name: dataHundle.name, image: dataHundle.image, description: dataHundle.description, id: data.id })
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
  if (isLoading || (role === "admin" && !user) || !dataPageApi || !dataTripsApi) {
    return <div className="loading-parent"><LoadingSpinner /></div>
  }
  return (
    <>
    <Head>
        <title>{t("all:al_hayat_company")} - {data.name}</title>
      </Head>
      <BlueArea >
        {role !== "user" &&
          <button className="h-add-drivers" onClick={() => setAddCar(true)}>
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
        <div className="h-city">
          <div className="row position-relative">
            {trips.length ? (
              trips.map((trip) => (

                <div className="col-md-6 " key={trip.id}>
                  <div className=" h-avialabel-trip radius-2 ">
                    <div className="row">
                      <div className="col-sm-6 position-relative p-0 px-sm-3">
                        {role === "admin" && <Badge color={trip.is_available ? "success" : "error"} badgeContent=" " className="position-absolute"></Badge>}
                          <Image
                            src={trip.image}
                            width="100"
                            height="100"
                            layout="responsive"
                            className="rounded-3 w-100 object-cover"
                            alt={data.name}
                          />
                      </div>
                      <ul className="col-sm-6">
                        <li>
                          <DirectionsCar
                            color="primary"
                            fontSize="small"
                            alt="icon"
                            className="mx-2"
                          />
                          {trip.type}
                        </li>
                        <li>
                          <AirportShuttle
                            color="primary"
                            fontSize="small"
                            alt="icon"
                            className="mx-2"
                          />
                          {trip.car_type}
                        </li>
                        <li>
                          <EventSeat
                            color="primary"
                            fontSize="small"
                            alt="icon"
                            className="mx-2"
                          />
                          {SeatCount(trip.seats , t)}
                        </li>
                        <li>
                          <LocalAtm
                            color="primary"
                            fontSize="small"
                            alt="icon"
                            className="mx-2"
                          />
                          {trip.price} {t("s_p")}
                        </li>
                        <br />
                        <li className="text-start">
                          {role !== "user" ?
                            <>
                              <IconButton
                                onClick={() => {
                                  setEditCar(true);
                                  setEditCarId(trip.id);
                                }}
                              >
                                <Edit color="primary" fontSize="small" alt="edit" />
                              </IconButton>
                              <IconButton
                                onClick={() => {
                                  setDeleteCar(true);
                                  setDeleteCarId(trip.id);
                                }}
                              >
                                <Delete
                                  color="primary"
                                  fontSize="small"
                                  alt="delete"
                                />
                              </IconButton>
                            </>
                            :
                            <a
                              href={`https://wa.me/+963960990506`}
                              className="h-button"
                              target="_blank"
                              rel="noreferrer"
                            >
                              {t("book_the_car")}
                            </a>
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
      <AddEditCategories openModal={editCategory} onCloseModal={() => { setEditCategory(false) }} edit dataEdit={{ name: data.name, image: data.image, description: data.description }} handleChange={handleChange} editId={3} />

      <AddEditCar
        openModal={addCar}
        onCloseModal={() => {
          setAddCar(false);
        }}
        add
        handleChange={handleChangeAdd}
      />
      {editCarId && (
        <AddEditCar
          openModal={editCar}
          onCloseModal={() => {
            setEditCar(false);
          }}
          edit
          dataEdit={trips.find((x) => x.id === +editCarId)}
          handleChange={handleChangeEdit}
          editId={editCarId}
        />
      )}
      {deleteCar && (
        <DeleteModal
          openModal={deleteCar}
          name={` السيارة بنوع ${trips.find((x) => x.id === +deleteCarId).type || ""
            }`}
          url={`/car/${deleteCarId}`}
          onCancle={() => setDeleteCar(false)}
          handledelete1={handledelete1}
        />
      )}
    </>
  );
}
