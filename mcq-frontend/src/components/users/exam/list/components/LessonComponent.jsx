import React from 'react'
import ExamLectureComponent from "./ExamLectureComponent";
import {anonymousCall} from "../../../../../utils/ApiUtils";
import {SERVER_API} from "../../../../../config";
import {Accordion, Icon} from "semantic-ui-react";

export default class LessonComponent extends React.Component {
    state = {
        lessons: [],
        error: '',
        loading: false,
        activeIndex: 0
    }

    setError(error) {
        this.setState({
            error
        })
    }

    handleClick = (index) => {
        this.setState({
            activeIndex: index === this.state.activeIndex ? -1 : index
        })
    }

    setLoading(loading) {
        this.setState({
            loading
        })
    }

    componentDidMount() {
        const {chapterId} = this.props
        this.setLoading(true)
        anonymousCall(
            'GET',
            `${SERVER_API}/lessons/${chapterId}`,
            data => {
                this.setState({
                    lessons: data
                })
            },
            err => this.setError(err),
            err => this.setError(err),
            () => this.setLoading(false)
        )
    }

    render() {
        const {lessons, activeIndex} = this.state
        return (
            <Accordion>
                {
                    lessons.map((item, index) => {
                        return (
                            <div key={item._id}>
                                <Accordion.Title
                                    active={activeIndex === index}
                                    index={index}
                                    onClick={() => this.handleClick(index)}
                                >
                                    <Icon name='dropdown'/> {item.name}
                                </Accordion.Title>
                                <Accordion.Content active={activeIndex === index}>
                                        <ExamLectureComponent lessonId={item._id}/>
                                </Accordion.Content>
                            </div>
                        )
                    })
                }
            </Accordion>
        )
    }
}