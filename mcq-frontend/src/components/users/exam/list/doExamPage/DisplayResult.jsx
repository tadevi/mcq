import React from 'react'
import {Embed, Grid, Header, Loader, Message, Table} from "semantic-ui-react";
import {transformUrl, userCall} from "../../../../../utils/ApiUtils";
import SimpleAppBar from "../SimpleAppBar";
import _ from 'lodash'
import {SERVER_API} from "../../../../../config";
import {withRouter} from "react-router-dom";

const _length = 20

function TableAnswer({answer, correctAnswer, offset}) {
    return (
        <Table celled collapsing={true}>
            <Table.Body>
                <Table.Row>
                    <Table.Cell>
                        STT
                    </Table.Cell>
                    {
                        _.range(answer.length).map(item => {
                            return (
                                <Table.Cell key={'stt' + item}>
                                    {`${item + offset + 1}`.padStart(3, '0')}
                                </Table.Cell>
                            )
                        })
                    }
                </Table.Row>
                <Table.Row>
                    <Table.Cell>
                        Trả lời
                    </Table.Cell>
                    {
                        _.range(answer.length).map(item => {
                            return (
                                <Table.Cell key={'answer' + item}
                                            style={{color: answer[item] !== correctAnswer[item] ? 'red' : 'black'}}
                                >
                                    {answer[item]}
                                </Table.Cell>
                            )
                        })
                    }
                </Table.Row>
                <Table.Row>
                    <Table.Cell>
                        Đáp án
                    </Table.Cell>
                    {
                        _.range(answer.length).map(item => {
                            return (
                                <Table.Cell key={'correctAnswer' + item}>
                                    {correctAnswer[item]}
                                </Table.Cell>
                            )
                        })
                    }
                </Table.Row>
            </Table.Body>
        </Table>

    )
}

class DisplayResult extends React.Component {
    state = {
        data: {},
        error: ''
    }

    componentDidMount() {
        const id = this.props.match.params.id
        userCall(
            'GET',
            `${SERVER_API}/answer/${id}`,
            data => {
                this.setState({
                    data
                })
            },
            err => this.setState({
                error: err
            }),
            err => this.setState({
                error: err
            }),
            () => {
            }
        )
    }

    render() {
        const {data, error} = this.state
        if (error) {
            return (
                <div>
                    <SimpleAppBar header={'Kết quả bài làm'}/>
                    <Message
                        error
                        content={this.state.error}
                    />
                </div>
            )
        }
        if (_.isEmpty(data)) {
            return <Loader active/>
        }
        let {answer, point, correct, exam: {answer: correctAnswer, note, _id, name, explainUrl, total}} = data
        answer = answer.padEnd(correctAnswer.length)
        return (
            <div>
                <SimpleAppBar header={'Kết quả bài làm'}/>

                <Grid style={{marginBottom: '20px'}} centered>
                    <Grid.Row>
                        <Grid.Column width={12}>
                            <Header>Kết quả làm bài <a
                                href={`/exam/view/${_id}`}>{name}</a></Header>
                            <div>
                                {
                                    _.range(Math.ceil(answer.length / _length)).map(item => {
                                        return (
                                            <TableAnswer offset={item * _length} key={item}
                                                         answer={answer.substr(_length * item, _length)}
                                                         correctAnswer={correctAnswer.substr(_length * item, _length)}/>)
                                    })
                                }
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={12}>
                            <Grid centered columns={2}>
                                <Grid.Row>
                                    <Grid.Column>
                                        Tổng số câu đúng:
                                    </Grid.Column>
                                    <Grid.Column>
                                        {`${correct}/${total}`}
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        Tổng điểm:
                                    </Grid.Column>
                                    <Grid.Column>
                                        {`${point}`}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={12}>
                            <Header content={'Đáp án chi tiết'}/>
                            <Embed
                                url={transformUrl(explainUrl)}
                                active
                                aspectRatio={'4:3'}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={12}>
                            <Header content={'Ghi chú'}/>
                            {note}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        )
    }
}

export default withRouter(DisplayResult)
