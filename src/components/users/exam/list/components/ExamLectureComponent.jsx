import React from 'react'
import {Button, Form, Icon, Image, Loader, Message, Modal, Table} from "semantic-ui-react";
import {anonymousCall, userCallWithData} from "../../../../../utils/ApiUtils";
import {SERVER_API, SERVER_FILES} from "../../../../../config";
import Moment from "react-moment";
import {withRouter} from "react-router-dom";

class ExamLectureComponent extends React.Component {
    state = {
        examslectures: [],
        passwordModal: false,
        error: '',
        loading: false
    }

    setError(err) {
        this.setState({
            error: err
        })
    }

    setLoading(loading) {
        this.setState({
            loading
        })
    }

    componentDidMount() {
        const {lessonId} = this.props
        this.setLoading(true)
        anonymousCall(
            'GET',
            `${SERVER_API}/examslectures/lessons/${lessonId}`,
            data => {
                this.setState({
                    examslectures: data.examslectures
                })
            },
            err => this.setError(err),
            err => this.setError(err),
            () => this.setLoading(false)
        )
    }

    getLecture(id, password) {
        this.setLoading(true)
        userCallWithData(
            'POST',
            `${SERVER_API}/lectures/${id}`,
            {
                password: this.state.password
            },
            data => {
                window.open(data.lectureUrl, '_blank')
            },
            err => this.setError(err),
            err => this.setError(err),
            () => this.setLoading(false)
        )
    }

    onLectureClick(item) {
        const {history} = this.props
        if (item.type === 'exam') {
            history.push('/exam/view/' + item._id)
        } else {
            if (item.password) {
                this.setState({
                    passwordModal: true,
                    lectureId: item._id
                })
            } else {
                this.getLecture(item._id, undefined)
            }
        }
    }

    render() {
        const {examslectures} = this.state
        return (
            <div>
                <Table selectable>
                    {/*<Table.Header>*/}
                    {/*    <Table.Row>*/}
                    {/*        <Table.HeaderCell>Tên</Table.HeaderCell>*/}
                    {/*        <Table.HeaderCell>Loại</Table.HeaderCell>*/}
                    {/*        <Table.HeaderCell>Ngày cập nhật</Table.HeaderCell>*/}
                    {/*    </Table.Row>*/}
                    {/*</Table.Header>*/}
                    <Table.Body>
                        {
                            examslectures.length > 0 ? examslectures.map((item, index) => {
                                return (
                                    <Table.Row key={item._id} style={{cursor: 'pointer'}}
                                               onClick={() => this.onLectureClick(item)}>
                                        <Table.Cell>
                                            <div>
                                                <Image src={`${SERVER_FILES}/${item.type}.png`}
                                                       verticalAlign={'middle'}/>
                                                <span style={{fontSize: '12pt'}}>{item.name}</span>
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <span style={{fontSize: '12pt'}}>
                                            {item.type === 'exam' ? 'Đề thi' : 'Bài giảng'}
                                            </span>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <span style={{fontSize: '12pt'}}>
                                            <Moment format={'DD/MM/YY HH:mm'}>
                                                {item.datetime}
                                            </Moment>
                                            </span>
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            }) : <p>Không có dữ liệu.</p>
                        }
                    </Table.Body>
                </Table>
                <Loader active={this.state.loading}/>
                <Modal open={this.state.passwordModal} onClose={() => this.setState({passwordModal: false})}>
                    <Modal.Header>
                        Bài giảng yêu cầu mật khẩu
                    </Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Field>
                                <label>Nhập mật khẩu</label>
                                <Form.Input
                                    fluid
                                    value={this.state.password}
                                    onChange={(e, {value}) => this.setState({password: value})}
                                    type={'password'}
                                />
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='red' onClick={() => this.setState({passwordModal: false})}>
                            <Icon name='remove'/> Thoát
                        </Button>
                        <Button color='green' onClick={() => {
                            if (this.state.lectureId)
                                this.getLecture(this.state.lectureId, this.state.password)
                            this.setState({
                                passwordModal: false,
                                lectureId: null
                            })
                        }
                        }>
                            <Icon name='checkmark'/> Chấp nhận
                        </Button>
                    </Modal.Actions>
                </Modal>
                <Loader active={this.state.loading}/>
                <Message error
                         content={this.state.error}
                         hidden={this.state.error === ''}
                />
            </div>
        )
    }
}

export default withRouter(ExamLectureComponent)