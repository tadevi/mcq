import React from 'react'
import {Accordion, Icon} from 'semantic-ui-react'
import LessonComponent from "./LessonComponent";
import {anonymousCall} from "../../../../../utils/ApiUtils";
import {SERVER_API} from "../../../../../config";
import {withRouter} from "react-router-dom";
import LazyLoad from 'react-lazyload'

class ChapterComponent extends React.Component {
    state = {
        chapters: [],
        activeIndex: 0,
        loaded: false
    }

    setError(error) {
        this.setState({
            error
        })
    }

    setLoading(loading) {
        this.setState({
            loading
        })
    }

    componentDidMount() {
        const subjectId = this.props.match.params.id
        this.setLoading(true)
        anonymousCall(
            'GET',
            `${SERVER_API}/contents/${subjectId}`,
            data => {
                this.setState({
                    chapters: data
                })
            },
            err => this.setError(err),
            err => this.setError(err),
            () => this.setLoading(false)
        )
    }

    handleClick = (index) => {
        this.setState({
            activeIndex: index === this.state.activeIndex ? -1 : index
        })
    }

    render() {
        const {chapters, activeIndex} = this.state
        if (!this.state.loaded) {
            this.setState({
                loaded: true
            })
        }
        return (
            <Accordion styled fluid>
                {
                    chapters.map((item, index) => {
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
                                    <LessonComponent chapterId={item._id}/>
                                </Accordion.Content>
                            </div>
                        )
                    })
                }
            </Accordion>
        )
    }
}

export default withRouter(ChapterComponent)