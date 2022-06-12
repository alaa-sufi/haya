import React, { useEffect, useState } from "react";
import { Modal , Button } from "react-bootstrap";
import { Formik } from "formik";
import LoadingSpinner from "components/UI/LoadingSpinner"

import { ButtonsField } from "components/UI/Inputs";
import * as Yup from "yup";
import { TextField, ImgField, HeaderField, CheckField } from "components/UI/Inputs";
import axios from '@/lib/axios'
import useSWR from "swr";
import { DirectionsCar, DateRange, People, LocationOn } from "@mui/icons-material";
export default function ShowOrderAccept({
    openModal,
    onCloseModal,
    data}) {


    return (
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
                    <li className="d-flex gap-2  align-items-start mb-2">
                        {" "}
                        <DirectionsCar color="primary" />
                        {" "}
                        <ul>
                            {data.drivers.map((driver , index)=>(
                                <li key={index}>{driver.full_name}</li>
                            ))}
                        </ul>
                    </li>

                </ul>

            </Modal.Body>
        </Modal>
    );
}
