import React, { useState  , useEffect} from "react";
import DeleteModal from "components/Modals/DeleteModal";
import AddEditShowDrivers from "components/Modals/AddEditShowDrivers";
import BlueArea from "components/UI/Short/BlueArea";
import add from "public/images/add circle.svg";
import Image from "next/image";
import { Edit, Delete, RemoveRedEye } from "@mui/icons-material";
import { Pagination } from '@mui/material';
import useSWR, { useSWRConfig } from 'swr'
import { useAuth } from "hooks/use-Auth"
import LoadingSpinner from "@/UI/LoadingSpinner"
import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'
import NoInfo from "@/Ui/NoInfo";

export default function Drivers() {
  const { t, lang } = useTranslation("all")
  const {user, isLoading} = useAuth({middleware: 'auth'})

  const [deleteId, setDeleteId] = useState(null);
  const [driverEditId, setDriverEditId] = useState(null);
  const [deleteName, setDeleteName] = useState();
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [driverShowId, setDriverShowId] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allDrivers, setAllDrivers] = useState([]);
  const [count, setCount] = useState();
  const [driversPage, setDriversPage] = useState(1);
  const driverUrl = `${process.env.NEXT_PUBLIC_SERVER}/driver?page=${driversPage}&perPage=10`
  const { data: drivers, error } = useSWR(
    driverUrl
  );


useEffect(() => {
  if (drivers) {
    setAllDrivers(drivers.drivers)
    setCount(+drivers.total)
  }
  setLoading(drivers ? false : true)

}, [drivers])

  const func = () => {
    const newDrivers = drivers.data.filter((driver) => driver.id !== driverId);
    // setdrivers(newDrivers);
  };
  const { mutate } = useSWRConfig()
const handleChangeAdd = (data)=>{
  setAllDrivers([data, ...allDrivers])
}
const handleChangeEdit = (data)=>{
  setAllDrivers(allDrivers.map((x) => (x.id == driverEditId ? data : x)));
  setDriverEditId(null)
}
const handleDelete = ()=>{
  setAllDrivers(allDrivers.filter((x) => x.id !== +deleteId));
  setDeleteId(null)
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
if (isLoading || !user || !allDrivers ||!drivers){
  return <div className="loading-parent"><LoadingSpinner/></div>
}
  return (
    <>
      <Head>
        <title>{t("all:al_hayat_company")} - السائقين</title>
      </Head>
      <BlueArea className="h-drivers">
        <h1 className="h-h1">السائقين</h1>
        <div className=" ">
          {allDrivers &&
            allDrivers.map((driver, index) => (
                <div className="radius-2 h-drivers-element" key={index}>
                  <span>{driver.full_name}</span>
                  <ul className="d-flex gap-1">
                    <li>
                      <RemoveRedEye
                        color="primary"
                        alt="show"
                        onClick={() => {
                          setShowModal(true);
                          setDriverShowId(driver.id)
                        }}
                      />
                    </li>
                    <li>
                      <Edit
                        color="primary"
                        alt="edit"
                        onClick={() => {
                          setEditModal(true);
                          setDriverEditId(driver.id)
                        }}
                      />
                    </li>
                    <li>
                      <Delete
                        color="primary"
                        alt="delete"
                        onClick={() => {
                          setDeleteModal(true);
                          setDeleteName(driver.full_name);
                          setDeleteId(driver.id);
                        }}
                      />
                    </li>
                  </ul>
                </div>
            ))}
        </div>
        <button  className="h-add-drivers"  onClick={() => {    setAddModal(true);  }}>
          <Image src={add} alt="add driver" width="50" height="50" />
        </button>
        {!loading && <Pagination count={count} color="primary" page={driversPage} onChange={(event, value) => { setDriversPage(value); mutate(driverUrl) }} />}
      </BlueArea>
      <AddEditShowDrivers   openModal={addModal}  onCloseModal={() => { setAddModal(false); }}  add  handleChange={handleChangeAdd}/>
     {driverEditId && <AddEditShowDrivers  openModal={editModal}  onCloseModal={() => { setEditModal(false);  }}  edit editId={driverEditId} dataEdit={allDrivers.find((x) => x.id === +driverEditId)} handleChange={handleChangeEdit}/>}
      {driverShowId && <AddEditShowDrivers  openModal={showModal}  onCloseModal={() => { setShowModal(false);  }}  show dataEdit={allDrivers.find((x) => x.id === +driverShowId)}/>}
     {deleteId && <DeleteModal  openModal={deleteModal}  name={`السائق (${deleteName})`}  url={`/driver/${deleteId}`}  handledelete1={handleDelete}  onCancle={() => setDeleteModal(false)}/>}
    </>
  );
}
