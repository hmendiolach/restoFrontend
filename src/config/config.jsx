export const API = import.meta.env.VITE_BACKEND
export const VITE_BACKEND_SOCKET_IO = import.meta.env.VITE_BACKEND_SOCKET_IO
export const API_IMAGES_BASE_URL = import.meta.env.VITE_BACKEND_IMAGES_BASE_URL
export const FRONTEND_DOMAIN = import.meta.env.VITE_FRONTEND_DOMAIN

export const getQRMenuLink = (code) => {
    return `${FRONTEND_DOMAIN}/m/${code}`;
}

export const iconStroke = 1.5;

export const subscriptionPrice = "$5";
export const stripeProductSubscriptionId = "price_1POsjYSCWiCS3BoQN2lnBMTz";