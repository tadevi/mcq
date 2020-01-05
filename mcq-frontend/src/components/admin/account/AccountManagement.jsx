import React from "react";
import {getRole, getToken, parseBlob, userCall, userCallWithData} from "../../../utils/ApiUtils";
import {SERVER_API} from "../../../config";
import './account.css'
import {
    Button,
    ButtonGroup,
    Checkbox,
    Confirm,
    Icon,
    Loader,
    Message, Modal,
    Form,
    Pagination,
    Table, Grid
} from "semantic-ui-react";
import Moment from "react-moment";
import Axios from "axios";
import fileDownload from "js-file-download";
import UserEditor from "./components/UserEditor";

const initialState = {
    error: '',
    success: '',
    loading: false,
    active: true,
    data: [],
    edit: '',
    open: false,
    editModal: false,
    userSelect: null,
    editData: {},
    sortColumn: 'datetime',
    sortDirection: 'ascending',
    textSearch: ''
}


class AccountManagement extends React.Component {
    state = {
        ...initialState
    }

    componentWillUnmount() {
        clearTimeout(this.timeout)
    }

    componentDidMount() {
        this.fetchPage(1)
        this.getInActiveUser()
    }

    setError(error) {
        this.setState({
            error
        })
    }

    setErrorForWhile(err) {
        this.setError(err)
        setTimeout(() => this.setError(''), 2000)
    }

    setSuccessForWhile(success) {
        this.setState({
            success
        })
        setTimeout(() => this.setState({
            success: ''
        }), 2000)
    }

    setLoading(status) {
        this.setState({
            loading: status
        })
    }

    fetchPage(page = 1, search = '') {
        this.setLoading(true)
        const searchPart = this.state.textSearch ? `&search=${this.state.textSearch}` : ''
        const sortingPart = `&sort=${this.state.sortDirection === 'ascending' ? '+' : '-'}${this.state.sortColumn}`
        const url = `${SERVER_API}/users?page=${page}&active=${this.state.active}${sortingPart}${searchPart}`
        userCall(
            'GET',
            encodeURI(url),
            data => this.setState({...data}),
            err => this.setError(err),
            err => this.setError(err),
            () => this.setLoading(false)
        )
    }

    toggleActive(checked) {
        const state = {
            ...initialState,
            active: checked
        }
        this.setState(state, () => this.fetchPage(1))
    }

    deleteAccount(id) {
        this.setLoading(true)
        userCall(
            'DELETE',
            `${SERVER_API}/users/${id}`,
            data => this.fetchPage(this.state.data.page),
            err => this.setState(err),
            err => this.setError(err),
            () => this.setLoading(false)
        )

    }

    editUser(id, data) {
        this.setLoading(true)
        userCallWithData(
            'PUT',
            `${SERVER_API}/users/${id}`,
            data,
            data => {
                this.fetchPage(this.state.page)
            },
            err => this.setErrorForWhile(err),
            err => this.setErrorForWhile(err),
            () => this.setLoading(false)
        )
    }

    acceptAllAccount() {
        this.setLoading(true)
        userCall(
            'PUT',
            `${SERVER_API}/active`,
            data => {
                this.fetchPage(1)
                this.setSuccessForWhile('Phê duyệt tài khoản thành công!')
            },
            err => this.setErrorForWhile(err),
            err => this.setErrorForWhile(err),
            () => this.setLoading(false)
        )
    }

