import React, { useState } from 'react'
import { useRouter } from "next/router";
import { Modal } from "react-bootstrap";
import { ButtonsField } from '../UI/Inputs';
import { HeaderField } from "../UI/Inputs"
import axios from '@/lib/axios'
import toast from "react-hot-toast";
import Link from "next/link";
import useTranslation from 'next-translate/useTranslation'

export default function BookWithDelivery2({ openModal, onCloseModal, handleOpenNext, handleCancel, date, place }) {
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
    const prevHulf =(date)=>{
        var now = new Date(date);
        var h12h = now.getHours() - 1;
        var m12h = now.getMinutes() ;
        var ampm;
        if (h12h >= 0 && h12h < 12) {
            if (h12h === 0) {
                h12h =12;
            }
            ampm = "AM";
        }
        else {
            if (h12h > 12) {
                h12h -= 12;
            }
            ampm = "PM";
        }
        return  (h12h + ":" + ("00" + m12h  ).slice(-2) + " " + ampm)
       
    }
    return (
        <Modal show={openModal} onHide={() => { onCloseModal(); handleCancel() }} centered>
            <Modal.Header className="text-center">
                <Modal.Title>{t("please_install_the_reservation_at_one_of_the_companys_branches_during")}
                    {" "}
                    <span className="c-blue">{t("24hours")}</span>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                <div>
                    <bdi>
                        <span>
                            {t("assembly_to")}
                        </span>
                        :
                        <span>
                            {place}
                        </span>
                    </bdi>
                </div>
                <div>
                    <bdi>
                        <span>{t("gathering_date")} : </span> <span>{prevHulf(date)}</span>
                    </bdi>
                </div>
                <strong>
                    {t("you_can_request_a_car_to_take_you_to_the_gathering_point_for_free")}
                </strong>
            </Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn h-button d-block mx-auto " onClick={() => { onCloseModal(); handleOpenNext() }} >{t("car_order")}</button>
                <span type="submit" className="btn h-button d-block mx-auto cancle " onClick={() => { onCloseModal(); handleCancel() }}>{t("no_thank_you")}</span>
            </Modal.Footer>
        </Modal>

    )
}
