import React from 'react'
import {Button, Grid, Header, Icon, Loader, Message, Modal, Pagination} from "semantic-ui-react";
import TableLectures from "./components/TableLectures";
import ObjectChooser from "../components/ObjectChooser";
import LectureEditor from "./components/LectureEditor";
import {userCall, userCallWithData} from "../../../utils/ApiUtils";
import {SERVER_API} from "../../../config";

class LecturePage extends React.Component {
    _isMounted = false
    state = {
        lectures: {},
        loading: false,
        error: '',
        success: '',
        classId: '',
        subjectId: '',
        contentId: '',
        modal: false,
        editMode: false,
        lectureToEdit: {},
        reload: 0
    }

    constructor(props) {
        super(props)
        this.setError = this.setError.bind(this)
        this.onClassItemSelect = this.onClassItemSelect.bind(this)
        this.onSubjectItemSelect = this.onSubjectItemSelect.bind(this)
        this.onContentItemSelect = this.onContentItemSelect.bind(this)
        this.setModalStatus = this.setModalStatus.bind(this)
        this.setLoading = this.setLoading.bind(this)
        this.handleLectureChange = this.handleLectureChange.bind(this)
    }

    componentDidMount() {
        this._isMounted = true
        this.getLectures(1)
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    createLecture() {
        this.setLoading(true)
        userCallWithData(
            'POST',
            `${SERVER_API}/lectures`,
            this.state.lectureToEdit,
            data => {
                this.setState({
                    lectureToEdit: {},
                    success: 'Tạo bài giảng thành công!',
                    error: ''
                })
                this.getLectures(this.state.lectures.page)
            },
            err => this.setError(err),
            err => this.setError(err),
            () => this.setState({
                loading: false,
                modal: false
            })
        )
    }

    getLectures(page, sort = '') {
        this.setLoading(true)
        let url = `${SERVER_API}/lectures?page=${page}${sort}`
        if (this.state.contentId)
            url = `${SERVER_API}/lectures/contents/${this.state.contentId}?page=${page}${sort}`
        userCall(
            'GET',
            url,
            data => {
                this.safeSetState({
                    lectures: data,
                    error: ''
                })
            },
            err => this.setError(err),
            err => this.setError(err),
            () => this.setLoading(false)
        )
    }

    getLectureById(id) {
        this.setLoading(true)
        userCall(
            'GET',
            `${SERVER_API}/lectures/${id}`,
            data => {
                this.setState({
                    lectureToEdit: data,
                    modal: true,
                    editMode: true,
                    error: ''
                })
            },
            err => this.setError(err),
            err => this.setError(err),
            () => this.setLoading(false)
        )
    }

    deleteLectureById(id) {
        this.setLoading(true)
        userCall(
            'DELETE',
            `${SERVER_API}/lectures/${id}`,
            data => {
                this.getLectures(this.state.lectures.page)
                this.setState({
                    error: ''
                })
            },
            err => this.setError(err),
            err => this.setError(err),
            () => this.setLoading(false)
        )
    }

    editLectureById(id) {
        this.setLoading(true)
        userCallWithData(
            'PUT',
            `${SERVER_API}/lectures/${id}`,
            this.state.lectureToEdit,
            data => {
                this.getLectures(this.state.lectures.page)
                this.setState({
                    success: 'Thay đổi thông tin bài giảng thành công!',
                    error: '',
                    lectureToEdit: {},
                })
            },
            err => this.setError(err),
            err => this.setError(err),
            () => {
                this.setState({
                    loading: false,
                    modal: false
                })
            }
        )
    }

    renderPagination() {
        const {lectures} = this.state
        if (lectures.totalPage > 1)
            return (
                <Pagination
                    activePage={lectures.page || 1}
                    onPageChange={(e, data) => this.getLectures(data.activePage)}
                    totalPages={lectures.totalPage}
                />
            )
        return <div/>
    }

    handleSortChange(data) {
        const {sortColumn, sortDirection} = data
        const sort = `&sort=${sortDirection === 'ascending' ? '+' : '-'}${sortColumn}`
        this.getLectures(1, sort)
    }

    render() {
        const {error, success} = this.state
        return (
            <div>
                <Message
                    error={error !== ''}
                    content={error}
                    hidden={error === ''}
                    header={'Lỗi'}/>
                <Message
                    success={success !== ''}
                    content={success}
                    hidden={success === ''}
                    header={'Thành công'}
                />
                <Grid divided centered>
                    {this.renderAddLecture()}
                    <Grid.Row columns={1}>
                        <Grid.Column width={16}>
                            <TableLectures
                                data={this.state.lectures}
                                onEdit={id => this.onLectureEdit(id)}
                                onDelete={id => this.onLectureDelete(id)}
                                onSortChange={data => this.handleSortChange(data)}
                            />
                            <Loader active={this.state.loading}/>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                {this.renderModal()}
                {this.renderPagination()}
            </div>
        )
    }

    onLectureEdit(id) {
        this.getLectureById(id)
    }

    onLectureDelete(id) {
        this.deleteLectureById(id)
    }

    reloadData() {
        this.setState({
            classId: '',
            contentId: '',
            subjectId: '',
            error: '',
            reload: this.state.reload + 1
        }, () => this.getLectures(1))
    }

    renderAddLecture() {
        return (
            <Grid.Row columns={4} stretched>
                <Grid.Column>
                    <ObjectChooser onError={this.setError}
                                   placeholder='Lớp'
                                   name='classes'
                                   reload={this.state.reload}
                                   onContentSelect={this.onClassItemSelect}/>
                </Grid.Column>
                <Grid.Column>
                    <ObjectChooser onError={this.setError}
                                   placeholder='Môn'
                                   name='subjects'
                                   parentId={this.state.classId}
                                   onContentSelect={this.onSubjectItemSelect}/>
                </Grid.Column>
                <Grid.Column>
                    <ObjectChooser onError={this.setError}
                                   placeholder='Chủ đề'
                                   name='contents'
                                   parentId={this.state.subjectId}
                                   onDelete={() => this.reloadData()}
                                   onContentSelect={this.onContentItemSelect}
                    />
                </Grid.Column>
                <Grid.Column>
                    <Button.Group>
                        <Button basic onClick={() => this.reloadData()}>
                            <Icon name={'redo'}/>
                        </Button>
                        <Button basic color={"green"} onClick={() => this.setModalStatus(true)}>
                            <Icon name='plus' color={'green'}/> Thêm bài giảng
                        </Button>
                    </Button.Group>
                </Grid.Column>
            </Grid.Row>
        )
    }


    safeSetState(state) {
        if (this._isMounted)
            this.setState({
                ...state
            })
    }

    setLoading(loading) {
        this.setState({
            loading
        })
    }

    setError(error) {
        if (error)
            this.setState({
                error,
                success: ''
            })
        this.setState({
            error
        })
    }

    onClassItemSelect({value}) {
        this.setState({
            classId: value,
            subjectId: '', //reset subject id
            contentId: '' //reset content id
        })
    }

    onSubjectItemSelect({value}) {
        this.setState({
            subjectId: value,
            contentId: ''
        })
    }

    onContentItemSelect({value}) {
        this.setState({
            contentId: value
        }, () => this.getLectures(1))
    }

    setModalStatus(status) {
        if (status === false) {
            this.setState({
                lectureToEdit: {}
            })
        }
        this.setState({
            modal: status
        })
    }

    handleLectureChange(e, {name, value}) {
        this.setState({
            lectureToEdit: {
                ...this.state.lectureToEdit,
                [name]: value
            }
        })

    }

    onModalYes() {
        if (this.state.editMode) {
            this.editLectureById(this.state.lectureToEdit._id)
        } else {
            this.setState({
                lectureToEdit: {
                    ...this.state.lectureToEdit,
                    contentId: this.state.contentId
                }
            }, () => this.createLecture())
        }
    }

    renderModal() {
        return (
            <Modal open={this.state.modal} closeIcon onClose={() => this.setModalStatus(false)}>
                <Header icon='archive' content={this.state.editMode ? "Thay đổi" : "Thêm mới"}/>
                <Modal.Content>
                    <LectureEditor
                        initData={this.state.lectureToEdit}
                        onChange={this.handleLectureChange}
                        error={this.state.error}
                        success={this.state.success}
                        loading={this.state.loading}
                    />
                </Modal.Content>
                <Modal.Actions>
                    <Button color='red' onClick={() => this.setModalStatus(false)}>
                        <Icon name='remove'/> Đóng
                    </Button>
                    <Button color='green' onClick={() => this.onModalYes()}>
                        <Icon name='checkmark'/> Chấp nhận
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}

export default LecturePage
