import Axios from "axios"
import { Cookies } from "react-cookie";
import { DEBUG, SERVER_API } from "../config";
import { Log } from "./LogUtil";

const cookies = new Cookies()
Axios.defaults.validateStatus = function () {
    return true
}

export function userCall(method, url, onSuccess, onFailed, onError, onFinally) {
    Axios({
        method,
        url,
        headers: {
            Authorization: getToken()
        }
    })
        .then(({ data: res }) => {
            Log(`response of ${method} ${url}: `, res)
            if (res.success) {
                onSuccess(res.data)
            } else {
                onFailed(res.message)
            }
        })
        .catch(err => {
            if (err.response) {
                onError(err.response.message)
            } else onError('Lỗi không xác định!')
        })
        .finally(() => {
            onFinally()
        })
}

export function anonymousCall(method, url, onSuccess, onFailed, onError, onFinally) {
    Axios({
        method,
        url
    })
        .then(({ data: res }) => {
            Log(`response of ${method} ${url}: `, res)
            if (res.success) {
                onSuccess(res.data)
            } else {
                onFailed(res.message)
            }
        })
        .catch(err => {
            if (err.response) {
                onError(err.response.message)
            } else onError('Lỗi không xác định!')
        })
        .finally(() => {
            onFinally()
        })
}

export function anonymousCallWithData(method, url, data, onSuccess, onFailed, onError, onFinally) {
    Log('body ', data)
    Axios({
        method,
        url,
        data
    })
        .then(({ data: res }) => {
            Log(`response of ${method} ${url}: `, res)
            if (res.success) {
                onSuccess(res.data)
            } else {
                onFailed(res.message)
            }
        })
        .catch(err => {
            if (err.response) {
                onError(err.response.message)
            } else onError('Lỗi không xác định!')
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
        .then(({ data: res }) => {
            Log('body data', data)
            Log(`response of ${method} ${url}: `, res)
            if (res.success) {
                onSuccess(res.data)
            } else {
                onFailed(res.message)
            }
        })
        .catch(err => {
            if (err.response) {
                onError(err.response.message)
            } else onError('Lỗi không xác định!')
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
            .then(({ data: res }) => {
                if (res.success) {
                    onSuccess(res.data)
                } else {
                    removeToken()
                    onError(res.message)
                }
            })
            .catch(err => {
                removeToken()
                if (err.response) {
                    onError(err.response.message)
                } else onError('Lỗi không xác định!')
            })
            .finally(() => {
                onFinish()
            })
    }
}

export function getToken() {
    return cookies.get('token', { path: '/' })
}

export function setToken(token) {
    if (token)
        cookies.set('token', token, {
            path: '/',
            maxAge: 7 * 23 * 3600
        })
}

export function removeToken() {
    cookies.remove('token', { path: '/' })
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
    } else if (url.indexOf('youtu.be') >= 0) {
        return url.replace('youtu.be', 'www.youtube.com/embed')
    }
    return url
}

export const roleSupport = ['teacher', 'admin', 'parent', 'user','dean']

export function getRole(role) {
    if (role === 'admin') {
        return 'Quản trị hệ thống'
    } else if (role === 'user') {
        return 'Học sinh'
    } else if (role === 'teacher') {
        return 'Giáo viên'
    }
    else if (role === 'parent') {
        return 'Phụ huynh'
    }
    else if(role=='dean'){
        return 'Quản trị trường'
    }
    return 'Undefined'
}

export function parseBlob(data, onFinish) {
    new Response(data).text().then(data => onFinish(JSON.parse(data))).catch(() => {
    })
}

export const uploadFile = (url, formData, onSuccess, onError, onFinally) => {
    Axios.post(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: getToken()
        }
    })
        .then((res) => {
            const data = res.data
            Log('response', data)
            if (!data.success)
                onError(data.message)
            else
                onSuccess(data)
        })
        .catch(err => onError(err))
        .finally(onFinally);
}

export function QueryString(){
    this.queryString=""
    this.put=function(key,value){
        if(key!==undefined&&value!==undefined){
            this.queryString+=`&${key}=${value}`
        }
    }
    this.get=function(){
        return this.queryString
    }
}