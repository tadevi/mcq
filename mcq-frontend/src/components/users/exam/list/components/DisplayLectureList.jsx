import React from 'react'
import {anonymousCall, isTrue} from "../../../../../utils/ApiUtils";
import {NUM_PAGE, SERVER_API} from "../../../../../config";
import {Pagination, Table} from "semantic-ui-react";
import _ from 'lodash'
import Moment from "react-moment";
import {Link} from "react-router-dom";

export default class DisplayLectureList extends React.Component {
    state = {
        lectures: {}
    }

    componentDidMount() {
        this.getLectureByContentId(1)
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

    getLectureByContentId(page) {
        this.setLoading(true)
        const id = this.props.contentId
        anonymousCall(
            'GET',
            `${SERVER_API}/lectures/contents/${id}?page=${page}`,
            data => {
                this.setState({
                    exams: data
                })
            },
            err => this.setError(err),
            err => this.setState(err),
            () => this.setLoading(false)
        )
    }

    render() {
        const lectures = _.isEmpty(this.state.lectures) ? [] : this.state.lectures.data
        return (
            <div>
                <Table striped>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>
                                Tên bài giảng
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                Link bài giảng
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                Ngày tạo
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    {
                        lectures.map(item => {
                            return (
                                <Table.Row key={item._id}>
                                    <Table.Cell>
                                        {item.name}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {item.lectureUrl}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Moment format="DD/MM/YYYY HH:mm">
                                            {item.datetime}
                                        </Moment>
                                    </Table.Cell>
                                </Table.Row>
                            )
                        })
                    }
                </Table>
                {
                    this.state.lectures.totalPage > 1 ? (
                        <Pagination
                            pointing
                            secondary
                            boundaryRange={0}
                            defaultActivePage={1}
                            ellipsisItem={null}
                            siblingRange={1}
                            activePage={this.state.lectures ? this.state.lectures.page : 1}
                            onPageChange={(e, data) => this.getExamByContentId(data.activePage)}
                            totalPages={this.state.lectures.totalPage || 0}
                        />
                    ) : <div/>
                }
            </div>
        )
    }
}
