import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik } from "formik";
import { ButtonsField } from "components/UI/Inputs";
import * as Yup from "yup";
import { TextField, ImgField, HeaderField, CheckField } from "components/UI/Inputs";
import axios from '@/lib/axios'
import useSWR from "swr";
import toast from "react-hot-toast";

export default function AddEditHotel({
    openModal,
    onCloseModal,
    add,
    edit,
    dataEdit,
    handleChange,
    editId
}) {
    const [loadingButton, setLoadingButton] = useState(false);
    const { data: cites, error } = useSWR(
        `${process.env.NEXT_PUBLIC_SERVER}/city`
    );
    const onSubmit = (values) => {
        setLoadingButton(true);
        axios
            .post(add ? `${process.env.NEXT_PUBLIC_SERVER}/hotel` : `${process.env.NEXT_PUBLIC_SERVER}/hotel/${editId}`, values)
            .then((response) => {
                onCloseModal();
                setLoadingButton(false);
                handleChange(response.data.data.hotel)
            })
            .catch((error) => {
                console.error("There was an error!", error);
                onCloseModal();
                setLoadingButton(false);
                toast.error("عذرا حدثت مشكلة ما");

            });
    };
    const validateSchema = () => {
        return Yup.object().shape({
            name: Yup.string().required("يرجى ادخال اسم الفندق"),
            longtude: Yup.number().required("يرجى ادخال  خط الطول "),
            latitude: Yup.number().required("يرجى ادخال  خط العرض "),
            details: Yup.string().required("يرجى ادخال التفاصيل "),
            image: add && Yup.string().required("يرجى تحميل الصورة"),
            city_id: Yup.string().required("يرجى اختيار المدينة")
        }
        );
    };
    return (
        <Modal
            show={openModal}
            onHide={() => {
                onCloseModal();
            }}
            centered
        >
            <HeaderField title={add ? "+ إضافة فندق جديد" : " تعديل الفندق "} />
            <Formik
                initialValues={edit ? { name: dataEdit.name, longtude: dataEdit.longtude, latitude: dataEdit.latitude, details: dataEdit.details, image: "", category_id: 4, city_id: dataEdit.city_id } : { name: "", longtude: "", latitude: "", details: "", image: "", category_id: 4, city_id: "" }}
                onSubmit={onSubmit}
                validationSchema={validateSchema()}
            >
                {(props) => (
                    <form onSubmit={props.handleSubmit}>
                        <Modal.Body>
                            <div className="w-200 mw-full mx-auto  ">
                            <ImgField
                                name="image"
                                label="صورة الفندق"
                                aspect={1 / 1}
                                add={add}
                                width="300"
                                height="300"
                                img={edit && dataEdit.image}
                            />
                            </div>
                            <TextField name="name" type="text" label="اسم الفندق" />
                            <div className="row">
                                <div className="col-md-6">
                                    <TextField name="latitude" type="number" label="خط العرض" step="0.0000000001" />
                                </div>
                                <div className="col-md-6">
                                    <TextField name="longtude" type="number" label="خط الطول" step="0.0000000001" />
                                </div>
                            </div>
                            <TextField name="details" component="textarea" label="التفاصيل" />
                            <TextField name="city_id" as="select" label="المدينة "  >
                                <option>اختر مدينة</option>
                                {(!error && cites) && cites.data.cities.map((city, index) => (
                                    <option key={index} value={city.id}  >{city.name}</option>
                                ))}
                            </TextField>
                        </Modal.Body>
                        <ButtonsField
                            modalState={{ add: add, edit: edit }}
                            loading={loadingButton}
                            onCancle={onCloseModal}
                        />
                    </form>
                )}
            </Formik>
        </Modal>
    );
}
