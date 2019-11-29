import React from "react";
import {getToken, parseBlob, userCall, userCallWithData} from "../../../utils/ApiUtils";
import {SERVER_API} from "../../../config";
import {
    Button,
    ButtonGroup,
    Checkbox,
    Confirm,
    Icon,
    Loader,
    Message,
    Pagination,
    Select,
    Table
} from "semantic-ui-react";
import Moment from "react-moment";
import Axios from "axios";
import fileDownload from "js-file-download";

const initialState = {
    error: '',
    success: '',
    loading: false,
    active: true,
    data: [],
    edit: '',
    open: false
}
const options = [
    {
        key: 'user',
        value: 'user',
        text: 'Học sinh'
    },
    {
        key: 'teacher',
        value: 'teacher',
        text: 'Giáo viên'
    },
    {
        key: 'admin',
        value: 'admin',
        text: 'Quản trị viên'
    }
]

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

    fetchPage(page = 1) {
        this.setLoading(true)
        userCall(
            'GET',
            `${SERVER_API}/users?page=${page}&active=${this.state.active}`,
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

    acceptAccount(id) {
        this.setLoading(true)
        userCallWithData(
            'PUT',
            `${SERVER_API}/users/${id}`,
            {
                active: true
            },
            data => {
                this.fetchPage(this.state.data.page)
                this.setSuccessForWhile('Phê duyệt tài khoản thành công!')
            },
            err => this.setErrorForWhile(err),
            err => this.setErrorForWhile(err),
            () => this.setLoading(false)
        )
    }

    changeRoleUser(id, role) {
        this.setLoading(true)
        userCallWithData(
            'PUT',
            `${SERVER_API}/users/${id}`,
            {
                role
            },
            data => {
                this.fetchPage(this.state.data.page)
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
        return (
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Tên</Table.HeaderCell>
                    <Table.HeaderCell style={{textAlign: 'center'}}>Vai trò</Table.HeaderCell>
                    <Table.HeaderCell>Ngày tạo</Table.HeaderCell>
                    <Table.HeaderCell>E-mail</Table.HeaderCell>
                    <Table.HeaderCell>Số điện thoại</Table.HeaderCell>
                    <Table.HeaderCell>Hành động</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
        )
    }

    renderPagination() {
        const {data, totalPage} = this.state
        if (totalPage > 1)
            return (
                <Pagination
                    activePage={data ? data.page : 0}
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
                    <Button basic onClick={() => this.acceptAccount(item._id)}>
                        <Icon name={'check'} color={'green'}/>
                    </Button>
                    <Button basic onClick={() => {
                        this.setState({
                            open: true,
                            accountId: item._id
                        })
                    }}
                    >
                        <Icon name={'delete'} color={'red'}/>
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
            </ButtonGroup>
        )
    }

    renderContentTable() {
        const {data} = this.state
        return (data && data.length > 0) ? data.map(item => {
            return (
                <Table.Row key={item._id}>
                    <Table.Cell>{item.name}</Table.Cell>
                    <Table.Cell style={{textAlign: 'center'}}>
                        <div>
                            {
                                this.state.edit === item._id ?
                                    <Select options={options}
                                            defaultValue={options.filter(it => it.value === item.role)[0].value}
                                            onChange={(e, {value}) => this.changeRoleUser(item._id, value)}
                                    />
                                    : options.filter(it => it.value === item.role)[0].text
                            }
                            <Icon name={'pencil'}
                                  color={'orange'}
                                  style={{float: 'right', cursor: 'pointer'}}
                                  disabled={!this.state.active}
                                  onClick={() => {
                                      if (this.state.edit !== item._id) {
                                          this.setState({
                                              edit: item._id
                                          })
                                      } else {
                                          if (this.state.edit) {
                                              this.setState({
                                                  edit: this.state.edit === '' ? item._id : ''
                                              })
                                          }
                                      }
                                  }}
                            />
                        </div>
                    </Table.Cell>
                    <Table.Cell>
                        <Moment format="DD/MM/YYYY HH:mm">
                            {item.datetime}
                        </Moment>
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
                    <Checkbox
                        toggle
                        label={'Đã xác nhận'}
                        defaultChecked={this.state.active}
                        onClick={(e, {checked}) => this.toggleActive(checked)}
                    />
                    <span style={{
                        paddingLeft: '10px',
                        fontWeight: '500'
                    }}>{this.state.inActiveCount ? `(${this.state.inActiveCount} tài khoản mới)` : ''}</span>
                    <Button
                        basic
                        color={'green'}
                        style={{float: 'right'}}
                        icon={'download'}
                        content={'Lưu dưới dạng Excel'}
                        onClick={() => this.exportData()}
                    />
                </div>
                <Table striped basic={'very'}>
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
            </div>
        )
    }
}

export default AccountManagement
