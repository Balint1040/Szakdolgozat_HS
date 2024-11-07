import Link from "next/link"
//import React from "react"

interface IProps {
    props: {
        name: string,
        href: string
    }
}

export default function OrangeButton({props}: IProps) {
    return (
        <Link className="buttonOrange" href={props.href}>{props.name}</Link>
    )
}