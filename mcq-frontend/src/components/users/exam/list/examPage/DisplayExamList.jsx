import React from 'react'
import {anonymousCall, anonymousCallWithData, userCallWithData} from "../../../../../utils/ApiUtils";
import {SERVER_FILES, SERVER_API} from "../../../../../config";
import {Button, Form, Icon, Image, Loader, Message, Modal, Table} from "semantic-ui-react";
import _ from 'lodash'
import {withRouter} from 'react-router-dom'
import Moment from "react-moment";

class DisplayExamList extends React.Component {
    state = {
        exams: {},
        passwordModal: false,
        password: '',
        lectureId: null,
        error: '',
        loading: false
    }

    componentDidMount() {
        this.getExamByContentId(1)
    }

    setError(error) {
        clearTimeout(this.timeout)
        this.setState({
            error
        })
        this.timeout = setTimeout(() => this.setState({
            error: ''
        }), 3000)
    }


    setLoading(loading) {
        this.setState({
            loading
        })
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

    getExamByContentId() {
        this.setLoading(true)
        const id = this.props.contentId
        anonymousCall(
            'GET',
            `${SERVER_API}/examslectures/contents/${id}`,
            data => {
                this.setState({
                    exams: data
                })
                const {onHeaderChange} = this.props
                if (typeof onHeaderChange === 'function') {
                    onHeaderChange({
                        className: data.className,
                        subjectName: data.subjectName
                    })
                }
            },
            err => this.setError(err),
            err => this.setState(err),
            () => this.setLoading(false)
        )
    }
    componentWillUnmount() {
        clearTimeout(this.timeout)
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
        const exams = _.isEmpty(this.state.exams) ? [] : this.state.exams.examslectures
        if (exams.length === 0) {
            return <p style={{paddingLeft: '50px'}}>Chưa có dữ liệu</p>
        }
        return (
            <div>
                <Loader active={this.state.loading}/>
                <Table basic='very' selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.Cell>
                                <b style={{fontSize: '12pt'}}>Tên</b>
                            </Table.Cell>
                            <Table.Cell>
                                <b style={{fontSize: '12pt'}}>Loại</b>
                            </Table.Cell>
                            <Table.Cell>
                                <b style={{fontSize: '12pt'}}>Ngày cập nhật</b>
                            </Table.Cell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {
                            exams.map(item => {
                                const {history} = this.props
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
                            })
                        }
                    </Table.Body>
                </Table>
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
                <Message error
                         content={this.state.error}
                         hidden={this.state.error === ''}
                />
            </div>
        )
    }
}

export default withRouter(DisplayExamList)
