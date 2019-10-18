import React from 'react'
import {Button, Form, Grid, Header, Image, Message, Segment} from 'semantic-ui-react'
import validator from 'validator'
import {SERVER_API} from '../../../config'
import {anonymousCallWithData} from "../../../utils/ApiUtils";

class RegisterScreen extends React.Component {
    state = {
        email: '',
        password: '',
        rePassword: '',
        name: '',
        phone: '',
        formError: '',
        formSuccess: false,
        loading: false
    }

    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    handleChange(e, {name, value}) {
        this.setState({
            [name]: value
        })
    }

    registerClick() {
        this.setState({
            loading: true
        })
        const {name, email, password, phone} = this.state
        anonymousCallWithData(
            'POST',
            `${SERVER_API}/signup`,
            {
                name,
                email,
                password,
                phone
            },
            data => this.setState({formSuccess: true}),
            err => this.setState({formError: err}),
            err => this.setState({formError: err}),
            () =>
                this.setState({
                    loading: false
                })
        )
    }

    onSubmit() {
        if (!validator.isEmail(this.state.email)) {
            this.setState({
                formError: 'Email không hợp lệ!'
            })
            return
        }
        if (this.state.password !== this.state.rePassword) {
            this.setState({
                formError: 'Mật khẩu không khớp.'
            })
            return
        }
        this.setState({
            formError: ''
        })
        this.registerClick()
    }

    render() {
        return (
            <Grid textAlign='center' style={{height: '80vh'}} verticalAlign='middle'>
                <Grid.Column style={{maxWidth: 450}}>
                    <Header as='h2' color='teal' textAlign='center'>
                        <Image src='https://www.digicert.com/account/images/login-shield.png'/> Đăng ký tài khoản
                    </Header>
                    <Form size='large' error={this.state.formError} loading={this.state.loading}
                          success={this.state.formSuccess}>
                        <Segment stacked>
                            <Message
                                error
                                attached
                                header="Error"
                                content={this.state.formError}
                                style={{marginBottom: '10px'}}
                            />
                            <Form.Input
                                required
                                fluid
                                icon='user'
                                iconPosition='left'
                                placeholder='Email'
                                name='email'
                                value={this.state.email}
                                onChange={this.handleChange}
                            />
                            <Form.Input
                                required
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder='Mật khẩu'
                                type='password'
                                name='password'
                                value={this.state.password}
                                onChange={this.handleChange}
                            />
                            <Form.Input
                                required
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder='Nhập lại mật khẩu'
                                type='password'
                                name='rePassword'
                                value={this.state.rePassword}
                                onChange={this.handleChange}
                            />
                            <Form.Input
                                fluid
                                icon='phone'
                                iconPosition='left'
                                type='number'
                                placeholder="Số điện thoại"
                                name='phone'
                                value={this.state.phone}
                                onChange={this.handleChange}
                            />
                            <Form.Input
                                fluid
                                icon='content'
                                iconPosition='left'
                                placeholder='Họ và tên'
                                name='name'
                                value={this.state.name}
                                onChange={this.handleChange}
                            />
                            <Message success>
                                Yêu cầu tạo tài khoản sẽ được gửi đến người quản trị và xác nhận.
                            </Message>
                            <Button primary fluid size='large' onClick={this.onSubmit}>
                                Đăng ký
                            </Button>
                        </Segment>
                    </Form>
                </Grid.Column>
            </Grid>
        )
    }
}

export default RegisterScreen
