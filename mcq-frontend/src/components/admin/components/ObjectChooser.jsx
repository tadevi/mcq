import React from 'react'
import {Button, Dropdown, Form, Grid, Header, Icon, Modal} from 'semantic-ui-react'

import {SERVER_API} from '../../../config'

import {userCall, userCallWithData} from "../../../utils/ApiUtils";
import './style.css'
const initialState = {
    loading: false,
    data: [],
    parentId: '',
    modal: false,
    edit: false,
    textContent: '',
    idContent: '',
}

class ObjectChooser extends React.Component {
    addIcon = <Icon name='add' color='green'/>
    deleteIcon = <Icon name='delete' color='red'/>
    editIcon = <Icon name='edit' color='orange'/>

    constructor(props) {
        super(props)
        this.state = {
            ...initialState,
            parentId: props.parentId
        }
    }

    setLoading(status) {
        this.setState({
            loading: status
        })
    }

    setError(error) {
        const {onError} = this.props
        if (typeof onError === 'function') {
            onError(error)
        }
    }

    componentDidMount() {
        const {name} = this.props
        if (name === 'classes')
            this.getContent()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.parentId !== this.props.parentId) {
            const state = {
                ...initialState,
                parentId: this.props.parentId
            }
            this.setState(state)
            if (this.props.parentId)
                this.getContent(this.props.parentId)
        }
        if (prevProps.reload !== this.props.reload) {
            this.getContent()
        }
    }

    getContent(id) {
        const {name} = this.props
        this.setLoading(true)
        this.setState({
            textContent: '',
            idContent: ''
        })
        const url = id ? `${SERVER_API}/${name}/${id}` : `${SERVER_API}/${name}`
        userCall(
            'GET',
            url,
            data => {
                this.setState({data})
                this.setError('')
            },
            err => this.setError(err),
            err => this.setError(err),
            () => this.setLoading(false)
        )
    }

    addContent(value) {
        const {name, parentId} = this.props
        let data = {
            name: value
        }
        if (name === 'subjects') {
            data = {
                ...data,
                classId: parentId
            }
        } else if (name === 'contents') {
            data = {
                ...data,
                subjectId: parentId
            }
        } else if (name === 'lessons') {
            data = {
                ...data,
                contentId: parentId
            }
        }
        userCallWithData(
            'POST',
            `${SERVER_API}/${name}`,
            data,
            data => {
                this.getContent(parentId)
                this.setError('')
            },
            err => this.setError(err),
            err => this.setError(err),
            () => this.setLoading(false)
        )
    }

    editContent(newContent) {
        const {name, parentId} = this.props
        this.setLoading(true)
        userCallWithData(
            'PUT',
            `${SERVER_API}/${name}/${this.state.idContent}`,
            {
                name: newContent
            },
            data => {
                this.getContent(parentId)
                this.setError('')
            },
            err => this.setError(err),
            err => this.setError(err),
            () => {
                this.setLoading(false)
                this.setState({
                    modal: false
                })
            }
        )
    }

    deleteContent() {
        const {name, parentId, onDelete} = this.props
        this.setLoading(true)
        userCall(
            'DELETE',
            `${SERVER_API}/${name}/${this.state.idContent}`,
            data => {
                if (typeof onDelete === 'function') {
                    onDelete()
                }
                this.getContent(parentId)
            },
            err => this.setError(err),
            err => this.setError(err),
            () => this.setLoading(false)
        )
    }

    onActionChange(e, {icon, value}) {
        switch (value) {
            case 'add':
                this.setState({
                    modal: true,
                    edit: false
                })
                break;
            case 'edit':
                this.setState({
                    edit: true,
                    modal: true

                })
                break;
            case 'delete':
                this.deleteContent()
                break;
            default:
        }
    }

    onSubmit() {
        if (this.state.edit) {
            this.editContent(this.state.value)
        } else {
            this.addContent(this.state.value)
        }
        this.setState({
            modal: false
        })
    }

    renderModal() {
        return (
            <Modal open={this.state.modal} closeIcon onClose={() => this.setState({modal: false})}>
                <Header icon='archive' content={this.state.edit ? "Thay đổi" : "Thêm mới"}/>
                <Modal.Content>
                    <Form.Input
                        fluid
                        label='Tên'
                        defaultValue={this.state.edit ? this.state.textContent : ''}
                        onChange={(e, {value}) => this.setState({value})}
                    />
                </Modal.Content>
                <Modal.Actions>
                    <Button color='red' onClick={() => this.setState({modal: false})}>
                        <Icon name='remove'/> No
                    </Button>
                    <Button color='green' onClick={() => this.onSubmit()}>
                        <Icon name='checkmark'/> Yes
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }

    renderContentDropdown() {
        return (
            <Dropdown
                fluid
                className={'selection single line'}
                text={this.state.textContent}
                placeholder={this.props.placeholder}
                disabled={this.state.loading}
                loading={this.state.loading}
            >
                <Dropdown.Menu>
                    {
                        this.state.data.map(item => {
                            return (
                                <Dropdown.Item
                                    key={item._id}
                                    name={item._id}
                                    text={item.name}
                                    onClick={this.onContentClick.bind(this)}
                                />
                            )
                        })
                    }
                </Dropdown.Menu>
            </Dropdown>
        )
    }

    renderActionDropdown() {
        return (
            <Dropdown
                icon='sidebar'
                disabled={this.state.loading}>
                <Dropdown.Menu>
                    <Dropdown.Item
                        icon={this.addIcon}
                        onClick={this.onActionChange.bind(this)}
                        value='add'
                    />
                    <Dropdown.Item
                        icon={this.editIcon}
                        onClick={this.onActionChange.bind(this)}
                        value='edit'
                    />
                    <Dropdown.Item
                        value='delete'
                        icon={this.deleteIcon}
                        onClick={this.onActionChange.bind(this)}/>
                </Dropdown.Menu>
            </Dropdown>
        )
    }

    onContentClick(e, {text, name}) {
        this.setState({
            idContent: name,
            textContent: text
        })

        const {onContentSelect} = this.props
        if (typeof onContentSelect === 'function') {
            onContentSelect({value: name})
        }
    }

    render() {
        return (
            <div style={{display:'inline-block'}}>
                {this.renderActionDropdown()}
                {this.renderContentDropdown()}
                {this.renderModal()}
            </div>
        )
    }
}

export default ObjectChooser
