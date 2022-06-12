import React from 'react'
import LoadingSpinner from "../../UI/LoadingSpinner"
import NoInfo from "../NoInfo"

export default function BlueArea({errorPage,loading, ...props }) {

    // if(loading ){
    //     <section className={`${props.className}`}>
    //         <div className="container">
    //             <div className="h-block-blue">
    //             <LoadingSpinner />
    //             </div>
    //         </div>
    //     </section>
    // }
    
    // if(errorPage){
    //     return(
    //         <section className={`${props.className}`}>
    //         <div className="container">
    //             <div className="h-block-blue">
    //                 <NoInfo error/>
    //             </div>
    //         </div>
    //     </section>
    //     )
    // }
    return (
        <section className={`${props.className}`}>
            <div className="container">
                <div className="h-block-blue">
                        { props.children}
                </div>
            </div>
        </section>
    )
}
