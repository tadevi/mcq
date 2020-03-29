import React from 'react'
import { Button, Form, Grid, Header, Image, Loader, Message, Segment, Select } from 'semantic-ui-react'
import validator from 'validator'
import { SERVER_API } from '../../../config'
import { anonymousCallWithData } from "../../../utils/ApiUtils";
import { withRouter } from 'react-router-dom'


const heightStyle = {
    height: '80vh'
}
const widthStyle = {
    maxWidth: 450
}

const roleOptions = [
    {
        key: 'parent',
        value: 'parent',
        text: 'Phụ huynh'
    },
    {
        key: 'user',
        value: 'user',
        text: 'Học sinh'
    }
]

class RegisterScreen extends React.Component {
    state = {
        email: '',
        password: '',
        rePassword: '',
        name: '',
        phone: '',
        role: 'user',
        formError: '',
        formSuccess: false,
        loading: false,
        redirectLoading: false
    }

    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    handleChange(e, { name, value }) {
        this.setState({
            [name]: value
        })
    }

    registerClick() {
        this.setLoading(true);
        const { name, email, password, phone, role } = this.state
        anonymousCallWithData(
            'POST',
            `${SERVER_API}/signup`,
            {
                name,
                email,
                password,
                phone,
                role
            },
            data => {
                this.setState({
                    formSuccess: true
                },
                    () => {
                        this.setState({
                            redirectLoading: true
                        })
                        this.timeout = setTimeout(() => {
                            const { history } = this.props
                            history.push('/')
                        }, 2000)
                    })
            },
            err => this.setError(err),
            err => this.setError(err),
            () => this.setLoading(false)
        )
    }
    setLoading(loading) {
        this.setState({
            loading
        })
    }
    setError(err) {
        this.setState({
            formError: err
        })
    }

    componentDidMount() {
        clearTimeout(this.timeout)
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
        const { formSuccess, formError, loading, email, password, rePassword, phone, name } = this.state
        return (
            <div>
                <Grid textAlign='center' style={heightStyle} verticalAlign='middle'>
                    <Grid.Column style={widthStyle}>
                        <Header as='h2' color='teal' textAlign='center'>
                            <Image src='https://www.digicert.com/account/images/login-shield.png' /> Đăng ký tài khoản
                        </Header>
                        <Form size='large' error={formError} loading={loading}
                            success={formSuccess}>
                            <Segment stacked>
                                <Message
                                    error
                                    attached
                                    header="Error"
                                    content={this.state.formError}
                                    style={{ marginBottom: '10px' }}
                                />
                                <Form.Input
                                    required
                                    fluid
                                    icon='user'
                                    iconPosition='left'
                                    placeholder='Email'
                                    name='email'
                                    value={email}
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
                                    value={password}
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
                                    value={rePassword}
                                    onChange={this.handleChange}
                                />
                                <Form.Input
                                    fluid
                                    icon='phone'
                                    iconPosition='left'
                                    type='number'
                                    placeholder="Số điện thoại"
                                    name='phone'
                                    value={phone}
                                    onChange={this.handleChange}
                                />
                                <Form.Input
                                    fluid
                                    icon='content'
                                    iconPosition='left'
                                    placeholder='Họ và tên'
                                    name='name'
                                    value={name}
                                    onChange={this.handleChange}
                                />
                                <Form.Select
                                    fluid
                                    placeholder='Chọn vai trò...'
                                    options={roleOptions}
                                    name='role'
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
                <Loader active={this.state.redirectLoading} />
            </div>
        )
    }
}

export default withRouter(RegisterScreen)
