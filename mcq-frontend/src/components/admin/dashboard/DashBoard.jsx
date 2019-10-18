import React, {Component} from 'react'
import {Container, Dropdown, Grid, Icon, Image, Loader, Menu, Message, Segment} from 'semantic-ui-react'
import {Link, Redirect, Route, Switch, withRouter} from "react-router-dom";
import ExamPage from '../exam/ExamPage';
import {getToken, getUserInfo, removeToken} from "../../../utils/ApiUtils";
import LecturePage from "../lecture/LecturePage";
import FullScreenEditor from "../editor/FullScreenEditor";
import AccountManagement from "../account/AccountManagement";
import DashBoardMenu from "./DashBoardMenu";


const routeConfig = [
    {
        route: "/admin/",
        content: "Nội dung trang chủ",
        component: <FullScreenEditor/>,
        icon: "home",
        require: ['admin']
    },
    {
        route: "/admin/users",
        content: "Quản lý tài khoản",
        component: <AccountManagement/>,
        icon: "user",
        require: ['admin']
    },
    {
        route: "/admin/exams",
        content: "Đề thi",
        component: <ExamPage/>,
        icon: "list",
        require: ['admin', 'teacher']
    },
    {
        route: "/admin/lectures",
        content: "Bài giảng",
        component: <LecturePage/>,
        icon: "dochub",
        require: ['admin', 'teacher']
    }
]

const MyRouter = () => (
    <Switch>
        {
            routeConfig.slice().reverse().map((item, index) => {
                return (
                    <Route exact path={item.route} key={item.route}>
                        {item.component}
                    </Route>
                )
            })
        }
    </Switch>
)
const style = {
    backgroundColor: 'lightgrey'
}

const segmentStyle = {
    minHeight: '80vh',
    overflow: 'auto',
    margin: '10px'
}

class DashBoard extends Component {
    state = {
        navigateToHome: false,
        user: null
    }


    componentDidMount() {
        document.body.style.overflow = 'hidden'
        getUserInfo(
            data => this.setState({
                user: data
            }),
            err => {
                this.props.history.push('/login')
            },
            () => {
            }
        )
    }

    componentWillUnmount() {
        document.body.style.overflow = 'unset';
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {history} = this.props
        if (this.state.navigateToHome !== prevState.navigateToHome) {
            history.push('/')
        }
    }

    render() {
        const {pathname} = this.props.location
        const {user} = this.state
        const token = getToken()
        if (!token) {
            return <Redirect to='/login'/>
        }
        if (!user) {
            return (
                <Loader size='large' active/>
            )
        }
        if (user.role === 'user') {
            return (
                <Message
                    error
                    size='massive'
                    content="Người dùng không có quyền truy cập nội dung này!"
                />
            )
        }
        return (
            <div style={{overflow: 'hidden'}}>
                <DashBoardMenu header={routeConfig.filter(item=>pathname===item.route)[0].content}/>
                <Container fluid>
                    <Grid stackable columns={2} className="fill-content">
                        <Grid.Row stretched>
                            <Grid.Column width={3}>
                                <Menu vertical fluid>
                                    {
                                        routeConfig.filter(it => it.require.findIndex(i => i === user.role) > -1).map((item, index) => {
                                            return (
                                                <Link to={item.route} key={item.route}>
                                                    <Menu.Item style={pathname === item.route ? style : null}>
                                                        <div>
                                                            <Icon name={item.icon}/> {item.content}
                                                        </div>
                                                    </Menu.Item>
                                                </Link>
                                            )
                                        })
                                    }
                                </Menu>
                            </Grid.Column>
                            <Grid.Column width={13}>
                                <Segment style={segmentStyle}>
                                    <MyRouter/>
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </div>
        )
    }
}


export default withRouter(DashBoard)
