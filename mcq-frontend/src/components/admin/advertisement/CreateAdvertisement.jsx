//ten,link to site, link image
import React, { useState } from 'react'
import { Form, Placeholder, Image, Button, Select, Checkbox } from 'semantic-ui-react'
import { useRef } from 'react'
import Axios from 'axios'
import { userCallWithData, uploadFile, userCall } from '../../../utils/ApiUtils'
import { SERVER_API } from '../../../config'

const directionOptions = [
    {
        key: 'horizontal',
        value: 'horizontal',
        text: 'Ngang'
    },
    {
        key: 'vertical',
        value: 'vertical',
        text: 'Dọc'
    }
]

const initialState = {
    name: '',
    linkClick: '',
    linkImage: '',
    type: 'horizontal',
    active: true,
}

const checkRequest = req => setError => {
    if (!req.name) {
        setError("Tên quảng cáo không thể trống!");
        return;
    }
    if (!req.linkClick) {
        setError("Liên kết quảng cáo không thế trống!")
        return
    }
    if (!req.linkImage) {
        setError("Hình ảnh của quảng cáo không thể trống!");
        return;
    }
    if (!req.type) {
        setError("Chiều của hình ảnh không thể trống!");
        return
    }
    if (!req.hasOwnProperty('active')) {
        setError("Quảng cáo phải chọn active/unactive!")
        return;
    }
}

function CreateAdvertisement(props) {
    const [state, setState] = useState(initialState)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [localPathImage, setLocalPathImage] = useState('')

    const inputEl = useRef(null);

    const onUploadButtonClick = () => {
        inputEl.current.click();
    }

    const handleChange = (event, { name, value }) => {
        console.log(state)
        if (name === 'active') //this is checkbox
        {
            setState({
                ...state,
                active: !state.active
            })
        }
        else {
            setState({
                ...state,
                [name]: value
            })
        }
    }

    const handleFileChoose = (event) => {
        setLocalPathImage(event.target.files[0])

        const formData = new FormData();
        formData.append('upload', event.target.files[0])

        setLoading(true)

        uploadFile(`${SERVER_API}/images`,
            formData,
            data => {
                setState({
                    ...state,
                    linkImage: data.url
                })
            },
            err => setError(err),
            () => setLoading(false)
        )
    }

    const postAds = adsInfo => setError => {
        checkRequest(adsInfo, setError)
        setLoading(true)
        userCallWithData(
            'POST',
            `${SERVER_API}/ads`,
            adsInfo,
            data => { },
            setError,
            setError,
            () => setLoading(false)
        )
    }

    const placeHolderUrl = 'https://react.semantic-ui.com/images/wireframe/image.png'

    return (
        <Form>
            <Form.Field>
                <Form.Input
                    fluid
                    label="Tên quảng cáo"
                    name="name"
                    value={state.name}
                    onChange={handleChange}
                />
            </Form.Field>
            <Form.Field>
                <Form.Input
                    label="Liên kết quảng cáo"
                    fluid
                    value={state.link}
                    name="linkClick"
                    onChange={handleChange}
                />
            </Form.Field>

            <div style={{ display: 'inline-block', margin: '10pt' }}>
                <Image src={localPathImage ? URL.createObjectURL(localPathImage) : placeHolderUrl} size='medium' />
                <input ref={inputEl} type='file' name='upload' hidden onChange={handleFileChoose} />
                <Button
                    onClick={onUploadButtonClick}
                    icon='plus'
                    color='green'
                    basic
                />
            </div>
            <Form.Field>
                <label>Hướng của hình ảnh:</label>
                <Select fluid options={directionOptions} onChange={handleChange} name="type" value={state.type} />
            </Form.Field>

            <Form.Field>
                <Checkbox checked={state.active} name='active' onChange={handleChange} label="Hiển thị" />
            </Form.Field>

            <Form.Field>
                <Button
                    primary
                    style={{ textAlign: 'center' }}
                    content="Add"
                    onClick={() => postAds(state)(setError)}
                />
            </Form.Field>
        </Form>
    )
}

export default CreateAdvertisement;