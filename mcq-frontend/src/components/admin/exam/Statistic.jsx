import React from "react";
import {userCall} from "../../../utils/ApiUtils";
import {SERVER_API} from "../../../config";
import {withRouter} from "react-router-dom";
import {Grid, Loader, Message, Pagination, Table} from "semantic-ui-react";
import Moment from "react-moment";
import SimpleAppBar from "../../users/exam/list/SimpleAppBar";

class Statistic extends React.Component {
    state = {
        data: [],
        loading: false,
        error: ''
    }

    componentDidMount() {
        this.fetchPage(1)
    }

    fetchPage(page) {
        const id = this.props.match.params.id
        this.setState({
            loading: true
        })
        userCall(
            'GET',
            `${SERVER_API}/answers/exams/${id}?page=${page}`,
            data => {
                this.setState(
                    data
                )
            },
            err => {
                this.setState({
                    error: err
                })
            },
            err => {
                this.setState({
                    error: err
                })
            },
            () => {
                this.setState({
                    loading: false
                })
            }
        )
    }

    renderPagination() {
        const {totalPage, page} = this.state
        if (totalPage > 1)
            return (
                <Pagination
                    boundaryRange={0}
                    ellipsisItem={null}
                    siblingRange={1}
                    activePage={page || 0}
                    onPageChange={(e, data) => this.fetchPage(data.activePage)}
                    totalPages={totalPage || 0}
                />
            )
        return <div/>
    }

    renderTable() {
        const {history} = this.props
        return (<Table basic={'very'} selectable>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>
                        STT
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        Tên
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        Email
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        Thời gian
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        Đúng/Tổng số
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        Điểm
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {
                    this.state.data.map((item, index) => {
                        return (
                            <Table.Row key={item._id}
                                       style={{cursor: 'pointer'}}
                                       onClick={() => history.push('/result/' + item._id || '')}>
                                <Table.Cell>
                                    {(this.state.page - 1) * 10 + index + 1}
                                </Table.Cell>
                                <Table.Cell>
                                    {item.userName}
                                </Table.Cell>
                                <Table.Cell>
                                    {item.userEmail}
                                </Table.Cell>
                                <Table.Cell>
                                    <Moment format={'DD/MM/YY HH:mm'}>
                                        {item.start}
                                    </Moment>
                                </Table.Cell>
                                <Table.Cell>
                                    {`${item.correct}/${item.total}`}
                                </Table.Cell>
                                <Table.Cell>
                                    {item.point}
                                </Table.Cell>
                            </Table.Row>
                        )
                    })
                }
            </Table.Body>
        </Table>)
    }

    render() {
        let examName = ''
        if (this.state.data.length > 0) {
            examName = this.state.data[0].examName
        }
        const {loading, data} = this.state
        return (
            <div>
                <SimpleAppBar header={'Thống kê cho ' + examName}/>
                <Message
                    error
                    content={this.state.error}
                    hidden={this.state.error === ''}
                />
                <Grid>
                    <Grid.Column width={2}/>
                    <Grid.Column width={12}>
                        {!loading && data.length === 0
                            ? <p style={{textAlign: 'center'}}>Không có dữ liệu</p>
                            : this.renderTable()}
                        <Loader active={loading}/>
                        {
                            this.renderPagination()
                        }
                    </Grid.Column>
                    <Grid.Column width={2}/>
                </Grid>
            </div>
        )
    }
}

export default withRouter(Statistic)
