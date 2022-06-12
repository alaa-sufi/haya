import React from 'react'
import   Link from "next/link";
import { IconButton } from '@mui/material';
import { Edit, AddCircle, Delete , DirectionsBus } from '@mui/icons-material';
import useWindowSize from "hooks/use-window"

export default function ActionButtons({ icons }) {
  const size = useWindowSize();

    return (
        <ul className="h-trip-info-ul gap-lg-5 gap-2 justify-content-end">
            {icons.map((icon, i) => (
                <li key={i} className="position-relative">
                    <IconButton onClick={icon.onOpenModal}>
                        <HasLink link={icon.link}>
                            {icon.icon === "add" ? <AddCircle color="primary" fontSize={size.width < 576 ? "small" : "large"} alt="add" /> :
                                icon.icon === "edit" ? <Edit color="primary" fontSize={size.width < 576 ? "small" : "large"} alt="edit" /> :
                                icon.icon === "bus" ? <DirectionsBus color="primary" fontSize={size.width < 576 ? "small" : "large"} alt="delete" /> :
                                    icon.icon === "delete" ? <Delete color="primary" fontSize={size.width < 576 ? "small" : "large"} alt="delete" /> :
                                     ""
                            }
                        </HasLink>
                    </IconButton>
                </li>
            ))}
        </ul>
    )
}
const HasLink = (props) => {
    return (
        <>
            {props.link ? <Link href={props.link}><a>{props.children}</a></Link> : <> {props.children}</>}
        </>
    )
}