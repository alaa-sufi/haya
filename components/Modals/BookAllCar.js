import React, { useState } from 'react'
import { Modal, Button } from "react-bootstrap";
import { Formik } from "formik";
import { ButtonsField } from '@/UI/Inputs';
import * as Yup from "yup";
import { TextField, ImgField, HeaderField } from "../UI/Inputs"


export default function BookAllCar({ openModal, onCloseModal }) {
    const [addForm, setAddForm] = useState({ image: "", type: "", name: "", seats: "", user: "", password: "" })
    const [loadingButton, setLoadingButton] = useState(false)

    const onSubmit = (values) => {
        setLoadingButton(true)
        // postApi("/api/category", values).then(response => {
        //   setAddModal(false);
        //   setLoading(true)
        //   setLoadingButton(false)
        //   getApi("/api/category").then(response => {
        //     setHTypes(response.data.data);
        //     setLoading(false)
        //   })
        // })
    };
    const validateSchema = () => {
        return Yup.object().shape({
            name: Yup.string().required("يرجى ادخال الصنف"),
            image_base64: Yup.string().required("يرجى ادخال الصورة")
        });
    }
    return (
        <Modal show={openModal} onHide={() => { onCloseModal() }} centered>
            <HeaderField title="حجز سيارة كاملة" />
            <Formik initialValues={addForm} onSubmit={onSubmit} validationSchema={validateSchema()}>
                {(props) => (
                    <form onSubmit={props.handleSubmit}>
                        <Modal.Body>
                            <TextField name="from" component="select" label="من" >
                                {/* {ctx.optioncites.map((city, i) => (
                                    <option key={i} value={city.value}>{city.label}</option>
                                ))} */}
                            </TextField>
                            <TextField name="to" component="select" label="الى" >
                                {/* {ctx.optioncites.map((city, i) => (
                                    <option key={i} value={city.value}>{city.label}</option>
                                ))} */}
                            </TextField>
                            <TextField name="seats" type="number" label="عدد الركاب" />
                            <TextField name="name" type="text" label="الاسم الكامل" dir="auto" />
                            <TextField name="phone" type="tel" label="رقم الموبايل" />
                        </Modal.Body>
                        <ButtonsField modalState={{ book: true }} loading={loadingButton} onCancle={() => { onCloseModal() }}/>
                    </form>
                )}
            </Formik>
        </Modal>
    )
}
