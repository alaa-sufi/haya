import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Formik, Field } from "formik";
import LoadingSpinner from "components/UI/LoadingSpinner"

import { ButtonsField } from "components/UI/Inputs";
import * as Yup from "yup";
import { TextField, ImgField, HeaderField, CheckField } from "components/UI/Inputs";
import axios from '@/lib/axios'
import useSWR from "swr";
import {  DateRange, People, LocationOn } from "@mui/icons-material";
import toast from "react-hot-toast";

export default function ShowOrderWait({
    openModal,
    onCloseModal,
    data,
    handleChangeWait 
}) {
    const [loadingButton, setLoadingButton] = useState(false);
    const [driverModal, setDriverModal] = useState(false);
    const [checked, setChecked] = useState([]);
    const sendDrivers = () => {
        if(checked.length != 0){
            setLoadingButton(true);
            axios
                .post(`${process.env.NEXT_PUBLIC_SERVER}/acceptDelivery/${data.id}`, {
                    drivers : checked
                })
                .then((response) => {
                    onCloseModal();
                    setLoadingButton(false);
                    handleChangeWait()
                    setDriverModal(false);
                    setChecked([])
                })
                .catch((error) => {
                    onCloseModal();
                    setLoadingButton(false);
                    console.error("There was an error!", error);
                    toast.error("عذرا حدثت مشكلة ما");

                    setChecked([])

                });

        }
    }
    const { data: driversModal, error } = useSWR(
        `${process.env.NEXT_PUBLIC_SERVER}/driver`
      );
      const handleCheck = (event) => {
        var updatedList = [...checked];
        if (event.target.checked) {
          updatedList = [...checked, event.target.value];
        } else {
          updatedList.splice(checked.indexOf(event.target.value), 1);
        }
        setChecked(updatedList);
      };
    return (
        <>
            <Modal
                show={openModal}
                onHide={() => {
                    onCloseModal();
                }}
                centered
            >
                <HeaderField title="" />
                <Modal.Body>
                    <ul>
                        <li className="d-flex gap-2 align-items-start mb-2">
                            {" "}
                            <DateRange color="primary" />
                            {" "}
                            <span >
                                {" "}
                                {new Date(data.begin_date).toLocaleDateString('zh-Hans-CN')}{" - "}{new Date(data.begin_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </li>
                        <li className="d-flex  gap-2 align-items-start mb-2">
                            {" "}
                            <People color="primary" />
                            <span >
                                {data.seat_count}
                                <span > شخص </span>
                            </span>
                        </li>
                        <li className="d-flex gap-2  align-items-start mb-2">
                            {" "}
                            <LocationOn color="primary" />
                            {" "}
                            <span >
                                <bdi>{data.city}</bdi>
                                {" - "}
                                <bdi>{data.region}</bdi>
                                {" - "}
                                <bdi>{data.street}</bdi>
                                {" - "}
                                <bdi>{data.building_number}</bdi>
                                {" - "}
                                <bdi>{data.address_details}</bdi>
                            </span>
                        </li>
                    </ul>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center gap-3">
                    <Button className="btn h-button position-relative" onClick={() => { setDriverModal(true); onCloseModal() }} >قبول الطلب</Button>
                    <Button className="btn h-button position-relative cancle" onClick={() => onCloseModal()} >الغاء</Button>
                </Modal.Footer>
            </Modal>
            <Modal
                show={driverModal}
                onHide={() => {
                    onCloseModal();
                }}
                centered
            >
        
                            <HeaderField title="الرجاء اختيار السائق" />
                            <Modal.Body>
                                <div role="group" aria-labelledby="checkbox-group">
                                    {driversModal && driversModal.drivers.map((driver, index) => (
                                        <div key={index} >
                                            <label className="d-flex gap-2">
                                                <input name="drivers" type="checkbox" value={driver.id} className="form-check-input"    onChange={handleCheck}/>
                                                {driver.full_name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </Modal.Body>
                            <Modal.Footer className="d-flex justify-content-center gap-3">
                                <Button  className="btn h-button position-relative" onClick={sendDrivers}>
                                    {loadingButton ? <><LoadingSpinner /> <span className="opacity-0">load</span></> : "تم"}</Button>
                                <Button className="btn h-button position-relative cancle" onClick={() => {onCloseModal();setDriverModal(false)}} >الغاء</Button>
                            </Modal.Footer>
                  
            </Modal>
        </>
    );
}
