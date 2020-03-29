import React from 'react'
import {Grid, Loader, Message, Table} from "semantic-ui-react";
import {userCall} from "../../../utils/ApiUtils";
import {SERVER_API} from "../../../config";
import {withRouter} from 'react-router-dom'
import Moment from "react-moment";
import SimpleAppBar from "../exam/list/SimpleAppBar";
import _ from 'lodash'

class ExamDid extends React.Component {
    state = {
        data: [],
        loading: false,
        error: ''
    }

    componentDidMount() {
        this.setState({
            loading: true
        })
        userCall(
            'GET',
            `${SERVER_API}/exams?status=done`,
            data => {
                this.setState({
                    data
                })
            },
            err => this.setState({error: err}),
            err => this.setState({error: err}),
            () => {
                this.setState({
                    loading: false
                })
            }
        )
    }

    renderTable() {
        const {data, loading} = this.state
        const {history} = this.props
        return (
            <div>
                <Table selectable basic={'very'} style={{paddingTop: '50px'}}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Lớp</Table.HeaderCell>
                            <Table.HeaderCell>Môn học</Table.HeaderCell>
                            <Table.HeaderCell>Chương</Table.HeaderCell>
                            <Table.HeaderCell>Bài</Table.HeaderCell>
                            <Table.HeaderCell>Tên đề</Table.HeaderCell>
                            <Table.HeaderCell>Ngày làm</Table.HeaderCell>
                            <Table.HeaderCell>Điểm cao nhất</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {
                            data.map(item => {
                                return (
                                    <Table.Row key={item._id} style={{cursor: 'pointer'}}
                                               onClick={() => history.push('/exam/view/' + item.examId || '')}>
                                        <Table.Cell>{item.className}</Table.Cell>
                                        <Table.Cell>{item.subjectName}</Table.Cell>
                                        <Table.Cell>{item.contentName}</Table.Cell>
                                        <Table.Cell>{item.lessonName}</Table.Cell>
                                        <Table.Cell>{item.examName}</Table.Cell>
                                        <Table.Cell>
                                            <Moment format={'DD/MM/YY HH:mm'}>
                                                {item.start}
                                            </Moment>
                                        </Table.Cell>
                                        <Table.Cell>{item.point}</Table.Cell>
                                    </Table.Row>
                                )
                            })
                        }
                    </Table.Body>
                </Table>
                {
                    _.isEmpty(data) && !this.state.loading ? (
                        <div style={{textAlign: 'center'}}>
                            Không có dữ liệu
                        </div>
                    ) : <div/>
                }
                <Loader active={loading}/>
            </div>
        )
    }

    render() {
        const {error} = this.state
        return (
            <div>
                <SimpleAppBar header={'Lịch sử làm bài'}/>
                <Grid centered>
                    <Grid.Column width={2}/>
                    <Grid.Column width={12}>
                        {this.renderTable()}
                        <Message
                            error
                            hidden={error === ''}
                            content={error}
                        />
                    </Grid.Column>
                    <Grid.Column width={2}/>
                </Grid>

            </div>
        )
    }
}

export default withRouter(ExamDid)