    renderHeaderTable() {
        const handleSortClick = name => {
            let direction = this.state.sortDirection
            if (name === this.state.sortColumn) {
                if (direction === 'ascending')
                    direction = 'descending'
                else direction = 'ascending'
            }
            this.setState({
                sortColumn: name,
                sortDirection: direction
            }, () => this.fetchPage(1))

        }
        const sortLabel = name => this.state.sortColumn === name ? this.state.sortDirection : null
        return (
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell
                        textAlign={'center'}
                        sorted={sortLabel('name')}
                        onClick={() => handleSortClick('name')}
                    >
                        Tên
                    </Table.HeaderCell>
                    <Table.HeaderCell textAlign={'center'}
                                      sorted={sortLabel('role')}
                                      onClick={() => handleSortClick('role')}
                    >
                        Vai trò
                    </Table.HeaderCell>
                    <Table.HeaderCell textAlign={'center'}
                                      sorted={sortLabel('datetime')}
                                      onClick={() => handleSortClick('datetime')}
                    >
                        Ngày tạo
                    </Table.HeaderCell>
                    <Table.HeaderCell textAlign={'center'}
                                      sorted={sortLabel('remain')}
                                      onClick={() => handleSortClick('remain')}
                    >
                        Giờ còn lại
                    </Table.HeaderCell>
                    <Table.HeaderCell
                        textAlign={'center'}
                        sorted={sortLabel('email')}
                        onClick={() => handleSortClick('email')}
                    >
                        E-mail
                    </Table.HeaderCell>
                    <Table.HeaderCell
                        textAlign={'center'}
                    >
                        Số điện thoại
                    </Table.HeaderCell>
                    <Table.HeaderCell
                        textAlign={'center'}
                    >
                        Hành động
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>
        )
    }

    renderPagination() {
        const {page, totalPage} = this.state
        if (totalPage > 1)
            return (
                <Pagination
                    activePage={page || 1}
                    onPageChange={(e, data) => this.fetchPage(data.activePage)}
                    totalPages={totalPage}
                />
            )
        return <div/>
    }

    renderButtonGroup(item) {
        const {active} = this.state
        if (!active)
            return (
                <ButtonGroup size={'mini'}>
                    <Button basic onClick={() => {
                        this.setState({
                            open: true,
                            accountId: item._id
                        })
                    }}
                    >
                        <Icon name={'delete'} color={'red'}/>
                    </Button>
                    <Button basic onClick={() => this.setState({
                        editModal: true,
                        userSelect: item
                    })}>
                        <Icon name={'pencil'} color={'orange'}/>
                    </Button>
                </ButtonGroup>
            )
        return (
            <ButtonGroup size={'mini'}>
                <Button basic onClick={() => this.setState({
                    accountId: item._id,
                    open: true
                })}>
                    <Icon color='red' name={'delete'}/>
                </Button>
                <Button basic
                        onClick={() => this.exportUserData(item._id, item.email)}>
                    <Icon color={'green'} name={'download'}/>
                </Button>
                <Button basic onClick={() => this.setState({
                    editModal: true,
                    userSelect: item
                })}>
                    <Icon name={'pencil'} color={'orange'}/>
                </Button>
            </ButtonGroup>
        )
    }

    renderContentTable() {
        const {data} = this.state
        return (data && data.length > 0) ? data.map(item => {
            return (
                <Table.Row key={item._id}>
                    <Table.Cell>{item.name}</Table.Cell>
                    <Table.Cell textAlign={'center'}>
                        {getRole(item.role)}
                    </Table.Cell>
                    <Table.Cell textAlign={'center'}>
                        <Moment format="DD/MM/YYYY HH:mm">
                            {item.datetime}
                        </Moment>
                    </Table.Cell>
                    <Table.Cell textAlign={'center'}>
                        {Math.round(item.remain * 10 / 60) / 10}
                    </Table.Cell>
                    <Table.Cell>{item.email}</Table.Cell>
                    <Table.Cell>{item.phone}</Table.Cell>
                    <Table.Cell>

                        {
                            this.renderButtonGroup(item)
                        }
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

    exportData() {
        this.setLoading(true)
        Axios.get(
            `${SERVER_API}/users/export`,
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
                fileDownload(blob, 'users.xlsx')
            }
        })
            .catch(err => this.setError(err))
            .finally(() => this.setLoading(false))
    }

    exportUserData(id, email) {
        this.setLoading(true)
        Axios.get(
            `${SERVER_API}/exams/users/${id}/export`,
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
                fileDownload(blob, `${email}.xlsx`)
            }
        })
            .catch(err => this.setError(err))
            .finally(() => this.setLoading(false))
    }

    getInActiveUser() {
        this.setLoading(true)
        userCall(
            'GET',
            `${SERVER_API}/users/count`,
            data => this.setState({
                inActiveCount: data.inactiveCount
            }),
            err => this.setErrorForWhile(err),
            err => this.setErrorForWhile(err),
            () => this.setLoading(false)
        )
    }

