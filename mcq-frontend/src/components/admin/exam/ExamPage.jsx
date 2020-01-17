import React, {Component, createRef} from 'react'
import {
    Button,
    Grid,
    Header,
    Icon,
    Input,
    Loader,
    Message,
    Modal,
    Pagination
} from 'semantic-ui-react'
import {SERVER_API} from '../../../config'
import ObjectChooser from '../components/ObjectChooser'
import TableExam from "./component/TableExam";
import ExamEditor from "./component/ExamEditor";
import {getToken, parseBlob, userCall, userCallWithData} from "../../../utils/ApiUtils";
import {Log} from "../../../utils/LogUtil";
import axios from "axios";
import Dialog from "../../Dialog";
import fileDownload from "js-file-download";

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
        examToEdit: {
            name: '',
            examUrl: '',
            answer: '',
            explainUrl: '',
            time: 0,
            note: '',
            password: ''
        },
        success: '',
        reload: 0,
        time: 0,
        sortColumn: 'datetime',
        sortDirection: 'descending',
        textSearch: ''
    };

    constructor(props) {
        super(props);
        this.handleExamChange = this.handleExamChange.bind(this)
        this.setError = this.setError.bind(this)
        this.onClassItemSelect = this.onClassItemSelect.bind(this)
        this.onSubjectItemSelect = this.onSubjectItemSelect.bind(this)
        this.onContentItemSelect = this.onContentItemSelect.bind(this)
        this.onLessonItemSelect = this.onLessonItemSelect.bind(this)
        this.setModalStatus = this.setModalStatus.bind(this)
        this.setLoading = this.setLoading.bind(this)
    }

    importData() {
        Log('File URI', this.state.file)
        if (this.state.file === undefined) {
            return
        }
        this.setLoading(true)
        const formData = new FormData();
        formData.append("upload", this.state.file);
        Log('request', formData)
        axios.post(`${SERVER_API}/exams/import`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: getToken()
            }
        })
            .then((res) => {
                const data = res.data
                Log('response', data)
                if (!data.success)
                    this.setError(data.message)
                else
                    this.setState({
                        update: data.data,
                        dialogVisible: true,
                    })
            })
            .catch(err => this.setError(err))
            .finally(() => this.setState({
                loading: false,
                file: undefined
            }))
    }

    exportData() {
        this.setLoading(true)
        axios.get(
            `${SERVER_API}/exams/export`,
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
                fileDownload(blob, 'exams.xlsx')
            }
        })
            .catch(err => this.setError(err))
            .finally(() => this.setLoading(false))
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.file !== this.state.file) {
            this.importData()
        }
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
            {
                ...this.state.examToEdit,
                time: parseInt(this.state.examToEdit.time)
            },
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

    getExam(pageNumber = 1) {
        this.setLoading(true)
        const searchPart = this.state.textSearch ? `&search=${this.state.textSearch}` : ''
        const {sortColumn, sortDirection} = this.state
        const sortPart = `&sort=${sortDirection === 'ascending' ? '+' : '-'}${sortColumn}`
        let url = `${SERVER_API}/exams?page=${pageNumber}${sortPart}${searchPart}`
        if (this.state.contentId)
            url = `${SERVER_API}/exams/lessons/${this.state.lessonId}?page=${pageNumber}${sortPart}${searchPart}`
        userCall(
            'GET',
            encodeURI(url),
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
        const {answer, lessonId, datetime, examUrl, explainUrl, name, note, password, time, total} = this.state.examToEdit
        const data = {answer, lessonId, datetime, explainUrl, examUrl, name, note, password, time, total}
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
                    lessonId: this.state.lessonId
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
                    activePage={exams.page || 1}
                    onPageChange={(e, data) => this.getExam(data.activePage)}
                    totalPages={exams.totalPage}
                />
            )
        return <div/>
    }

    handleOnSortChange(data) {
        this.setState({
            ...data
        }, () => this.getExam(1))
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
                            <input id="upload" type="file" style={{float: 'right', display: 'none'}} ref={'fileUpload'}
                                   onChange={(e) => this.setState({file: e.target.files[0]})}/>
                            <Button
                                basic
                                color={'green'}
                                style={{float: 'right'}}
                                icon={'upload'}
                                content={'Tải lên'}
                                onClick={() => this.refs.fileUpload.click()}
                            />
                            <Button
                                basic
                                color={'green'}
                                style={{float: 'right'}}
                                icon={'download'}
                                content={'Lưu'}
                                onClick={() => this.exportData()}
                            />
                            <br/>
                            <Input
                                fluid
                                icon={'search'}
                                iconPosition={'left'}
                                style={{marginTop: '30px'}}
                                placeholder='Tên đề thi'
                                value={this.state.textSearch}
                                onChange={(e, {value}) => this.setState({textSearch: value})}
                                onKeyPress={e => {
                                    if (e.key === 'Enter') {
                                        this.getExam(1)
                                    }
                                }}
                            />
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row columns={1}>
                        <Grid.Column width={16}>
                            <TableExam
                                data={this.state.exams}
                                onSortChange={data => this.handleOnSortChange(data)}
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
                {this.renderDialogResult()}
            </div>
        )
    }

    renderDialogResult() {
        return (
            <Dialog
                header={"Kết quả"}
                visible={this.state.dialogVisible}
                onClose={() => this.setState({dialogVisible: false})}
                onNo={() => this.setState({dialogVisible: false})}
                onYes={() => this.setState({dialogVisible: false})}
            >
                <Grid>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            Số bài giảng đã import:
                        </Grid.Column>
                        <Grid.Column>
                            {this.state.update ? this.state.update.total : ''}
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            Số bài giảng đã cập nhật:
                        </Grid.Column>
                        <Grid.Column>
                            {this.state.update ? this.state.update.updated : ''}
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            Số bài giảng đã tạo mới:
                        </Grid.Column>
                        <Grid.Column>
                            {this.state.update ? this.state.update.new : ''}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Dialog>
        )
    }

    onClassItemSelect({value}) {
        this.setState({
            classId: value,
            subjectId: '', //reset subject id
            contentId: '', //reset content id,
            lessonId: ''
        })
    }

    onSubjectItemSelect({value}) {
        this.setState({
            subjectId: value,
            contentId: '',
            lessonId: ''
        })
    }

    onContentItemSelect({value}) {
        this.setState({
            contentId: value,
            lessonId: ''
        })
    }

    onLessonItemSelect({value}) {
        this.setState({
            lessonId: value
        }, () => this.getExam(1))
    }

    reloadData() {
        this.setState({
            classId: '',
            contentId: '',
            subjectId: '',
            lessonId: '',
            reload: this.state.reload + 1,
            error: '',
            success: ''
        }, () => this.getExam(1))
    }

    renderAddExamSection() {
        return (
            <Grid.Row columns={5} stretched>
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
                                   placeholder={'Chương'}
                                   name={'contents'}
                                   parentId={this.state.subjectId}
                                   onContentSelect={this.onContentItemSelect}/>
                </Grid.Column>
                <Grid.Column>
                    <ObjectChooser onError={this.setError}
                                   placeholder='Bài'
                                   name='lessons'
                                   parentId={this.state.contentId}
                                   onDelete={() => this.reloadData()}
                                   onContentSelect={this.onLessonItemSelect}/>

                </Grid.Column>
                <Grid.Column>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                        <Button basic onClick={() => {
                            this.reloadData()
                        }}>
                            <Icon name={'redo'}/>
                        </Button>
                        <Button basic color={"green"} onClick={() => this.onAddExamClick()}>
                            <Icon name='plus' color={'green'}/>
                        </Button>
                    </div>
                </Grid.Column>
            </Grid.Row>

        )
    }

}

export default ExamPage
