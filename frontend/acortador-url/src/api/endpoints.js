const BASE_URL = "http://localhost:3031"

export const ENDPOINTS = {
    auth: {
        login:  `${BASE_URL}/auth/signin`,
        refresh: `${BASE_URL}/auth/refresh-token`,
        profile: `${BASE_URL}/auth/get-user`,
    },
    shortLink: {
        create: `${BASE_URL}/c`,
    },
}