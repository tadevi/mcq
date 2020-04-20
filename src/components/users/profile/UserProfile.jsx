import React, { Component } from "react";
import {
  Button,
  Checkbox,
  Form,
  Grid,
  Image,
  Loader,
  Message,
  Segment,
} from "semantic-ui-react";
import { SERVER_FILES, SERVER_API } from "../../../config";
import { withRouter } from "react-router-dom";
import {
  getToken,
  getUserInfo,
  userCallWithData,
  getRole,
} from "../../../utils/ApiUtils";
import SimpleAppBar from "../exam/list/SimpleAppBar";
import Plan from "../../admin/components/Plan";
import { PLAN_TYPE } from "../../constant/ServerConst";

const bodyStyle = {
  width: "80%",
  display: "block",
  margin: "10px auto",
};

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      passwordEditMode: false,
      name: "",
      email: "",
      phone: "",
      password: "",
      rePassword: "",
      loading: false,
      error: "",
      success: false,
      plan: PLAN_TYPE.FREE,
    };
  }

  handleChange(e, { name, value }) {
    this.setState({
      [name]: value,
    });
  }

  setError(error) {
    this.setState({
      error,
    });
  }

  setLoading(loading) {
    this.setState({
      loading,
    });
  }

  updateUserInfo() {
    const { name, email, phone, password } = this.state;
    this.setLoading(true);
    userCallWithData(
      "PUT",
      `${SERVER_API}/users`,
      {
        name,
        email,
        phone,
        password: password || undefined,
      },
      (data) =>
        this.setState({
          success: true,
        }),
      (err) => this.setError(err),
      (err) => this.setError(err),
      () => this.setLoading(false)
    );
  }

  onSubmit() {
    const { password, rePassword } = this.state;
    if (password !== rePassword) {
      this.setState({
        error: "Mật khẩu không khớp!",
      });
      return;
    }
    this.updateUserInfo();
  }

  componentDidMount() {
    this.setLoading(true);
    getUserInfo(
      (data) =>
        this.setState({
          ...data,
        }),
      (err) => {
        this.props.history.push("/login");
      },
      () => this.setLoading(false)
    );
  }

  render() {
    const token = getToken();

    const {
      _id: userId,
      role,
      loading,
      error,
      success,
      email,
      name,
      phone,
      passwordEditMode,
      password,
      rePassword,
      plan,
    } = this.state;

    if (token) {
      if (!userId) {
        return (
          <div>
            <SimpleAppBar header={"Thông tin cá nhân"} />
            <Loader size="massive" active={loading}>
              Loading
            </Loader>
          </div>
        );
      }
      return (
        <div>
          <SimpleAppBar header={"Thông tin cá nhân"} />
          <div style={bodyStyle}>
            <Grid centered>
              <Grid.Column width={4}>
                <Segment>
                  <Image centered src={`${SERVER_FILES}/profile.png`} />
                  <div style={{ textAlign: "center" }}>
                    <p>
                      <b>{"Vai trò: "}</b>
                      {getRole(role)}
                    </p>
                    <p>
                      <b style={{marginRight:'10px'}}>{"Loại tài khoản:"}</b>
                      <Plan plan={this.state.plan} />
                    </p>
                  </div>
                </Segment>
              </Grid.Column>
              <Grid.Column width={12}>
                <Form error={error !== ""} loading={loading} success={success}>
                  <Form.Input
                    label="Email"
                    name="email"
                    readOnly
                    value={email}
                  />
                  <Form.Input
                    label="Tên"
                    name="name"
                    value={name}
                    onChange={this.handleChange}
                  />
                  <Form.Input
                    label="Số điện thoại"
                    name="phone"
                    type={"number"}
                    value={phone}
                    onChange={this.handleChange}
                  />
                  <Checkbox
                    toggle
                    label="Đổi mật khẩu"
                    checked={passwordEditMode}
                    onChange={(e, data) =>
                      this.setState({ passwordEditMode: data.checked })
                    }
                  />
                  <Form.Input
                    disabled={!passwordEditMode}
                    style={{ marginTop: "10px" }}
                    label="Mật khẩu mới"
                    name="password"
                    type="password"
                    value={password}
                    onChange={this.handleChange}
                  />
                  <Form.Input
                    disabled={!passwordEditMode}
                    label="Nhập lại mật khẩu"
                    name="rePassword"
                    type="password"
                    value={rePassword}
                    onChange={this.handleChange}
                  />
                  <Message error header="Error" content={error} />
                  <Message
                    success
                    header="Successfully"
                    content="Thay đổi thông tin cá nhân thành công"
                  />
                  <Button primary type="submit" onClick={this.onSubmit}>
                    Cập nhật
                  </Button>
                </Form>
              </Grid.Column>
            </Grid>
          </div>
        </div>
      );
    }
    return (
      <div>
        <SimpleAppBar header={"Thông tin cá nhân"} />
        <Message
          error
          size="massive"
          content="Đăng nhập để xem thông tin cá nhân!"
        />
      </div>
    );
  }
}

export default withRouter(UserProfile);
