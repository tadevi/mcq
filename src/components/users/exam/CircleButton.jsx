import "../../../App.css"
import React, {useState} from 'react'
import {Form, Popup, Radio} from 'semantic-ui-react'

export function CircleButton({onChange, text, defaultValue}) {
    const [selectValue, setSelectedValue] = useState(defaultValue)
    const handleChange = (e, {value}) => {
        setSelectedValue(value)
        if (typeof onChange === 'function') {
            onChange(value)
        }
    }

    const getStyle = () => {
        if (selectValue!==' ')
            return {
                backgroundColor: '#2a6fb8',
                color: 'white',
                fontWeight: 'bold',
            }
        return {
            fontWeight: 'bold',
            marginRight: '50px',
        }
    }
    return (
        <div>
            <Popup
                trigger={<div style={getStyle()} className="btn-circle">{`${text}${selectValue || ''}`}</div>}
                flowing
                hoverable>
                <Form>
                    <Form.Field>
                        <Radio
                            label='A'
                            name='radioGroup'
                            value='A'
                            checked={selectValue === 'A'}
                            onChange={handleChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Radio
                            label='B'
                            name='radioGroup'
                            value='B'
                            checked={selectValue === 'B'}
                            onChange={handleChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Radio
                            label='C'
                            name='radioGroup'
                            value='C'
                            checked={selectValue === 'C'}
                            onChange={handleChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Radio
                            label='D'
                            name='radioGroup'
                            value='D'
                            checked={selectValue === 'D'}
                            onChange={handleChange}
                        />
                    </Form.Field>
                </Form>
            </Popup>
        </div>
    )
}
