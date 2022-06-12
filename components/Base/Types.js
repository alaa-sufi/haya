import React from 'react'
import NoInfo from "components/UI/NoInfo"
import add from "public/images/add circle.svg"
import Image from 'next/image';
import Link from "next/link";
import {useRouter} from "next/router";
export default function Types({ head, grid, role, datas, aspectRatio, small, city, loading , errorPage,onOpenModal ,noadd ,prefix,notInfo}) {
    const router = useRouter()
    return (
        <div className="h-types ">
            {(small && head) ? <h2>{head}</h2> :head ? <h1 className="h-h1">{head}</h1> : null}
            {(role != "user" && noadd !== true) ? <button className="h-add-drivers" onClick={onOpenModal} >
                <Image src={add} alt="alt" width="50" height="50" />
            </button>
            : null
            }
            <div className="row">
                {datas.length > 0 ? datas.map((data) => (
                    <div className={`${grid === "5" ? "col-lg-2 col-md-3 col-4" : grid === "4" ? "col-3" : grid === "3" ? "col-md-4 col-2" : "col-md-6"} mb-sm-4`} key={data.id}>
                        <div className={`h-types-block position-relative islink ${city && "city"}`}>
                            <Link href={prefix ? `${router.asPath}/${prefix}/${data.id}` : `${router.asPath}/${data.id}`}  >
                                <a  className="h-global-a"></a>
                            </Link>
                            <div className="w-100 position-relative"  style={{ aspectRatio: aspectRatio }}>
                                <Image src={data.main_image ? data.main_image : data.image ? data.image : data.image_main} layout="fill" className="radius-1" alt={data.name} />
                            </div>
                            {small ? <h3 className={`h-types-h2 ${city ? "text-center" : "text-end"}`}>{data.name}</h3> : <h2 className="h-types-h2">{data.name}</h2>}
                        </div>
                    </div>))
                    :
                    !notInfo ? <NoInfo /> : <></>
                }
            </div>
        </div>
    )
}
