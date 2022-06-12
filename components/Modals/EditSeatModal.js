import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik } from "formik";
import { ButtonsField } from "components/UI/Inputs";
import LoadingSpinner from "components/UI/LoadingSpinner"
import NumberToStrignSeat from "@/Functions/NumberToStrignSeat";
import * as Yup from "yup";
import { TextField, ImgField, HeaderField, DateField } from "components/UI/Inputs";
import axios from '@/lib/axios'
import useSWR from "swr";
import toast from "react-hot-toast";
import useTranslation from 'next-translate/useTranslation'

export default function EditSeatModal({
    openModal,
    onCloseModal,
    dataEdit,
    indexSeat,
    handleChange
}) {
    //console.log("indexSeat" ,indexSeat)
    const [loadingButton, setLoadingButton] = useState(false);
    const { t, lang } = useTranslation("all")
    const [seat, setSeat] = useState(NumberToStrignSeat(t));

    const onSubmit = (values) => {
        setLoadingButton(true);
        axios
            .post(`${process.env.NEXT_PUBLIC_SERVER}/seat/${dataEdit.id}/update`, values)
            .then((response) => {
                onCloseModal();
                setLoadingButton(false);
                handleChange(response.data.data.seat)
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
            first_name: Yup.string().required(t("please_enter_the_name")),
            last_name: Yup.string().required(t("please_enter_the_last_name")),
            mother_name: Yup.string().required(t("please_enter_the_mothers_name_and_last_name")),
            father_name: Yup.string().required(t("please_enter_the_fathers_name")),
            // obj[currentStep][`id_number`] = Yup.number().min(11 , t("please_enter_the_id_number")).max(11 , t("please_enter_the_id_number")).required(t("please_enter_the_id_number"))
            id_number: Yup.number().required(t("please_enter_the_id_number")),
            phone_number: Yup.string().required(t("please_enter_the_phone_number")),
            // email: Yup.string().required(t("please_enter_the_email")),
            date_of_birthday: Yup.date().default(function () { return new Date(); }),
            // front_idCard: Yup.string().required(t("please_enter_the_first_face")),
            // back_idCard: Yup.string().required(t("please_enter_the_back_face"))

        }
        );
    };

    return (
        <Modal
            show={openModal}
            onHide={() => {
                onCloseModal();
            }}
            size="xl"
            centered
        >
            <HeaderField title={t("edit_seat_information")} />
            <Formik
                validationSchema={validateSchema}
                initialValues={{ first_name: dataEdit.first_name, last_name: dataEdit.last_name, mother_name: dataEdit.mother_name, father_name: dataEdit.father_name, id_number: dataEdit.id_number, phone_number: dataEdit.phone_number, date_of_birthday: dataEdit.date_of_birthday, front_idCard: "", back_idCard: "" }}
                onSubmit={onSubmit}
            >
                {(props) => (
                    <form onSubmit={props.handleSubmit}>
                          <Modal.Body>
                        <div  >
                            <div >
                                <h4 className="fw-bold">{lang === "en" ? `${seat[indexSeat + 1]} ${t("the_seat")}` : `${t("the_seat")} ${seat[indexSeat + 1]}`} :</h4>
                                <div className={`row `}>
                                    <div className="col-md-6">
                                        <TextField name={`first_name`} type="text" label={t("the_name")} />
                                    </div>
                                    <div className="col-md-6">
                                        <TextField name={`last_name`} type="text" label={t("the_last_name")} />
                                    </div>
                                    <div className="col-md-6">
                                        <TextField name={`father_name`} type="text" label={t("name_of_the_father")} />
                                    </div>
                                    <div className="col-md-6">
                                        <TextField name={`mother_name`} type="text" label={t("mothers_name_and_last_name")} />
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <TextField name={`date_of_birthday`} type="date" label={t("place_and_date_of_birth")} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <TextField name={`id_number`} type="text" label={t("the_id_number")} />
                                    </div>
                                    <div className="col-md-6">
                                        <TextField name={`phone_number`} type="text" label={t("mobile_number")} />
                                    </div>
                                    <div className="col-md-6">
                                        {/* <TextField name={`email`} type="email" label={t("e_mail")} /> */}
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="h-label">{t("the_image_of_the_identity")}</label>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <h5>
                                            {t("a_passport_image_can_be_included_if_you_are_non_syrian_or_a_family_book_on_the_babys_page")}
                                        </h5>
                                    </div>
                                    <div className="col-md-6">
                                        <ImgField name={`front_idCard`} label={t("the_first_face")} aspect={2.5 / 1} add={false} width="600" height="250" img={dataEdit.front_idCard} />
                                    </div>
                                    <div className="col-md-6">
                                        <ImgField name={`back_idCard`} label={t("the_second_face")} aspect={2.5 / 1} add={false} width="600" height="250" img={dataEdit.back_idCard} />
                                    </div>
                                </div>
                            </div>
                        </div>
                          </Modal.Body>
                        <ButtonsField
                            modalState={{ add: false, edit: true }}
                            loading={loadingButton}
                            onCancle={onCloseModal}
                        />
                      
                    </form>
                )}
            </Formik>
        </Modal>
    );
}
