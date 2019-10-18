import React, {Component} from 'react'
import {Button, Grid, Header, Icon, Loader, Message, Modal, Pagination} from 'semantic-ui-react'
import {SERVER_API} from '../../../config'
import ObjectChooser from '../components/ObjectChooser'
import TableExam from "./component/TableExam";
import ExamEditor from "./component/ExamEditor";
import {userCall, userCallWithData} from "../../../utils/ApiUtils";

class ExamPage extends Component {
    state = {
        classes: [],
        subjects: [],
        contents: [],
        exams: {},
        error: '',
        loading: false,
        modal: false,
        contentId: null,
        editMode: false,
        examToEdit: {},
        success: '',
        reload: 0,
        time: 0
    };

    constructor(props) {
        super(props);
        this.handleExamChange = this.handleExamChange.bind(this)
        this.setError = this.setError.bind(this)
        this.onClassItemSelect = this.onClassItemSelect.bind(this)
        this.onSubjectItemSelect = this.onSubjectItemSelect.bind(this)
        this.onContentItemSelect = this.onContentItemSelect.bind(this)
        this.setModalStatus = this.setModalStatus.bind(this)
        this.setLoading = this.setLoading.bind(this)
    }

    handleExamChange(e, {name, value}) {
        this.setState({
            examToEdit: {
                ...this.state.examToEdit,
                [name]: value
            }
        })
    }


    setError(error) {
        this.setState({
            error,
            success: ''
        })
    }

    setLoading(status) {
        this.setState({
            loading: status
        })
    }

    setModalStatus(status) {
        if (!status) {
            this.setState({
                modal: status,
                error: '',
                success: '',
                editMode: false,
                examToEdit: {}
            })
        }
        this.setState({
            modal: status
        })
    }

    createExam() {
        this.setLoading(true)
        userCallWithData(
            'POST',
            `${SERVER_API}/exams`,
            this.state.examToEdit,
            data => this.setState({
                examToEdit: {},
                success: 'Tạo đề thi thành công!',
                error: ''
            }, () => this.getExam(this.state.exams.page)),
            err => this.setError(err),
            err => this.setError(err),
            () => this.setState({
                loading: false,
                modal: false
            })
        )
    }

    componentDidMount() {
        this.getExam(1)
    }

    getExam(pageNumber) {
        this.setLoading(true)
        let url = `${SERVER_API}/exams?page=${pageNumber}`
        if (this.state.contentId)
            url = `${SERVER_API}/exams/contents/${this.state.contentId}?page=${pageNumber}`
        userCall(
            'GET',
            url,
            data => this.setState({exams: data}),
            err => this.setError(err),
            err => this.setError(err),
            () => this.setLoading(false)
        )
    }

    getExamById(id) {
        this.setLoading(true)
        userCall(
            'GET',
            `${SERVER_API}/exams/${id}`,
            data => this.setState({
                examToEdit: data,
                modal: true,
                editMode: true
            }),
            err => this.setError(err),
            err => this.setError(err),
            () => this.setLoading(false)
        )
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

    deleteExam(id) {
        this.setLoading(true)
        userCall(
            'DELETE',
            `${SERVER_API}/exams/${id}`,
            data => {
                this.getExam(this.state.exams.page)
                this.setSuccessForWhile('Xóa đề thi thành công!')
            },
            err => this.setErrorForWhile(err),
            err => this.setErrorForWhile(err),
            () => this.setLoading(false)
        )
    }

    editExam(id) {
        const onEditExamSuccess = () => {
            this.getExam(this.state.exams.page)
            this.setState({
                success: 'Thay đổi thông tin đề thi thành công!',
                error: '',
                examToEdit: {}
            })
        }
        this.setLoading(true)
        const {answer, contentId, datetime, examUrl, explainUrl, name, note, password, time, total} = this.state.examToEdit
        const data = {answer, contentId, datetime, explainUrl, examUrl, name, note, password, time, total}
        userCallWithData(
            'PUT',
            `${SERVER_API}/exams/${id}`,
            data,
            data => onEditExamSuccess(),
            err => this.setError(err),
            err => this.setError(err),
            () => this.setState({
                loading: false,
                modal: false
            })
        )
    }

    onModalYes() {
        if (this.state.editMode) {
            this.editExam(this.state.examToEdit._id)
        } else {
            this.setState({
                examToEdit: {
                    ...this.state.examToEdit,
                    contentId: this.state.contentId
                }
            }, () => this.createExam())
        }
    }

    onAddExamClick() {
        if (!this.state.contentId) {
            this.setError('Chọn chủ đề cho đề thi!')
            setTimeout(() => this.setError(''),
                2000)
        } else this.setModalStatus(true)
    }

    renderModal() {
        return (
            <Modal open={this.state.modal} closeIcon onClose={() => this.setModalStatus(false)}>
                <Header icon='archive' content={this.state.editMode ? "Thay đổi" : "Thêm mới"}/>
                <Modal.Content>
                    <ExamEditor
                        initData={this.state.examToEdit}
                        onChange={this.handleExamChange}
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

    onExamDelete(id) {
        this.deleteExam(id)
    }

    onExamEdit(id) {
        this.getExamById(id)
    }

    renderPagination() {
        const {exams} = this.state
        if (exams.totalPage > 1)
            return (
                <Pagination
                    boundaryRange={0}
                    ellipsisItem={null}
                    siblingRange={1}
                    activePage={exams.page || 0}
                    onPageChange={(e, data) => this.getExam(data.activePage)}
                    totalPages={exams.totalPage || 0}
                />
            )
        return <div/>
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
                    {this.renderAddExamSection()}
                    <Grid.Row columns={1}>
                        <Grid.Column width={16}>
                            <TableExam
                                data={this.state.exams}
                                onEdit={id => this.onExamEdit(id)}
                                onDelete={id => this.onExamDelete(id)}
                                onError={err => this.setError(err)}
                                onLoading={status => this.setLoading(status)}
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
        }, () => this.getExam(1))
    }

    reloadData() {
        this.setState({
            classId: '',
            contentId: '',
            subjectId: '',
            reload: this.state.reload + 1,
            error: '',
            success: ''
        }, () => this.getExam(1))
    }

    renderAddExamSection() {
        return (
            <Grid.Row columns={4} stretched>
                <Grid.Column>
                    <ObjectChooser onError={this.setError}
                                   placeholder='Lớp'
                                   name='classes'
                                   reload={this.state.reload}
                                   onContentSelect={this.onClassItemSelect}
                    />
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
                                   placeholder='Nội dung'
                                   name='contents'
                                   parentId={this.state.subjectId}
                                   onDelete={() => this.reloadData()}
                                   onContentSelect={this.onContentItemSelect}
                    />
                </Grid.Column>
                <Grid.Column>
                    <Button.Group>
                        <Button basic onClick={() => {
                            this.reloadData()
                        }}>
                            <Icon name={'redo'}/>
                        </Button>
                        <Button basic color={"green"} onClick={() => this.onAddExamClick()}>
                            <Icon name='plus' color={'green'}/> Thêm đề thi
                        </Button>
                    </Button.Group>

                </Grid.Column>
            </Grid.Row>
        )
    }

}

export default ExamPage
