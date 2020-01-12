import React from 'react'
import {Table} from "semantic-ui-react";
import {anonymousCall} from "../../../../../utils/ApiUtils";
import {SERVER_API} from "../../../../../config";

export default class ExamLectureComponent extends React.Component {
    state = {
        examslectures: []
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

    render() {
        const {examslectures} = this.state
        if (examslectures.length === 0) {
            return (
                <p className={'no-content-display '}>
                    Chưa có dữ liệu.
                </p>
            )
        }
        return (
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Tên</Table.HeaderCell>
                        <Table.HeaderCell>Loại</Table.HeaderCell>
                        <Table.HeaderCell>Ngày cập nhật</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        examslectures.map((item, index) => {
                            return (
                                <Table.Row key={item._id}>
                                    <Table.Cell>{item.name}</Table.Cell>
                                    <Table.Cell>{item.type}</Table.Cell>
                                    <Table.Cell>{item.datetime}</Table.Cell>
                                </Table.Row>
                            )
                        })
                    }
                </Table.Body>
            </Table>
        )
    }
}