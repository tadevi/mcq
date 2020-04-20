import React from "react";
import { Button, Dropdown, Image, Menu } from "semantic-ui-react";
import {
  anonymousCall,
  getToken,
  getUserInfo,
  removeToken,
  setToken,
} from "../../utils/ApiUtils";
import { APP_NAME, SERVER_API, SERVER_FILES } from "../../config";
import { Log } from "../../utils/LogUtil";
import { withRouter } from "react-router-dom";
import "./home.css";
import Plan from "../admin/components/Plan";
import { PLAN_LABEL } from "../constant/ServerConst";
class AppBar extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      navigate: "/",
      menu: [],
      subjectId: "",
    };
  }

  safeSetState(state) {
    if (this._isMounted)
      this.setState({
        ...state,
      });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { navigate, subjectId, subjectName } = this.state;
    const { history } = this.props;
    if (prevState.navigate !== navigate) {
      history.push(navigate);
    }
    if (prevState.subjectId !== subjectId) {
      history.push({
        pathname: "/exam",
        state: {
          subjectName: subjectName,
          subjectId: subjectId,
        },
      });
    }
  }

  navigateTo(link) {
    this.safeSetState({
      navigate: link,
    });
  }

  logoutClick() {
    removeToken();
    this.navigateTo("/");
  }

  componentDidMount() {
    this._isMounted = true;
    getUserInfo(
      (data) => this.onLoadUserInfo(data),
      (err) => Log(err),
      () => {}
    );
    this.getMenu();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onLoadUserInfo(user, token) {
    this.safeSetState({
      user,
    });
    setToken(token);
  }

  navigateToDashboard(role) {
    if (role === "admin") {
      return "/admin/";
    } else if (role === "teacher" || role === "parent" || role === "dean") {
      return "/admin/users";
    }
    return "/";
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
    const token = getToken();
    if (token) {
      return (
        <Dropdown
          text={this.renderUserName()}
          pointing
          className="link item"
          style={{ fontSize: "13pt" }}
        >
          <Dropdown.Menu>
            <Dropdown.Item
              as={"a"}
              onClick={() => this.navigateTo("/profile")}
              icon="user"
              text="Tài khoản"
            />
            {this.state.user && this.state.user.role !== "parent" ? (
              <Dropdown.Item
                as={"a"}
                onClick={() => this.navigateTo("/history")}
                icon="history"
                text="Lịch sử làm bài"
              />
            ) : null}
            {this.state.user && this.state.user.role !== "user" ? (
              <Dropdown.Item
                as={"a"}
                onClick={() =>
                  this.navigateTo(
                    this.navigateToDashboard(this.state.user.role)
                  )
                }
                icon="dashboard"
                text={
                  this.state.user.role === "parent"
                    ? "Theo dõi học tập"
                    : "Quản trị"
                }
              />
            ) : null}
            <Dropdown.Item
              onClick={() => this.logoutClick()}
              icon="log out"
              text="Đăng xuất"
            />
          </Dropdown.Menu>
        </Dropdown>
      );
    } else {
      return (
        <div>
          <Button
            as={"a"}
            onClick={() => this.navigateTo("/login")}
            color="orange"
            style={{ marginRight: "5px" }}
          >
            Đăng nhập
          </Button>
          <Button
            as={"a"}
            onClick={() => this.navigateTo("/register")}
            color="grey"
          >
            Đăng ký
          </Button>
        </div>
      );
    }
  }

  getMenu() {
    anonymousCall(
      "GET",
      `${SERVER_API}/classes/subjects`,
      (data) =>
        this.safeSetState({
          menu: data.sort((it1, it2) => {
            const op1 = parseInt(it1.className.replace(/^\D+/g, "") || 0);
            const op2 = parseInt(it2.className.replace(/^\D+/g, "") || 0);
            if (op1 < op2) return -1;
            if (op1 > op2) return 1;
            return 0;
          }),
        }),
      (err) => Log(err),
      (err) => Log(err),
      () => {}
    );
  }

  render() {
    return (
      <Menu color={"blue"} fixed="top" inverted size={"mini"} >
        <Menu.Menu position="left">
          <Menu.Item header as="a" style={{ paddingRight: "50px" }}>
            <Image
              size="mini"
              src={`${SERVER_FILES}/logo.png`}
              style={{ marginRight: "1.5em" }}
            />
            <span style={{ fontSize: "12pt" }}>{APP_NAME}</span>
          </Menu.Item>
        </Menu.Menu>
        {this.state.menu.map((item) => {
          return (
            <Dropdown
              key={item.className}
              text={item.className}
              pointing
              className={"item"}
            >
              <Dropdown.Menu>
                {item.subjects.map((subject) => {
                  return (
                    <Dropdown.Item
                      key={subject._id}
                      onClick={() =>
                        this.props.history.push("/subject/" + subject._id)
                      }
                    >
                      {subject.name}
                    </Dropdown.Item>
                  );
                })}
              </Dropdown.Menu>
            </Dropdown>
          );
        })}
        <Menu.Menu position="right">
          <Menu.Item
            style={{
              fontSize: "10pt",
              fontWeight: "500",
            }}
          >
            {this.renderButtonGroup()}
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}

export default withRouter(AppBar);