    render() {
        return (
            <div>
                <Message
                    error
                    header='Lỗi'
                    content={this.state.error}
                    hidden={this.state.error === ''}
                />
                <Message
                    success
                    header='Thành công'
                    content={this.state.success}
                    hidden={this.state.success === ''}
                />
                <div>
                    {/*<Checkbox*/}
                    {/*    toggle*/}
                    {/*    label={'Đã xác nhận'}*/}
                    {/*    defaultChecked={this.state.active}*/}
                    {/*    onClick={(e, {checked}) => this.toggleActive(checked)}*/}
                    {/*/>*/}
                    {/*<span style={{*/}
                    {/*    paddingLeft: '10px',*/}
                    {/*    fontWeight: '500'*/}
                    {/*}}>{this.state.inActiveCount ? `(${this.state.inActiveCount} tài khoản mới)` : ''}</span>*/}
                    {/*<Button*/}
                    {/*    basic*/}
                    {/*    color={'green'}*/}
                    {/*    style={{float: 'right'}}*/}
                    {/*    icon={'download'}*/}
                    {/*    content={'Lưu dưới dạng Excel'}*/}
                    {/*    onClick={() => this.exportData()}*/}
                    {/*/>*/}

                    <Checkbox
                        toggle
                        label={'Đã xác nhận'}
                        defaultChecked={this.state.active}
                        onClick={(e, {checked}) => this.toggleActive(checked)}
                    />
                    <Button
                        basic
                        color={'green'}
                        style={{float: 'right'}}
                        icon={'download'}
                        content={'Lưu'}
                        onClick={() => this.exportData()}
                    />
                    <Form.Input
                        fluid
                        icon={'search'}
                        iconPosition={'left'}
                        style={{marginTop: '30px'}}
                        placeholder='Tìm kiếm theo tên, email, số điện thoại'
                        value={this.state.textSearch}
                        onChange={(e, {value}) => this.setState({textSearch: value})}
                        onKeyPress={e => {
                            if (e.key === 'Enter') {
                                this.fetchPage(1)
                            }
                        }}
                    />
                </div>
                <Table basic={'very'} sortable={true} singleLine={true}>
                    {this.renderHeaderTable()}
                    <Table.Body>
                        {this.renderContentTable()}
                    </Table.Body>
                </Table>
                <Loader active={this.state.loading}/>
                <div style={{marginBottom: '10px', display: this.state.active ? 'none' : 'block'}}>
                    <Button primary onClick={() => this.acceptAllAccount()}>
                        Phê duyệt tất cả
                    </Button>
                </div>
                {
                    this.renderPagination()
                }
                <Confirm
                    content={'Bạn có muốn thực hiện hành động này?'}
                    open={this.state.open}
                    onCancel={() => this.setState({open: false})}
                    onConfirm={() => {
                        if (this.state.accountId)
                            this.deleteAccount(this.state.accountId)
                        this.setState({
                            accountId: undefined,
                            open: false
                        })
                    }}
                />
                <Modal open={this.state.editModal} onClose={() => this.setState({editModal: false})}>
                    <Modal.Header>
                        Thay đổi thông tin
                    </Modal.Header>
                    <Modal.Content>
                        <UserEditor defaultActive={this.state.userSelect ? this.state.userSelect.active : false}
                                    defaultRemain={this.state.userSelect ? this.state.userSelect.remain : 300}
                                    defaultRole={this.state.userSelect ? this.state.userSelect.role : 'user'}
                                    onChange={editData => this.setState({editData})}/>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='red' onClick={() => this.setState({editModal: false})}>
                            <Icon name='remove'/> Thoát
                        </Button>
                        <Button color='green' onClick={() => {
                            if (this.state.userSelect)
                                this.editUser(this.state.userSelect._id, this.state.editData)
                            this.setState({
                                editModal: false,
                                userSelect: null
                            })
                        }
                        }>
                            <Icon name='checkmark'/> Chấp nhận
                        </Button>
                    </Modal.Actions>
                </Modal>
            </div>
        )
    }
}

export default AccountManagement
