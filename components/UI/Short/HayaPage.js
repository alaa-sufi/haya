import React from 'react'
import LoadingSpinner from "../LoadingSpinner"
import Error from "../Error"
export default function HayaPage(props) {
     if(props.loading){
        return (
            <div className="position-relative" style={{height:`${props.height}`}}>
            <LoadingSpinner/>
        </div>
        )
      }
      if (props.errorPage) {
        return <Error error={props.errorPage} />
    }
    return (
        <div className="position-relative">
            {props.children}
        </div>
    )
}
