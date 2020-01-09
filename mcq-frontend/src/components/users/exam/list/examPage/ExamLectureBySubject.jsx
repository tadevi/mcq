import React from 'react'
import {anonymousCall, userCall} from "../../../../../utils/ApiUtils";
import {SERVER_API} from "../../../../../config";
import {Accordion, Grid, Icon, Message} from "semantic-ui-react";
import SimpleAppBar from "../SimpleAppBar";
import DisplayExamList from "./DisplayExamList";
import './examCss.css'
import {withRouter} from "react-router-dom";

class ExamLectureBySubject extends React.Component {
    _isMounted = false
    state = {
        contents: [],
        error: '',
        examId: '',
        navigate: '',
        activeIndex: 0,
        breadCrumb: ''
    }

    handleClick = (e, titleProps) => {
        const {index} = titleProps
        const {activeIndex} = this.state
        const newIndex = activeIndex === index ? -1 : index

        this.safeSetState({activeIndex: newIndex})
    }

    safeSetState(state) {
        if (this._isMounted) {
            this.setState({
                ...state
            })
        }
    }

    componentDidMount() {
        this._isMounted = true
        const id = this.props.match.params.id
        this.getContentBySubjectId(id)
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.examId !== this.state.examId) {
            const examId = this.state.examId
            this.props.history.push({
                pathname: `/exam/view/${examId}`
            })
        }
        if (prevState.navigate !== this.state.navigate) {
            this.props.history.push('/')
        }
    }

    setError(error) {
        this.safeSetState({
            error
        })
    }

    getLessonByContentId(id) {
        this.setLoading(true)
        userCall(
            'GET',
            `${SERVER_API}/lessons/${id}`,
            data => {
                this.setState({
                    lessons: {
                        ...this.state.lessons,
                        [id]: data
                    }
                })
            },
            err => this.setError(err),
            err => this.setError(err),
            () => this.setLoading(false)
        )
    }

    getContentBySubjectId(id) {
        anonymousCall(
            'GET',
            `${SERVER_API}/contents/${id}`,
            data => {
                this.setState({
                    contents: data
                })
                data.map((item, index) => this.getLessonByContentId(item._id))
            },
            err => this.setError(err),
            err => this.setError(err),
            () => {
            }
        )
    }

    renderContent() {
        const {activeIndex, contents} = this.state
        if (contents.length === 0) {

            return (
                <p className='no-content-display'>
                    Chưa có bài giảng/ đề thi cho môn học này.
                </p>
            )
        }
        return (<Accordion fluid>
            {
                contents.map((item, index) => {
                    return (
                        <Accordion fluid key={item._id}>
                            <div>
                                <Accordion.Title
                                    active={activeIndex === index}
                                    index={index}
                                    onClick={this.handleClick}
                                    style={{
                                        fontWeight: '600',
                                        fontSize: '15pt'
                                    }}
                                >
                                    <Icon name='dropdown'/>
                                    {item.name}
                                </Accordion.Title>
                                <Accordion.Content active={activeIndex === index}>
                                    <DisplayExamList contentId={item._id}
                                                     onHeaderChange={breadCrumb => this.setState({breadCrumb})}/>
                                </Accordion.Content>
                            </div>
                        </Accordion>)
                })
            }
        </Accordion>)
    }

    render() {
        const {breadCrumb} = this.state
        console.log('state', this.state)
        return (
            <div>
                <SimpleAppBar
                    header={`${breadCrumb.className || ''} ${breadCrumb ? ' - ' : ''}  ${breadCrumb.subjectName || ''}`}/>
                <Message
                    error
                    content={this.state.error}
                    hidden={this.state.error === ''}
                />
                <Grid columns={3}>
                    <Grid.Column width={1}/>
                    <Grid.Column width={14}>
                        {
                            this.renderContent()
                        }
                    </Grid.Column>
                    <Grid.Column width={1}/>
                </Grid>
            </div>
        )
    }
}

export default withRouter(ExamLectureBySubject)
