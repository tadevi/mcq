import React from "react";
import { Dimmer, Form, Grid, Loader, Select } from "semantic-ui-react";
import { planOptions, PLAN_TYPE } from "../../../constant/ServerConst";

function chunk(str, n) {
  const ret = [];
  let i;
  let len;

  for (i = 0, len = str.length; i < len; i += n) {
    ret.push(str.substr(i, n));
  }

  return ret;
}

class ExamEditor extends React.Component {
  constructor(props) {
    super(props);
    const {
      name = "",
      examUrl = "",
      answer = "",
      explainUrl = "",
      time = 0,
      note = "",
      password = "",
      plan = PLAN_TYPE.FREE,
    } = props.initData;
    this.state = {
      name,
      examUrl,
      answer,
      explainUrl,
      time,
      note,
      password,
      plan,
      error: "",
      success: "",
      loading: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.error !== prevProps.error) {
      this.setState({
        error: this.props.error,
      });
    }
    if (this.props.success !== prevProps.success) {
      this.setState({
        success: this.props.success,
      });
    }
    if (this.props.loading !== prevProps.loading) {
      this.setState({
        loading: this.props.loading,
      });
    }
    if (this.props.initData !== prevProps.initData) {
      const {
        name = "",
        examUrl = "",
        answer = "",
        explainUrl = "",
        time = 0,
        note = "",
        password = "",
      } = this.props.initData;
      this.setState({
        name,
        examUrl,
        answer,
        explainUrl,
        time,
        note,
        password,
      });
    }
  }

  handleChange(e, { name, value }) {
    let nameValue = "";
    if (name === "answer") {
      const str = chunk(value.toUpperCase().replace(/ /g, ""), 5).join(" ");
      nameValue = str;
    } else {
      nameValue = value;
    }
    this.setState(
      {
        name: nameValue,
      },
      () => {
        const { onChange } = this.props;
        if (typeof onChange === "function") {
          onChange(null, { name, value });
        }
      }
    );
  }

  getAnswerCount() {
    let count = 0;
    const str = this.state.answer;
    for (let i = 0; i < str.length; ++i)
      if (str[i] !== " ") {
        count++;
      }
    return count;
  }

  render() {
    return (
      <div>
        <Grid divided>
          <Grid.Row columns={1}>
            <Grid.Column width={12}>
              <Form.Input
                fluid
                label="Tên đề"
                name="name"
                value={this.state.name}
                onChange={this.handleChange}
              />
              <Form.Input
                fluid
                label="Link Đề"
                name="examUrl"
                value={this.state.examUrl}
                onChange={this.handleChange}
              />
              <Form.Input
                fluid
                label={`Đáp án: (${this.getAnswerCount()} câu)`}
                name="answer"
                value={this.state.answer}
                onChange={this.handleChange}
              />
              <Form.Input
                fluid
                label="Link giải thích"
                name="explainUrl"
                value={this.state.explainUrl}
                onChange={this.handleChange}
              />
              <Form.Input
                fluid
                label="Thời gian"
                type="number"
                name="time"
                value={this.state.time}
                onChange={this.handleChange}
              />
              <Form.Input
                fluid
                label="Ghi chú"
                name="note"
                value={this.state.note}
                onChange={this.handleChange}
              />
              <Form.Input
                fluid
                label="Mật khẩu (nếu có)"
                name="password"
                value={this.state.password}
                onChange={this.handleChange}
              />
              <label>Loại bài giảng</label>
              <Select
                options={planOptions}
                fluid
                defaultValue={this.state.plan}
                onChange={(e, { value }) =>
                  this.handleChange(null, { name: "plan", value })
                }
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Dimmer active={this.state.loading}>
          <Loader />
        </Dimmer>
      </div>
    );
  }
}

export default ExamEditor;
