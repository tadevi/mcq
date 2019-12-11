import React from 'react'
import {Button, Form, Grid, Header, Image, Message, Segment} from 'semantic-ui-react'

import {withRouter} from 'react-router-dom'
import validator from 'validator'
import {SERVER_API} from '../../../config'

import {anonymousCallWithData, getToken, setToken} from "../../../utils/ApiUtils";

class LoginScreen extends React.Component {
    _isMounted = false
    state = {
        email: '',
        password: '',
        formError: '',
        loading: false,
        user: null,
    }

    constructor(props) {
        super(props)
        this.onTextChange = this.onTextChange.bind(this)
        this.onLoginClick = this.onLoginClick.bind(this)
    }

    safeSetState(state) {
        if (this._isMounted)
            this.setState({
                ...state
            })
    }

    onTextChange(event, {name, value}) {
        this.safeSetState({
            [name]: value
        })
    }

    setError(err) {
        this.safeSetState({
            formError: err
        })
    }

    setLoading(loading) {
        this.safeSetState({
            loading
        })
    }

    onLoginClick() {
        const onLoginSuccess = ({user, token}) => {
            setToken(token)
            this.safeSetState({
                user
            })
        }
        const validateInput = () => {
            const {email, password} = this.state
            if (!validator.isEmail(email)) {
                this.safeSetState({
                    formError: 'Email không đúng!'
                })
                return false
            }
            this.safeSetState({
                formError: '',
                loading: true
            })
            return true
        }
        if (!validateInput()) {
            return
        }
        const {email, password} = this.state;
        this.setLoading(true)
        anonymousCallWithData(
            'POST',
            `${SERVER_API}/login`,
            {
                email,
                password
            },
            data => onLoginSuccess(data),
            err => this.setError(err),
            err => this.setError(err),
            () => this.setLoading(false)
        )
    }

    componentDidMount() {
        this._isMounted = true
        if (getToken()) {
            this.safeSetState({
                token: getToken()
            })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {history} = this.props
        const {token} = this.state
        if (token) {
            history.push('/')
        }
        const {user} = this.state
        if (prevState.user !== user) {
            if (user) {
                if (user.role === 'admin') {
                    history.push('/admin/')
                } else if (user.role === 'teacher') {
                    history.push('/admin/exams')
                } else {
                    history.push('/')
                }
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    render() {
        const {loading, formError, email, password} = this.state;
        return (
            <Grid textAlign='center' style={{height: '80vh'}} verticalAlign='middle'>
                <Grid.Column style={{maxWidth: 450}}>
                    <Header as='h2' color='teal' textAlign='center'>
                        <Image src='https://www.digicert.com/account/images/login-shield.png'/> Đăng nhập tài khoản
                    </Header>
                    <Form size='large' loading={loading} error={formError !== ''}>
                        <Segment stacked>
                            <Form.Input
                                required
                                fluid
                                icon='user'
                                iconPosition='left'
                                placeholder='Email'
                                name="email"
                                value={email}
                                onChange={this.onTextChange}
                            />
                            <Form.Input
                                required
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder='Mật khẩu'
                                name="password"
                                type='password'
                                value={password}
                                onChange={this.onTextChange}
                            />
                            <Message
                                error
                                attached
                                header='Error'
                                content={formError}
                                style={{marginBottom: '10px'}}
                            />
                            <Button primary fluid size='large' onClick={this.onLoginClick}>
                                Đăng nhập
                            </Button>
                            <div style={{marginTop: '10px'}}>
                                <a href="/forgot">Quên mật khẩu?</a>
                            </div>
                            <div style={{marginTop: '10px'}}>
                                <a href={"/register"}>Chưa có tài khoản, đăng ký ngay!</a>
                            </div>
                        </Segment>
                    </Form>
                </Grid.Column>
            </Grid>
        )

    }
}

export default withRouter(LoginScreen)
