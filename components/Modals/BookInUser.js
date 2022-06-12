import React, { useState } from 'react'
import {useRouter} from "next/router"
import { Modal, Button } from "react-bootstrap";
import { Formik } from "formik";
import { ButtonsField } from '../UI/Inputs';
import * as Yup from "yup";
import { TextField, ImgField, HeaderField } from "../UI/Inputs"
import toast from "react-hot-toast";
import useTranslation from 'next-translate/useTranslation'
export default function BookInUser({ openModal,avilable_seats, onCloseModal }) {
    const { t, lang } = useTranslation("all")
    const router = useRouter();
    const [loadingButton, setLoadingButton] = useState(false)
    const onSubmit = (values) => {
        if(+values.count  > +avilable_seats){
            toast.error(t("sorry_there_are_not_enough_seats"));

        }else if (values.count > 0) {
            router.push(`${router.asPath}/book?total=${values.count}`);
        }
    }
    return (
        <Modal show={openModal} onHide={() => onCloseModal()} size="xs" centered>
        <Formik initialValues={{ count: 1 }} onSubmit={onSubmit} validationSchema={() => Yup.object().shape({
            count: Yup.number().required(t("please_enter_the_number_of_seats")).min(1)
        })}>
            {(props) => (
                <form onSubmit={props.handleSubmit}>
                    <Modal.Body>
                        <h5 className="fw-bold">{t("the_number_of_seats_to_be_booked")}:</h5>
                        <TextField name="count" type="number" className="h-input small form-control" />
                    </Modal.Body>
                    <ButtonsField modalState={{ next: true }} />
                </form>
            )}
        </Formik>
    </Modal>
    )
}
