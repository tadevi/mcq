import React from "react";
import {Button, Checkbox, Form, Select, Table} from 'semantic-ui-react'
import {getRole} from "../../../../utils/ApiUtils";

const options = [
    {
        key: 'user',
        value: 'user',
        text: getRole('user')
    },
    {
        key: 'teacher',
        value: 'teacher',
        text: getRole('teacher')
    },
    {
        key: 'admin',
        value: 'admin',
        text: getRole('admin')
    }
]
export default class UserEditor extends React.Component {
    state = {
        active: this.props.defaultActive || false,
        remain: Math.round(this.props.defaultRemain * 10 / 60) / 10 || 300,
        role: this.props.defaultRole || 'user'
    }

    handleChange(name, value) {
        this.setState({
            [name]: value
        }, () => {
            const {onChange} = this.props
            if (typeof onChange === 'function') {
                onChange({
                    ...this.state,
                    remain: this.state.remain * 60
                })
            }
        })
    }

    render() {
        return (
            <Form>
                <Form.Field>
                    <label>Vai trò</label>
                    <Select options={options}
                            defaultValue={this.state.role}
                            onChange={(e, {value}) => this.handleChange('role', value)}
                    />

                </Form.Field>
                <Form.Field>
                    <Checkbox label={"Đã xác nhận:"} toggle checked={this.state.active}
                              onChange={(e, {checked}) => this.handleChange('active', checked)}/>
                </Form.Field>
                <Form.Field>
                    <label>Thời gian còn lại (giờ):</label>
                    <Form.Input value={this.state.remain}
                                onChange={(e, {value}) => this.handleChange('remain', value)}
                                type={'number'}
                                disabled={!this.state.active}
                    />
                </Form.Field>
            </Form>
        )
    }
}