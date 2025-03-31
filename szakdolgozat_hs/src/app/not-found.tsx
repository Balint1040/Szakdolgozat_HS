import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faCircleXmark, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='container'>
        <div className="d-flex flex-column justify-content-center align-items-center py-3" style={{minHeight: "calc(100vh - 100px)"}}>
            <div className="emptyCart h-auto">
                <div className="emptyIconWrap">
                    <FontAwesomeIcon icon={faMagnifyingGlass as IconProp} />
                    <FontAwesomeIcon icon={faCircleXmark as IconProp} />
                </div>
                A keresett oldal nem található
            </div>
            <Link href="/" className='notFoundLink'>Vissza a Főoldalra</Link>
        </div>
    </div>
  )
}