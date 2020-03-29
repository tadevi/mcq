import React from "react";
import { Button, Checkbox, Form, Select, Table } from 'semantic-ui-react'
import { getRole, roleSupport } from "../../../../utils/ApiUtils";

const options = roleSupport.map(item => ({
    key: item,
    value: item,
    text: getRole(item)
}))

export default class UserEditor extends React.Component {
    state = {
        active: this.props.defaultActive || false,
        remain: Math.round(this.props.defaultRemain * 10 / 60) / 10 || 300,
        role: this.props.defaultRole || 'user',
        password:''
    }

    handleChange(name, value) {
        this.setState({
            [name]: value
        }, () => {
            const { onChange } = this.props
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
                        onChange={(e, { value }) => this.handleChange('role', value)}
                    />

                </Form.Field>
                <Form.Field>
                    <Checkbox label={"Đã xác nhận:"} toggle checked={this.state.active}
                        onChange={(e, { checked }) => this.handleChange('active', checked)} />
                </Form.Field>
                <Form.Field>
                    <label>Thời gian còn lại (giờ):</label>
                    <Form.Input value={this.state.remain}
                        onChange={(e, { value }) => this.handleChange('remain', value)}
                        type={'number'}
                        disabled={!this.state.active}
                    />
                </Form.Field>
                <Form.Field>
                <label>Mật khẩu mới:</label>
                    <Form.Input value={this.state.password}
                        onChange={(e, { value }) => this.handleChange('password', value)}
                        placeholder={'Nhập để thay đổi mật khẩu'}
                        disabled={!this.state.active}
                    />
                </Form.Field>
            </Form>
        )
    }
}