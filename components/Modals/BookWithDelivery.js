import React, { useState } from 'react'
import { useRouter } from "next/router";
import { Modal } from "react-bootstrap";
import { ButtonsField } from '../UI/Inputs';
import { HeaderField } from "../UI/Inputs"
import axios from '@/lib/axios'
import toast from "react-hot-toast";
import Link from "next/link";
import useTranslation from 'next-translate/useTranslation'
export default function BookWithDelivery({ openModal, handleOpenNext }) {
    const { t, lang } = useTranslation("all")
    const router = useRouter();
    const [loadingButton, setLoadingButton] = useState(false)
    // const deleteModal = async (e) => {
    //     e.preventDefault()
    //     setLoadingButton(true)

    //     axios
    //         .delete(`${process.env.NEXT_PUBLIC_SERVER}${props.url}`)
    //         .then((response) => {
    //             props.onCancle();
    //             setLoadingButton(false);
    //             props.back && router.push(props.back);
    //             props.handledelete1 && props.handledelete1();
    //         })
    //         .catch((error) => {
    //             setLoadingButton(false);
    //             console.error("There was an error!", error);
    //             props.onCancle()
    //             toast.error("عذرا حدثت مشكلة ما");
    //         });

    // }
    return (

        <Modal show={openModal} onHide={() => setShowCar(false)} centered>
            <Modal.Header className="text-center">
                <Modal.Title></Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                <h4 className="text-bold">{t("the_date_of_the_car_arrival")}</h4>
                <div>am 11:00 - 2021/5/12</div>
            </Modal.Body>
            <Modal.Footer className="text-center">

                <button onClick={handleOpenNext}
                    className="btn h-button d-block mx-auto "  >{t("ok")}
                </button>

            </Modal.Footer>
        </Modal>

    )
}
