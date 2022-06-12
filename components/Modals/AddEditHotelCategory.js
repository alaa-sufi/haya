import React, { useState, useEffect } from 'react'
import { Modal, Button } from "react-bootstrap";
import { Formik } from "formik";
import { ButtonsField } from '../UI/Inputs';
import * as Yup from "yup";
import { TextField, ImgField, HeaderField } from "../UI/Inputs"
import axios from '@/lib/axios'
import toast from "react-hot-toast";


export default function AddEditHotelCategory({ openModal, onCloseModal, add, edit, dataEdit, handleChange ,HotelId}) {
   //console.log("dataEdit",dataEdit)
    const [loadingButton, setLoadingButton] = useState(false)
    const onSubmit = (values) => {
        setLoadingButton(true);
        axios
            .post(add ? `${process.env.NEXT_PUBLIC_SERVER}/hotelCategory/hotel/${HotelId}` : `${process.env.NEXT_PUBLIC_SERVER}/hotelCategory/${dataEdit.id}`, values)
            .then((response) => {
                onCloseModal();
                setLoadingButton(false);
                handleChange(response.data.data.hotelCategory)
            })
            .catch((error) => {
                if(error.response){
                    if(error.response.status === 500){
                        toast.error("يرجى ادخال خط طول وعرض صحيحين من موقع google map");
                        setLoadingButton(false);
                    }

                }else{
                    onCloseModal();
                    setLoadingButton(false);
                    toast.error("عذرا حدثت مشكلة ما");
                }

            });


    };
    const validateSchema = () => {
        return Yup.object().shape({
            name: Yup.string().required("يرجى ادخال اسم الصنف"),
            price: Yup.number().required(" يرجى ادخال السعر"),
        }
        );
    }
    return (
        <Modal show={openModal} onHide={() => { onCloseModal() }} centered>
            <HeaderField title={add ?
                "+ إضافة صنف جديد" :
                " تعديل الصنف "}
            />
            <Formik initialValues={edit ? { name: dataEdit.name, price: dataEdit.price } : { name: "", price: "" }} onSubmit={onSubmit} validationSchema={validateSchema()}>
                {(props) => (
                    <form onSubmit={props.handleSubmit}>
                        <Modal.Body>
                            <TextField name="name" type="text" label="اسم الصنف" />
                            <TextField name="price" type="number" label="سعر الصنف" />
                        </Modal.Body>
                        <ButtonsField modalState={{ add: add, edit: edit }} loading={loadingButton} />
                    </form>
                )}
            </Formik>
        </Modal>
    )
}
