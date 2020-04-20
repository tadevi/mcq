import React from "react";
import { Checkbox, Form, Select } from 'semantic-ui-react'
import { getRole, roleSupport } from "../../../../utils/ApiUtils";
import { planOptions, PLAN_TYPE } from "../../../constant/ServerConst";

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
        password:'',
        plan: this.props.plan || PLAN_TYPE.FREE
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
                <Form.Field>
                  <label>Loại bài giảng</label>
                  <Select
                    options={planOptions}
                    defaultValue={this.state.plan}
                    value={this.state.plan}
                    onChange={(e, { value }) =>
                      this.handleChange("plan", value)
                    }
                  />
                </Form.Field>
            </Form>
        )
    }
}