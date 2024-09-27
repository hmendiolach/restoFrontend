import { IconCarrot, IconMail, IconMapPin, IconMenu, IconPhone, IconShare, IconX } from '@tabler/icons-react'
import React, { useEffect, useState } from 'react'
import { getQRMenuLink, iconStroke } from '../config/config'
import { getQRMenuInit } from "../controllers/qrmenu.controller";
import { CURRENCIES } from '../config/currencies.config';
import { getImageURL } from "../helpers/ImageHelper";
import toast from 'react-hot-toast';
import { useParams, useSearchParams } from 'react-router-dom';
export default function QRMenuPage() {

  const params = useParams();
  const qrcode = params.qrcode;

  const [state, setState] = useState({
    isLoading: true,
    storeSettings: null,
    categories: [],
    currentCategory: "all",
    menuItems: [],
    searchQuery: "",
    currentItem: null
  });

  useEffect(()=>{
    _getQRMenu(qrcode);
  }, [qrcode]);

  const _getQRMenu = async (qrcode) => {
    try {
      const res = await getQRMenuInit(qrcode);
      if(res.status == 200) {
        const data = res.data;
        setState({
          ...state,
          isLoading: false,
          storeSettings: data?.storeSettings,
          categories: data?.categories,
          menuItems: data?.menuItems
        })
      }
    } catch (error) {
      console.log(error);
    }
  }

  const { isLoading, storeSettings, categories, menuItems, currentCategory, searchQuery, currentItem } = state;

  const storeName = storeSettings?.store_name || ""
  const address = storeSettings?.address || "";
  const phone = storeSettings?.phone || "";
  const email = storeSettings?.email || "";
  const currency = storeSettings?.currency;
  const image = storeSettings?.image || "";
  const is_qr_menu_enabled = storeSettings?.is_qr_menu_enabled || false;

  const currencySymbol = CURRENCIES.find((c)=>c.cc==currency) || "";

  if(isLoading) {
    return (
      <div className="w-full">
         <div className='container mx-auto px-4 flex h-screen items-center justify-center'>
            Please wait...
         </div>
      </div>
    )
  }

  if(!qrcode) {
    return (
      <div className="w-full">
         <div className='container mx-auto px-4 flex h-screen items-center justify-center'>
            Broken Link!
         </div>
      </div>
    )
  }

  if(!is_qr_menu_enabled) {
    return (
      <div className="w-full">
         <div className='container mx-auto px-4 flex h-screen items-center justify-center'>
            Menu Not Available!
         </div>
      </div>
    )
  }

  const QR_MENU_LINK = getQRMenuLink(qrcode);

  const btnShare = async () => {
    const shareData = {
      title: "Menu",
      text: "Menu",
      url: QR_MENU_LINK,
    };

    try {
      if(navigator.canShare){
        if(navigator?.canShare(shareData)) {
          await navigator.share(shareData);
        }
      } else {
        await navigator.clipboard.writeText(QR_MENU_LINK);
        toast.success("Menu Link Copied!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const btnOpenMenuItemDetail = (addons, variants, category_id, category_title, id, imageURL, price, title, ingredients) => {
    setState({
      ...state,
      currentItem: {
        addons: addons, variants: variants,
        category_id: category_id, category_title: category_title,
        id, image: imageURL, price, title, ingredients
      }
    })
    document.getElementById("modal_item_detail").showModal();
  }

  return (
    <div className='w-full'>
      <div className='container mx-auto px-4'>
        
        {/* appbar */}
        <div className='bg-white shadow-lg rounded-full p-2 w-full md:w-96 mx-auto mt-4 flex gap-2 sticky top-4 z-50'>
          <input type="search" name="search" id="search" className='bg-gray-100 rounded-full outline-none px-4 py-2 flex-1' placeholder='Search Menu...' value={searchQuery} onChange={e=>{
            setState({
              ...state, 
              searchQuery: e.target.value,
            })
          }} />
          <button className='btn btn-circle ' onClick={()=>document.getElementById('modal_store_details').showModal()}>
            <IconMenu stroke={iconStroke} />
          </button>
        </div>
        {/* appbar */}

        {/* store details: name, phone, address, email, share menu link */}
        <div className='py-4 px-6 w-full md:w-96 mx-auto bg-gray-100 rounded-3xl mt-10'>
          <h3 className="font-bold text-2xl mb-2">{storeName}</h3>
          {
            address && <div className="flex gap-2 mb-2">
              <IconMapPin stroke={iconStroke} />
              <p>{address}</p>
            </div>
          }
          <div className="flex flex-col sm:flex-row gap-4">
            {phone && <a href={`tel:${phone}`} className='flex gap-2'>
              <IconPhone stroke={iconStroke} />
              {phone}
            </a>}
            {email && <a href={`mailto:${email}`} className='flex gap-2'>
              <IconMail stroke={iconStroke} />
              {email}
            </a>}
          </div>
        </div>
        {/* store details: name, phone, address, email, share menu link */}

        {/* categories */}
        <div className='p-2 w-full md:w-96 overflow-x-auto mx-auto mt-4 flex gap-2'>
          <label>
            <input onChange={e=>{
              setState({
                ...state, 
                currentCategory: e.target.value
              })
            }} type="radio" name="category" id={'all'} value={'all'} className='peer hidden' defaultChecked />
            <label htmlFor={'all'} className='text-xs cursor-pointer rounded-full px-4 py-3 bg-transparent border hover:bg-gray-50 active:scale-95 transition text-gray-500 checked:bg-gray-200 peer-checked:bg-gray-200 flex'>
              <p>All</p>
            </label>
            
          </label>
          {
            categories.map((category, index)=>{
              const { id, title } = category;
              return <div key={index} className='min-w-fit'>
                <input onChange={e=>{
                  setState({
                    ...state, 
                    currentCategory: e.target.value
                  })
                }} type="radio" name="category" id={id} value={id} className='peer hidden' />
                <label htmlFor={id} className='text-xs min-w-fit flex items-center cursor-pointer rounded-full px-4 py-3 bg-transparent border hover:bg-gray-50 active:scale-95 transition text-gray-500 checked:bg-gray-200 peer-checked:bg-gray-200 '>
                  <p>{title}</p>
                </label>
                
              </div>
            })
          }
        </div>
        {/* categories */}

        {/* menu items */}
        <div className='p-2 w-full md:w-96 mx-auto mt-4 flex flex-col gap-4'>
          {
            menuItems.filter((item)=>{
              const {category_id} = item;
              if(currentCategory == "all") {
                return true;
              }
              if(currentCategory == category_id) {
                return true;
              }
              return false;
            }).filter((menuItem)=>{
              if(!searchQuery) {
                return true;
              }
              return new String(menuItem.title).trim().toLowerCase().includes(searchQuery.trim().toLowerCase());
            }).map((item, i)=>{
              const {addons, variants, category_id, category_title, id, image, price, title, ingredients} = item;
              // addon {id, item_id, title, price}
              // variant {id, item_id, title, price}

              const imageURL = getImageURL(image);

              return <div key={id} onClick={()=>{
                btnOpenMenuItemDetail(addons, variants, category_id, category_title, id, image?imageURL:null, price, title, ingredients)
              }} className='w-full rounded-3xl px-4 py-4 flex gap-4 hover:bg-gray-100 transition active:scale-95 cursor-pointer'>
                <div className=' rounded-2xl w-32 h-32 object-cover relative bg-gray-200 flex items-center justify-center text-gray-500 '>
                  {image ? <img src={imageURL} alt={title} className='w-full h-full absolute top-0 left-0 rounded-2xl object-cover z-0' /> : <IconCarrot />}
                </div>
                <div className='flex-1'>
                  <p className='text-lg'>{title}</p>
                  <p className='text-sm text-restro-green font-bold'>{currencySymbol.symbol}{price}</p>
                  {category_id && <p className="mt-2 text-xs text-gray-500">Category: {category_title}</p>}
                  <div className="flex gap-2 mt-2 text-xs text-gray-500">
                    {variants.length > 0 && <p>{variants.length} Variants available</p>}
                    {addons.length > 0 && <p>{addons.length} Addons available</p>}
                  </div>
                </div>
              </div>
            })
          }
        </div>
        {/* menu items */}

        {/* store details: name, phone, address, email, share menu link */}
        <dialog id="modal_store_details" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <div className="flex justify-end gap-4">
              <button className="btn btn-circle" onClick={btnShare}>
                <IconShare stroke={iconStroke} />
              </button>
              <form method="dialog">
                <button className="btn btn-circle"><IconX stroke={iconStroke} /></button>
              </form>
            </div>
            <div className='py-4 px-6 w-full mx-auto bg-gray-100 rounded-3xl mt-4'>
              <h3 className="font-bold text-2xl mb-2">{storeName}</h3>
              {
                address && <div className="flex gap-2 mb-2">
                  <IconMapPin stroke={iconStroke} />
                  <p>{address}</p>
                </div>
              }
              <div className="flex flex-col sm:flex-row gap-4">
                {phone && <a href={`tel:${phone}`} className='flex gap-2'>
                  <IconPhone stroke={iconStroke} />
                  {phone}
                </a>}
                {email && <a href={`mailto:${email}`} className='flex gap-2'>
                  <IconMail stroke={iconStroke} />
                  {email}
                </a>}
              </div>
            </div>
          </div>
        </dialog>
        {/* store details: name, phone, address, email, share menu link */}

        {/* dialog for detail menu item view with addon, variants */}
        <dialog id="modal_item_detail" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <div className="absolute top-4 right-4">
              <form method="dialog">
                <button className="btn btn-circle"><IconX stroke={iconStroke} /></button>
              </form>
            </div>
            
            <div className='w-full flex gap-4'>
              <div className=' rounded-2xl w-32 h-32 object-cover relative bg-gray-200 flex items-center justify-center text-gray-500 '>
                  {currentItem?.image ? <img src={currentItem?.image} alt={currentItem?.title} className='w-full h-full absolute top-0 left-0 rounded-2xl object-cover z-0' /> : <IconCarrot />}
                </div>
              <div className='flex-1'>
                <p className='text-lg'>{currentItem?.title}</p>
                <p className='text-sm text-restro-green font-bold'>{currencySymbol.symbol}{currentItem?.price}</p>
                {currentItem?.category_id && <p className="mt-2 text-xs text-gray-500">Category: {currentItem?.category_title}</p>}
                <div className="flex gap-2 mt-2 text-xs text-gray-500">
                  {currentItem?.variants.length > 0 && <p>{currentItem?.variants.length} Variants available</p>}
                  {currentItem?.addons.length > 0 && <p>{currentItem?.addons.length} Addons available</p>}
                </div>
              </div>
            </div>

            <div className="my-4 flex flex-col sm:flex-row gap-2">

              {currentItem?.variants.length > 0 && <div className="flex-1">
                <h3>Variants</h3>
                <div className="flex flex-col gap-2 mt-2">
                {
                  currentItem?.variants?.map((variant, index)=>{
                    const {id, item_id, title, price} = variant;
                    return <label key={index} className='cursor-pointer label justify-start gap-2'>
                      <input type="radio" className='radio' name="variants" id="" value={id} defaultChecked={index==0} /><span className="label-text">{title} - {currencySymbol.symbol}{price}</span>
                    </label>
                  })
                }
                </div>
              </div>}

              {currentItem?.addons.length > 0 && <div className="flex-1">
                <h3>Addons</h3>
                <div className="flex flex-col gap-2 mt-2">
                {
                  currentItem?.addons?.map((addon, index)=>{
                    const {id, item_id, title, price} = addon;
                    return <label key={index} className='cursor-pointer label justify-start gap-2'>
                      <input type="checkbox" name="addons" id="" className='checkbox  checkbox-sm' value={id} /><span className="label-text">{title} (+{currencySymbol.symbol}{price})</span>
                    </label>
                  })
                }
                </div>
              </div>}

              {currentItem?.ingredients?.length > 0 && <div className="flex-1">
                <h3>Ingredients</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                {
                  currentItem?.ingredients?.map((ingredient, index)=>{
                    return <div key={index} className='badge'>
                      {ingredient}
                    </div>
                  })
                }
                </div>
              </div>}
              
            </div>

            <p className='text-gray-500 text-xs'>*Shown prices are might be of inclusive/exclusive of applicable taxes, refer to final bill for payment amount.</p>
          </div>
        </dialog>
        {/* dialog for detail menu item view */}

      </div>
    </div>
  )
}