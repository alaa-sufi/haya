import React from 'react'
import { Modal } from "react-bootstrap";
import { HeaderField } from "../UI/Inputs"
export default function ShowContactModal(props) {
  return (
    <Modal show={props.openModal} onHide={() => { props.onCloseModal() }} centered>
      <HeaderField title="معلومات التواصل للشركة" />
      <Modal.Footer className="d-flex justify-content-center">
        <span className="btn h-button cancle" onClick={() => props.onCloseModal()} >اغلاق</span>
      </Modal.Footer>
    </Modal>
  )
}
