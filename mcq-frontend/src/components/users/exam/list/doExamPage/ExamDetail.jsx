import React from 'react'
import {withRouter} from 'react-router-dom'
import {userCall, userCallWithData} from "../../../../../utils/ApiUtils";
import {SERVER_FILES, SERVER_API} from "../../../../../config";
import SimpleAppBar from "../SimpleAppBar";
import {Button, Form, Grid, Header, Image, List, Message, Segment, Table} from 'semantic-ui-react'
import Moment from "react-moment";
import _ from 'lodash'

class ExamDetail extends React.Component {
    state = {
        exam: {},
        answers: null,
        password: '',
        error: '',
        loading: false,
        examToDo: []
    }

    setError(error) {
        this.setState({
            error
        })
    }

    setLoading(loading) {
        this.setState({
            loading
        })
    }

    componentDidMount() {
        const id = this.props.match.params.id
        this.setLoading(true)
        if (id) {
            userCall(
                'GET',
                `${SERVER_API}/exam/${id}`,
                data => this.setState({exam: data}),
                err => this.setError(err),
                err => this.setError(err),
                () => {
                    this.setLoading(false)
                }
            )
        }
    }


    handleChange(e, {name, value}) {
        this.setState({
            [name]: value
        })
    }

    renderHeader(header, value, unit) {
        return (
            <div style={{fontSize: '12pt'}}>
                {`${header || ''}: `}
                <b style={{fontSize: '13pt'}}> {`${value || ''} ${unit || ''}`}</b>
            </div>
        )
    }

    renderScrollList() {
        return (
            <Table selectable basic={'very'}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>
                            STT
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                            Thời gian làm
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                            Điểm
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        (this.state.exam.answers || []).map((item, index) => {
                            const {history} = this.props
                            return (
                                <Table.Row style={{cursor: 'pointer'}} key={item._id}
                                           onClick={() => history.push('/result/' + item._id || '')}>
                                    <Table.Cell>
                                        {index + 1}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Moment format={'DD/MM/YY HH:mm '}>
                                            {item.start}
                                        </Moment>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {item.point}
                                    </Table.Cell>
                                </Table.Row>
                            )
                        })
                    }
                </Table.Body>
            </Table>
        )
    }

    onBeginTest() {
        this.setLoading(true)
        const {exam} = this.state
        userCallWithData(
            'POST',
            `${SERVER_API}/answers`,
            {
                examId: exam._id,
                password: exam.password ? this.state.password : undefined
            },
            data => {
                const {history} = this.props
                history.push({
                    pathname: '/exam/do/' + exam._id,
                    state: {
                        data
                    }
                })
            },
            err => this.setError(err),
            err => this.setError(err),
            () => this.setLoading(false)
        )
    }

    renderExamDetail() {
        if (!_.isEmpty(this.state.exam))
            return (
                <div>
                    <List>
                        <List.Item style={{marginTop: '10px'}}>
                            {this.renderHeader('Tên', this.state.exam.name)}
                        </List.Item>
                        <List.Item style={{marginTop: '10px'}}>
                            {this.renderHeader('Thời gian', this.state.exam.time, 'phút')}
                        </List.Item>
                        <List.Item style={{marginTop: '10px'}}>
                            {this.renderHeader('Tổng số câu hỏi', this.state.exam.total)}
                        </List.Item>
                        {
                            this.state.exam.password ?
                                (<List.Item style={{marginTop: '10px'}}>
                                                                        <span>{this.renderHeader('Mật khẩu')}
                                                                            <Form.Input
                                                                                type='password'
                                                                                name='password'
                                                                                style={{marginTop: '10px'}}
                                                                                value={this.state.password}
                                                                                onChange={this.handleChange.bind(this)}
                                                                            /></span>
                                    </List.Item>
                                ) :
                                (
                                    <div/>
                                )
                        }
                    </List>
                    <Button loading={this.state.loading} primary
                            style={{margin: '10px'}}
                            onClick={() => this.onBeginTest()}>
                        {this.state.exam.status === 'doing' ? 'Làm tiếp' : 'Bắt đầu làm'}
                    </Button>
                </div>
            )
        return <div/>
    }

    renderExamSummary() {

        return (
            <div>
                <SimpleAppBar/>
                <Grid centered columns={3}>
                    <Grid.Column width={2}>
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <Segment>
                            <Header textAlign={'center'}>Thông tin đề kiểm tra</Header>
                            <Grid centered columns={2}>
                                <Grid.Column width={4}>
                                    <Image
                                        src={`${SERVER_FILES}/exam_icon.png`}/>
                                </Grid.Column>
                                <Grid.Column width={12}>
                                    {
                                        <div>
                                            {this.renderExamDetail()}
                                            <Message
                                                error
                                                hidden={this.state.error === ''}
                                                content={this.state.error}
                                            />

                                        </div>
                                    }
                                </Grid.Column>
                            </Grid>
                        </Segment>
                        <Header>Lịch sử làm bài:</Header>
                        {!_.isEmpty(this.state.exam.answers) ? this.renderScrollList() : <p>Không có dữ liệu</p>}
                    </Grid.Column>
                    <Grid.Column width={2}>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }

    render() {
        return this.renderExamSummary()
    }
}

export default withRouter(ExamDetail)
