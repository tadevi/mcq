import React from 'react'
import {anonymousCall} from "../../../../../utils/ApiUtils";
import {SERVER_FILES, SERVER_API} from "../../../../../config";
import {Image, Table} from "semantic-ui-react";
import _ from 'lodash'
import {withRouter} from 'react-router-dom'
import Moment from "react-moment";

class DisplayExamList extends React.Component {
    state = {
        exams: {}
    }

    componentDidMount() {
        this.getExamByContentId(1)
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

    render() {
        const exams = _.isEmpty(this.state.exams) ? [] : this.state.exams.examslectures
        if(exams.length===0){
            return <p style={{paddingLeft:'50px'}}>Chưa có dữ liệu</p>
        }
        return (
            <div>
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
                                               onClick={() => item.type === 'exam' ? history.push('/exam/view/' + item._id || '') : window.open(item.lectureUrl, '_blank')}>
                                        <Table.Cell>
                                            <div>
                                                <Image src={`${SERVER_FILES}/${item.type}.png`} verticalAlign={'middle'}/>
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
            </div>
        )
    }
}

export default withRouter(DisplayExamList)
