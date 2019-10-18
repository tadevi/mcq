import React from 'react'
import {Button, ButtonGroup, Confirm, Icon, Table} from 'semantic-ui-react'
import Moment from "react-moment";
import {withRouter} from "react-router-dom";
import Axios from "axios";
import {SERVER_API} from "../../../../config";
import {getToken} from "../../../../utils/ApiUtils";
import fileDownload from "js-file-download";

class TableExam extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            exams: props.data || {},
            confirm: false,
            examId: null
        }
        this.onDeleteClick = this.onDeleteClick.bind(this)
        this.onEditClick = this.onEditClick.bind(this)
        this.onCancelConfirm = this.onCancelConfirm.bind(this)
        this.onAcceptConfirm = this.onAcceptConfirm.bind(this)
    }

    componentWillUnmount() {
        clearTimeout(this.timeout)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.data !== prevProps.data) {
            this.setState({
                exams: this.props.data
            })
        }
    }

    onEditClick(id) {
        const {onEdit} = this.props
        if (typeof onEdit === 'function') {
            onEdit(id)
        }
    }

    onDeleteClick(id) {
        this.setState({
            confirm: true,
            examId: id
        })

    }

    onCancelConfirm() {
        this.setState({
            confirm: false
        })
    }

    onAcceptConfirm() {
        this.setState({
            confirm: false
        })
        const {onDelete} = this.props
        if (typeof onDelete === 'function') {
            onDelete(this.state.examId)
        }
    }


    render() {
        return (
            <div>
                <Table striped basic={'very'}>
                    {this.renderHeader()}
                    <Table.Body>
                        {this.renderTableContent()}
                    </Table.Body>
                </Table>
                {this.renderConfirm()}
            </div>
        )
    }

    renderConfirm() {
        return (
            <Confirm
                open={this.state.confirm}
                content='Bạn có muốn xóa đề này ra khỏi danh sách?'
                onCancel={this.onCancelConfirm}
                onConfirm={this.onAcceptConfirm}
            />
        )
    }

    renderHeader() {
        return (
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Lớp</Table.HeaderCell>
                    <Table.HeaderCell>Môn</Table.HeaderCell>
                    <Table.HeaderCell>Chủ đề</Table.HeaderCell>
                    <Table.HeaderCell>Tên đề</Table.HeaderCell>
                    <Table.HeaderCell>Mật khẩu</Table.HeaderCell>
                    <Table.HeaderCell>Ngày tạo</Table.HeaderCell>
                    <Table.HeaderCell style={{textAlign: 'center'}}>Hành động</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
        )
    }

    setLoading(status) {
        const {onLoading} = this.props
        if (typeof onLoading === 'function') {
            onLoading(status)
        }
    }

    setError(error) {
        const {onError} = this.props
        if (typeof onError === 'function') {
            onError(error)
        }
    }

    exportData(id, name) {
        this.setLoading(true)
        Axios.get(
            `${SERVER_API}/answers/exams/${id}/export`,
            {
                headers: {
                    Authorization: getToken()
                },
                responseType: 'blob'
            }
        ).then(res => {
            if (res.data.type === 'application/json') {
                this.setError('Dữ liệu không tồn tại!')
                this.timeout = setTimeout(() => this.setError(''), 3000)
            } else {
                let blob = new Blob([res.data], {type: res.headers['content-type']})
                fileDownload(blob, `${name}.xlsx`)
            }
        })
            .catch(err => this.setError(err))
            .finally(() => this.setLoading(false))
    }

    renderTableContent() {
        const examData = this.state.exams.data || []
        return examData.map(item => {
            return (
                <Table.Row key={item._id}>
                    <Table.Cell>{item.className || ''}</Table.Cell>
                    <Table.Cell>{item.subjectName || ''}</Table.Cell>
                    <Table.Cell>{item.contentName || ''}</Table.Cell>
                    <Table.Cell>{item.name || ''}</Table.Cell>
                    <Table.Cell>{item.password ? 'Có' : 'Không'}</Table.Cell>
                    <Table.Cell><Moment format="DD/MM/YYYY HH:mm">
                        {item.datetime}
                    </Moment></Table.Cell>
                    <Table.Cell style={{textAlign: 'center'}}>
                        <ButtonGroup>
                            <Button basic onClick={() => this.onEditClick(item._id)}>
                                <Icon name='edit' color='orange'/>
                            </Button>
                            <Button basic onClick={() => this.onDeleteClick(item._id)}>
                                <Icon name='delete' color='red'/>
                            </Button>
                            <Button basic onClick={() => this.props.history.push('/statistics/' + item._id)}>
                                <Icon name={'pie chart'} color={'green'}/>
                            </Button>
                            <Button basic onClick={() => this.exportData(item._id, item.name)}>
                                <Icon name={'download'} color={'green'}/>
                            </Button>
                        </ButtonGroup>
                    </Table.Cell>
                </Table.Row>
            )
        })
    }
}

export default withRouter(TableExam)
