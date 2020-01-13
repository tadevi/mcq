import React from 'react'
import ExamLectureComponent from "./ExamLectureComponent";
import {anonymousCall} from "../../../../../utils/ApiUtils";
import {SERVER_API} from "../../../../../config";
import {Accordion, Icon} from "semantic-ui-react";

const titleWrapper = {
    flexDirection: 'row',
    alignItems: 'center',
    display: 'flex',
    flex: '1 1 auto',
    fontSize: '16px',
    boxSizing: 'border-box',
    border: 'solid 1px #e8e9eb',
    margin: '2px',
    color: '#007791',
    backgroundColor: 'transparent',
    fontWeight: '400',
    textDecoration: 'none'
}


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
                                    style={titleWrapper}
                                    active={activeIndex === index}
                                    index={index}
                                    onClick={() => this.handleClick(index)}
                                >
                                    <p><span style={{
                                        color: '#007791',
                                        paddingLeft: '10px',
                                        paddingRight: '10px'
                                    }}>{activeIndex === index ? '-' : '+'}</span>{"Bài "+item.name} </p>
                                </Accordion.Title>
                                <Accordion.Content active={activeIndex === index}>
                                    <div style={{marginLeft: '4em'}}>
                                        <ExamLectureComponent lessonId={item._id}/>
                                    </div>
                                </Accordion.Content>
                            </div>
                        )
                    })
                }
            </Accordion>
        )
    }
}