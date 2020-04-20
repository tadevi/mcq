import React from 'react'
import { Button, Dropdown, Header, Image, Menu } from 'semantic-ui-react'
import { Link, withRouter } from 'react-router-dom'
import { getToken, getUserInfo, removeToken, setToken } from "../../../../utils/ApiUtils";
import { APP_NAME, SERVER_FILES } from "../../../../config";
import './exam.css'
import Plan from '../../../admin/components/Plan';
import { PLAN_LABEL } from '../../../constant/ServerConst';


/** This file has been checked!
 *
 */
class SimpleAppBar extends React.Component {
    _isMounted = false

    constructor(props) {
        super(props)
        this.state = {
            user: null,
            navigate: '',
            subjectId: ''
        }
    }

    safeSetState(state) {
        if (this._isMounted)
            this.setState({
                ...state
            })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.navigate !== this.state.navigate) {
            this.props.history.push(this.state.navigate)
        }
        if (prevState.subjectId !== this.state.subjectId) {
            this.props.history.push({
                pathname: '/exam',
                state: {
                    subjectId: this.state.subjectId
                }
            })
        }
    }

    navigateTo(link) {
        this.safeSetState({
            navigate: link
        })
    }

    logoutClick() {
        removeToken()
        this.navigateTo('/')
    }

    componentDidMount() {
        this._isMounted = true
        getUserInfo(
            data => this.onLoadUserInfo(data),
            err => {
                this.props.history.push('/')
            },
            () => {
            }
        )
    }

    onLoadUserInfo(user, token) {
        this.safeSetState({
            user
        })
        setToken(token)
    }

    navigateToDashboard(role) {
        if (role === 'admin') {
            return '/admin/'
        }
        else if (role === 'teacher' || role === 'parent') {
            return '/admin/users';
        }
        return '/'
    }
    renderUserName() {
        const { user } = this.state;
        if (user) {
          return (
            <div>
              <Plan plan={user[PLAN_LABEL]} />
              {user.name ? user.name : ""}
            </div>
          );
        }
      }
    renderButtonGroup() {
        const token = getToken()
        const { user } = this.state
        if (token) {
            return (
                <Dropdown text={this.renderUserName()} pointing className='link item' style={{fontSize:'13pt'}}>
                    <Dropdown.Menu>
                        <Dropdown.Item as={'a'} onClick={() => this.navigateTo('/profile')}
                            icon='user'
                            text="Tài khoản" />
                        {
                            this.state.user && this.state.user.role !== 'parent' ?
                                <Dropdown.Item as={'a'} onClick={() => this.navigateTo('/history')}
                                    icon='history'
                                    text="Lịch sử làm bài" /> : null
                        }
                        {
                            this.state.user && this.state.user.role !== 'user' ?
                                <Dropdown.Item as={'a'} onClick={() => this.navigateTo(this.navigateToDashboard(this.state.user.role))} icon='dashboard'
                                    text={this.state.user.role === 'parent' ? 'Theo dõi học tập' : "Quản trị"} /> : null
                        }
                        <Dropdown.Item onClick={() => this.logoutClick()} icon='log out' text="Đăng xuất" />
                    </Dropdown.Menu>
                </Dropdown>
            )
        } else {
            return (
                <div>
                    <Button
                        as={'a'}
                        onClick={() => this.navigateTo('/login')}
                        color='orange'
                        style={{ marginRight: '5px' }}>
                        Đăng nhập
                    </Button>
                    <Button
                        as={'a'}
                        onClick={() => this.navigateTo('/register')}
                        color='grey'>
                        Đăng ký
                    </Button>
                </div>
            )
        }
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    render() {
        const { fixed, header } = this.props
        return (
            <Menu color='blue' fixed={fixed ? 'top' : undefined} inverted borderless size={'mini'} stackable>
                <Menu.Item position='left' style={{ paddingRight: '50px' }} header as={Link} to={'/'}>
                    <Image size='mini' src={`${SERVER_FILES}/logo.png`} style={{ marginRight: '1.5em' }} />
                    <span style={{ fontSize: '12pt' }}>{APP_NAME}</span>
                </Menu.Item>
                <b className='vertical-center'>
                    {header || ''}
                </b>
                <Menu.Menu position='right'>
                    <Menu.Item style={{ fontSize: '10pt', fontWeight: '500' }}>
                        {this.renderButtonGroup()}
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
        )
    }
}

export default withRouter(SimpleAppBar)
