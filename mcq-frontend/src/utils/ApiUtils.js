import Axios from "axios"
import {Cookies} from "react-cookie";
import {SERVER_API} from "../config";

const cookies = new Cookies()
export let DEBUG = true

export function userCall(method, url, onSuccess, onFailed, onError, onFinally) {
    Axios({
        method,
        url,
        headers: {
            Authorization: getToken()
        }
    })
        .then(({data: res}) => {
            if (DEBUG)
                console.log(`response of ${url}: `, res)
            if (res.success) {
                onSuccess(res.data)
            } else {
                onFailed(res.message)
            }
        })
        .catch(err => {
            onError('Lỗi không xác định!')
        })
        .finally(() => {
            onFinally()
        })
}

export function anonymousCall(method, url, onSuccess, onFailed, onError, onFinally) {
    Axios({
        method,
        url,
    })
        .then(({data: res}) => {
            if (DEBUG)
                console.log(`response of ${url}: `, res)
            if (res.success) {
                onSuccess(res.data)
            } else {
                onFailed(res.message)
            }
        })
        .catch(err => {
            onError('Lỗi không xác định!')
        })
        .finally(() => {
            onFinally()
        })
}

export function anonymousCallWithData(method, url, data, onSuccess, onFailed, onError, onFinally) {
    Axios({
        method,
        url,
        data
    })
        .then(({data: res}) => {
            if (DEBUG)
                console.log(`response of ${url}: `, res)
            if (res.success) {
                onSuccess(res.data)
            } else {
                onFailed(res.message)
            }
        })
        .catch(err => {
            onError('Lỗi không xác định!')
        })
        .finally(() => {
            onFinally()
        })
}

export function userCallWithData(method, url, data, onSuccess, onFailed, onError, onFinally) {
    Axios({
        method,
        url,
        headers: {
            Authorization: getToken()
        },
        data
    })
        .then(({data: res}) => {
            if (DEBUG)
                console.log('body data', data)
            console.log(`response of ${url}: `, res)
            if (res.success) {
                onSuccess(res.data)
            } else {
                onFailed(res.message)
            }
        })
        .catch(err => {
            onError('Lỗi không xác định!')
        })
        .finally(() => {
            onFinally()
        })
}

export function getUserInfo(onSuccess, onError, onFinish) {
    const token = getToken()

    if (token) {
        Axios({
            method: 'GET',
            url: `${SERVER_API}/user`,
            headers: {
                Authorization: token
            }
        })
            .then(({data: res}) => {
                if (res.success) {
                    onSuccess(res.data)
                } else {
                    removeToken()
                    onError(res.message)
                }
            })
            .catch(err => {
                onError(err.message)
            })
            .finally(() => {
                onFinish()
            })
    }
}

export function getToken() {
    return cookies.get('token', {path: '/'})
}

export function setToken(token) {
    if (token)
        cookies.set('token', token, {
            path: '/',
            maxAge: 7 * 23 * 3600
        })
}

export function removeToken() {
    cookies.remove('token', {path: '/'})
}

export function transformUrl(url) {
    if (url.indexOf('drive.google.com') >= 0) {
        if (url.indexOf('usp') >= 0)
            return url.replace('view?usp=sharing', 'preview')
        if (url.indexOf('open?id=') >= 0) {
            const param = new URLSearchParams(url.substr(url.indexOf('?')))
            return `https://drive.google.com/file/d/${param.get('id')}/preview`
        }
    } else if (url.indexOf('youtube.com') >= 0) {
        const param = new URLSearchParams(url.substr(url.indexOf('?')))
        return `https://www.youtube.com/embed/${param.get('v')}`
    }
    return url
}
