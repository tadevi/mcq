import React from 'react'
import {Button, ButtonGroup, Confirm, Dropdown, Icon, Table} from 'semantic-ui-react'
import Moment from "react-moment";
import {withRouter} from "react-router-dom";
import Axios from "axios";
import {SERVER_API} from "../../../../config";
import {getToken, parseBlob} from "../../../../utils/ApiUtils";
import fileDownload from "js-file-download";

class TableExam extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            exams: props.data || {},
            confirm: false,
            examId: null,
            sortColumn: 'datetime',
            sortDirection: 'descending'
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
                <Table sortable={true} basic>
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
        const handleSortClick = name => {
            const {onSortChange} = this.props
            let direction = this.state.sortDirection
            if (name === this.state.sortColumn) {
                if (direction === 'ascending')
                    direction = 'descending'
                else
                    direction = 'ascending'
            }
            this.setState({
                sortColumn: name,
                sortDirection: direction
            })

            if (typeof onSortChange === 'function') {
                onSortChange({
                    sortDirection: direction,
                    sortColumn: name
                })
            }
        }
        const sortLabel = name => this.state.sortColumn === name ? this.state.sortDirection : null
        return (
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell textAlign={'center'}>
                        Lớp
                    </Table.HeaderCell>
                    <Table.HeaderCell textAlign={'center'}>
                        Môn
                    </Table.HeaderCell>
                    <Table.HeaderCell textAlign={'center'}>
                        Chương
                    </Table.HeaderCell>
                    <Table.HeaderCell textAlign={'center'}
                    >
                        Bài
                    </Table.HeaderCell>
                    <Table.HeaderCell
                        textAlign={'center'}
                        sorted={sortLabel('name')}
                        onClick={() => handleSortClick('name')}>
                        Tên đề
                    </Table.HeaderCell>
                    <Table.HeaderCell
                        textAlign={'center'}
                        sorted={sortLabel('datetime')}
                        onClick={() => handleSortClick('datetime')}>
                        Ngày tạo
                    </Table.HeaderCell>
                    <Table.HeaderCell
                        textAlign={'center'}>
                        Người tạo
                    </Table.HeaderCell>
                    <Table.HeaderCell textAlign={'center'}>
                    </Table.HeaderCell>
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
                parseBlob(res.data, ({message}) => {
                    this.setError(message)
                    this.timeout = setTimeout(() => this.setError(''), 3000)
                })
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
        return examData.length > 0 ? examData.map(item => {
            return (
                <Table.Row key={item._id}>
                    <Table.Cell >{item.className || ''}</Table.Cell>
                    <Table.Cell>{item.subjectName || ''}</Table.Cell>
                    <Table.Cell>{item.contentName || ''}</Table.Cell>
                    <Table.Cell>{item.lessonName || ''}</Table.Cell>
                    <Table.Cell>{item.name || ''}</Table.Cell>
                    <Table.Cell><Moment format="DD/MM/YYYY HH:mm">
                        {item.datetime}
                    </Moment></Table.Cell>
                    <Table.Cell >{item.userEmail}</Table.Cell>
                    <Table.Cell >
                        <Dropdown
                            icon='sidebar'
                            disabled={this.state.loading}>
                            <Dropdown.Menu>
                                <Dropdown.Item
                                    icon={<Icon name={'edit'} color={'orange'}/>}
                                    onClick={() => this.onEditClick(item._id)}
                                />
                                <Dropdown.Item
                                    icon={<Icon name={'delete'} color={'red'}/>}
                                    onClick={() => this.onDeleteClick(item._id)}
                                />
                                <Dropdown.Item
                                    icon={<Icon name={'pie chart'} color={'green'}/>}
                                    onClick={() => this.props.history.push('/statistics/' + item._id)}/>
                                <Dropdown.Item
                                    icon={<Icon name={'download'} color={'blue'}/>}
                                    onClick={() => this.exportData(item._id, item.name)}/>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Table.Cell>
                </Table.Row>
            )
        }) : <p>Không có dữ liệu</p>
    }
}

export default withRouter(TableExam)
