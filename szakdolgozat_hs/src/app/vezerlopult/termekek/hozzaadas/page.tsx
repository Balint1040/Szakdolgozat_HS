"use client"

import ProductSwiper from "@/components/ProductSwiper"
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { faAnglesLeft, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"
import { enqueueSnackbar } from "notistack"
import { useState } from "react"
import fallbackImg from '../../../../../public/static/imgNotFound.png'


export default function Page() {
  const router = useRouter()

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    manufacturer: "",
    categoryId: "1",
    properties: {} as Record<string, string>,
    imageUrls: [""]
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if(!newProduct.name){
      enqueueSnackbar("A termék neve kötelező", { variant: "error", autoHideDuration: 2000 })
      return
    }
    if(!newProduct.price){
      enqueueSnackbar("A termék árának megadása kötelező", { variant: "error", autoHideDuration: 2000 })
      return
    }
    if(!newProduct.manufacturer){
      enqueueSnackbar("A gyártó megadása kötelező", { variant: "error", autoHideDuration: 2000 })
      return
    }

    try {
      const validImages = newProduct.imageUrls.filter(url => url && url !==fallbackImg.src) 

      const validProperties = Object.fromEntries(Object.entries(newProduct.properties)
      .filter(([key, value]) => key.trim() && value.trim()))

      const res = await fetch('/api/products', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": process.env.NEXT_PUBLIC_API_KEY || "",
        },
        body: JSON.stringify({
          ...newProduct,
          properties: validProperties,
          images: validImages,
        }),
      })

      if (res.ok) {
        enqueueSnackbar("Sikeres termékhozzáadás", { variant: "success", autoHideDuration: 2000 })
        setNewProduct({
          name: "",
          price: 0,
          manufacturer: "",
          categoryId: "",
          properties: {},
          imageUrls: [""],
        })
      } 
    } catch (e) {
      console.error(e)
      enqueueSnackbar("Terméket nem sikerült létrehozni", { variant: "error", autoHideDuration: 2000 })
    }
  }


  const categoryOptions = {
    1: "Videókártya",
    2: "Processzor",
    3: "Alaplap",
    4: "Memória"
  }

  return (
    <>
      <div>
        <div className="container-fluid productContainer py-3 mt-5 mt-lg-0 position-relative">
          <div className="mb-2">
            <a className='pointer' onClick={() => { router.push('/vezerlopult/termekek') }}>
              <FontAwesomeIcon icon={faAnglesLeft as IconProp} /> Vissza
            </a>
          </div>
          <div className="row justify-content-center justify-content-xxl-start">
            <div className="col-12 col-sm-10 col-md-8 col-lg-12 col-xxl-6 order-2 order-xxl-1 mt-5 mt-xxl-0">
              <ProductSwiper images={newProduct.imageUrls.map(url => ({
                url: url || fallbackImg.src
              }))} />
              <div className="mb-3">
                <label className="form-label">Képek kezelése:</label>
                {newProduct.imageUrls.map((url, index) => (
                  <div key={index} className="d-flex align-items-center mb-2">
                    <img
                      src={url || fallbackImg.src}
                      style={{ width: '50px', height: '50px', objectFit: 'contain', marginRight: '10px' }}
                    />
                    <input
                      type="text"
                      className="form-control"
                      value={url !== fallbackImg.src ? url : ""}
                      onChange={(e) => {
                        const newUrl = e.target.value
                        setNewProduct(prev => {
                          if (prev.imageUrls.includes(newUrl)) {
                            enqueueSnackbar("Ez a kép már hozzá lett adva", { variant: "error", autoHideDuration: 2000 })
                            return prev
                          }
                          const updatedImageUrls = [...prev.imageUrls]
                          updatedImageUrls[index] = newUrl
                          return { ...prev, imageUrls: updatedImageUrls }
                        })
                      }}
                      placeholder="Kép URL"
                    />
                    <button
                      type="button"
                      className="btn btn-danger btn-sm ms-2"
                      onClick={() => 
                        setNewProduct(prev => ({
                          ...prev, imageUrls: prev.imageUrls.filter((_, i) => i !== index)
                        }))
                      }
                    >
                      <FontAwesomeIcon icon={faTrash as IconProp} />
                    </button>
                  </div>
                ))}
                <button
                  className="addImgButton"
                  onClick={() => {
                    setNewProduct(prev => ({
                      ...prev,
                      imageUrls: [...prev.imageUrls, ""]
                    }))
                  }}
                >
                  Új kép hozzáadása
                  <span><FontAwesomeIcon icon={faPlus as IconProp} /></span>
                </button>
              </div>
            </div>
            <div className="col-12 col-xxl-6 order-1 order-xxl-2">
              <h2>{newProduct.name}</h2>
              <h3 className='my-3'>Ár: <span className="text-Blue">{Number(newProduct.price).toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, "$1.")},-</span></h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Név:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="price" className="form-label">Ár:</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    className="form-control"
                    value={isNaN(newProduct.price) ? "" : newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="manufacturer" className="form-label">Gyártó:</label>
                  <input
                    type="text"
                    id="manufacturer"
                    name="manufacturer"
                    className="form-control"
                    value={newProduct.manufacturer}
                    onChange={(e) => setNewProduct({ ...newProduct, manufacturer: e.target.value })}
                  />
                </div>
                <label className="form-label">Tulajdonságok:</label>
                {Object.entries(newProduct.properties).map(([key, value], index) => (
                  <div key={index}>
                    <div className="row my-4 my-sm-2">
                      <div className="col-10 col-sm-11">
                        <div className="row">
                          <div className="col-12 col-sm-6 mb-2 mb-sm-0">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Tulajdonság neve"
                              value={key}
                              onChange={(e) => {
                                const updatedProperties = { ...newProduct.properties }
                                const oldValue = updatedProperties[key]
                                delete updatedProperties[key]
                                updatedProperties[e.target.value] = oldValue
                                setNewProduct({ ...newProduct, properties: updatedProperties })
                              }}
                            />
                          </div>
                          <div className="col-12 col-sm-6">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Érték"
                              value={value}
                              onChange={(e) => {
                                const updatedProperties = { ...newProduct.properties }
                                updatedProperties[key] = e.target.value
                                setNewProduct({ ...newProduct, properties: updatedProperties })
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-1">
                        <div className="d-flex h-100 align-items-center justify-content-center">
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              setNewProduct({
                                ...newProduct,
                                properties: { ...newProduct.properties, "": "" },
                              })
                            }
                          >
                            <FontAwesomeIcon icon={faTrash as IconProp} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                    type="button"
                    className="addImgButton"
                    onClick={(e) => {
                      setNewProduct((prev) => ({
                        ...prev,
                        properties: { ...prev.properties, "": "" },
                      }))
                    }}
                >
                  Új tulajdonság hozzáadása
                  <span><FontAwesomeIcon icon={faPlus as IconProp} /></span>
                </button>
                <div className="mb-3">
                  <label htmlFor="categoryId" className="form-label">Termékkategória:</label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    className="form-control"
                    value ={newProduct.categoryId}
                    onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                  >
                    {Object.entries(categoryOptions).map(([id, name]) => (
                      <option key={id} value={id}>{name}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="orangeButton visually-hidden" id='productSumbit' name='productSumbit'>Mentés</button>
              </form>
            </div>
            <div className="col-12 order-3">
              <div className="d-flex justify-content-center">
                <label className="orangeButton w-min-content" htmlFor='productSumbit'>Mentés</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}