import React from "react";
import {
  Button,
  Confirm,
  Container,
  Embed,
  Grid,
  Image,
  Loader,
  Menu,
  Popup,
} from "semantic-ui-react";
import "../../../../../App.css";
import moment from "moment";

import _ from "lodash";
import { withRouter } from "react-router-dom";
import { CircleButton } from "../../CircleButton";
import { transformUrl, userCallWithData } from "../../../../../utils/ApiUtils";
import { APP_NAME, SERVER_API, SERVER_FILES } from "../../../../../config";
import ExamResult from "../components/ExamResult";

const RenderAnswerBoard = ({
  questionPerRows,
  totalQuestion,
  onChange,
  initValue,
}) => {
  const arr = [];
  let currentQuestion = 1;
  let remainQuestion = totalQuestion;
  for (let i = 0; i < totalQuestion / questionPerRows; ++i) {
    const brr = [];
    for (let j = 0; j < questionPerRows && remainQuestion > 0; ++j) {
      brr.push(currentQuestion++);
      remainQuestion--;
    }
    arr.push(brr);
  }
  if (arr[arr.length - 1].length < questionPerRows) {
    const remain = questionPerRows - arr[arr.length - 1].length;
    for (let i = 0; i < remain; ++i) arr[arr.length - 1].push(-1);
  }
  return (
    <Grid centered>
      {arr.map((it, rowIndex) => {
        return (
          <Grid.Row key={"row" + rowIndex}>
            {it.map((item, colIndex) => {
              return (
                <Grid.Column
                  key={"col" + colIndex}
                  style={{ marginRight: "10px" }}
                >
                  {item === -1 ? (
                    <div />
                  ) : (
                    <CircleButton
                      text={item}
                      onChange={onChange.bind(
                        this,
                        rowIndex * questionPerRows + colIndex
                      )}
                      defaultValue={
                        initValue[rowIndex * questionPerRows + colIndex]
                      }
                    />
                  )}
                </Grid.Column>
              );
            })}
          </Grid.Row>
        );
      })}
    </Grid>
  );
};

const batchAnswerSend = 5;

class DisplayTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      remain: 0,
      loading: false,
      openResult: false,
      confirmModal: false,
      width: 0,
      height: 0,
      questionCount: 0,
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  setLoading(loading) {
    this.setState({
      loading,
    });
  }

  putAnswers(status) {
    if (status)
      this.setState({
        loading: true,
        openResult: true,
      });
    const { answer, answers } = this.state;
    userCallWithData(
      "PUT",
      `${SERVER_API}/answers/${answer._id}`,
      {
        answer: answers.join(""),
        status,
      },
      (data) => {
        if (!_.isEmpty(data)) {
          this.setState({
            result: data,
          });
        }
      },
      (err) => {
        this.setState({
          error: err,
        });
      },
      (err) => {
        this.setState({
          error: err,
        });
      },
      () => {
        if (status) this.setLoading(false);
      }
    );
  }

  getAnswerCount() {
    let count = 0;
    for (let i = 0; i < this.state.exam.total; ++i) {
      if (this.state.answers[i] !== " ") count++;
    }
    return count;
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
    this.props.history.replace();
    const id = this.props.match.params.id;
    const state = this.props.location.state;
    if (id && state) {
      const {
        data: { answer, exam },
      } = state;
      this.setState({
        remain: answer.remain,
        answers:
          answer.answer === ""
            ? new Array(exam.total).fill(" ")
            : answer.answer.split(""),
        exam,
        answer,
      });
      this.timer = setInterval(() => {
        if (this.state.remain > 0)
          this.setState({
            remain: this.state.remain - 1,
          });
        else {
          clearInterval(this.timer);
          this.putAnswers("done");
        }
      }, 1000);
    } else {
      this.props.history.push("/exam/view/" + id);
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  handleAnswerChange(index, answer) {
    const arr = [...this.state.answers];
    arr[index] = answer;

    this.setState(
      {
        answers: arr,
        questionCount: this.state.questionCount + 1,
      },
      () => {
        if (this.state.questionCount === batchAnswerSend) {
          this.putAnswers();
          this.setState({
            questionCount: 0,
          });
        }
      }
    );
  }

  getQuestionPerRow() {
    if (!this.state.width) {
      return 5;
    }
    const expectedRows = this.state.width / 4 / 46;
    if (expectedRows > 5.5) return 5;
    if (expectedRows > 3.5) return 4;
    return 2;
  }

  render() {
    const { exam } = this.state;
    const { remain, loading, answers } = this.state;
    if (_.isEmpty(exam)) {
      return <Loader active />;
    }
    return (
      <div style={{marginTop:'5em'}}>
        <Menu color={"blue"} fixed="top" inverted size={"mini"}  >
          <Menu.Menu position="left">
            <Menu.Item header as="a" style={{ paddingRight: "50px" }} href="/">
              <Image
                size="mini"
                src={`${SERVER_FILES}/logo.png`}
                style={{ marginRight: "1.5em" }}
              />
              <span style={{ fontSize: "12pt" }}>{APP_NAME}</span>
            </Menu.Item>
          </Menu.Menu>

          <Menu.Menu position='right'>
            <Menu.Item>
              <Image src={`${SERVER_FILES}/clock.png`} />
              <p style={{ padding: "5px", fontSize: "12pt" }}>
                {moment().startOf("day").seconds(remain).format("H:mm:ss")}
              </p>
            </Menu.Item>
          </Menu.Menu>

          <Menu.Menu position="right">
            <Menu.Item>
              <Button
                loading={loading}
                color="orange"
                onClick={() => this.setState({ confirmModal: true })}
                style={{ marginRight: "5px" }}
                disabled={this.getAnswerCount() !== exam.total}
              >
                NỘP BÀI
              </Button>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
        <Container>
          <Grid centered>
            <Grid.Row>
              <b style={{ fontSize: "12pt" }}>
                Trả lời tất cả câu hỏi để nộp bài.
              </b>
            </Grid.Row>
            <Grid.Row columns={2}>
              <Grid.Column width={12}>
                <Embed
                  url={transformUrl(exam.examUrl)}
                  active
                  style={{
                    minHeight: "80vh",
                    width: "100%",
                  }}
                />
              </Grid.Column>
              <Grid.Column width={4}>
                <RenderAnswerBoard
                  initValue={answers}
                  totalQuestion={exam.total}
                  questionPerRows={this.getQuestionPerRow()}
                  onChange={this.handleAnswerChange.bind(this)}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
        <Confirm
          open={this.state.confirmModal}
          content={"Bạn có muốn nộp bài?"}
          onCancel={() => this.setState({ confirmModal: false })}
          onConfirm={() => this.putAnswers("done")}
        />
        <ExamResult
          loading={this.state.loading}
          isOpen={this.state.openResult}
          result={this.state.result}
          error={this.state.error}
          onClose={() => this.props.history.goBack()}
        />
      </div>
    );
  }
}

export default withRouter(DisplayTest);
