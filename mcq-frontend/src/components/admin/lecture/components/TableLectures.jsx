import React, {createRef} from 'react'
import {Button, ButtonGroup, Confirm, Icon, Table} from "semantic-ui-react";
import Moment from "react-moment";

class TableLectures extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lectures: props.data || {},
            confirm: false,
            lectureId: null
        }
        this.onDeleteClick = this.onDeleteClick.bind(this)
        this.onEditClick = this.onEditClick.bind(this)
        this.onCancelConfirm = this.onCancelConfirm.bind(this)
        this.onAcceptConfirm = this.onAcceptConfirm.bind(this)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.data !== prevProps.data) {
            this.setState({
                lectures: this.props.data
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
            lectureId: id
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
            onDelete(this.state.lectureId)
        }
    }


    render() {
        return (
            <div>
                <Table size={"small"} selectable basic>
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
                content='Bạn có muốn xóa bài giảng này ra khỏi danh sách?'
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
                    <Table.HeaderCell>Tên bài giảng</Table.HeaderCell>
                    <Table.HeaderCell>Mật khẩu</Table.HeaderCell>
                    <Table.HeaderCell>Ngày tạo</Table.HeaderCell>
                    <Table.HeaderCell>Hành động</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
        )
    }

    renderTableContent() {
        const lectureData = this.state.lectures.data || []
        return lectureData.length > 0 ? lectureData.map(item => {
            return (
                <Table.Row key={item._id} style={{cursor: 'pointer'}}
                           onClick={() => window.open(item.lectureUrl, '_blank')}>
                    <Table.Cell>{item.className}</Table.Cell>
                    <Table.Cell>{item.subjectName}</Table.Cell>
                    <Table.Cell>{item.contentName}</Table.Cell>
                    <Table.Cell>{item.name}</Table.Cell>
                    <Table.Cell>{item.password ? 'Có' : 'Không'}</Table.Cell>
                    <Table.Cell><Moment format="DD/MM/YYYY HH:mm">
                        {item.datetime}
                    </Moment></Table.Cell>
                    <Table.Cell>
                        <ButtonGroup>
                            <Button basic onClick={(e) => {
                                e.stopPropagation();
                                this.onEditClick(item._id)
                            }}>
                                <Icon name='edit' color='orange'/>
                            </Button>
                            <Button basic onClick={(e) => {
                                e.stopPropagation();
                                this.onDeleteClick(item._id)
                            }}>
                                <Icon name='delete' color='red'/>
                            </Button>
                        </ButtonGroup>
                    </Table.Cell>
                </Table.Row>
            )
        }) : (
            <Table.Row>
                <Table.Cell>
                    Không có dữ liệu
                </Table.Cell>
            </Table.Row>
        )
    }
}

export default TableLectures
