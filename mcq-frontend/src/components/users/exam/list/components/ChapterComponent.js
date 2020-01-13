import React from 'react'
import {Accordion, Grid, Icon} from 'semantic-ui-react'
import LessonComponent from "./LessonComponent";
import {anonymousCall} from "../../../../../utils/ApiUtils";
import {SERVER_API} from "../../../../../config";
import {withRouter} from "react-router-dom";
import SimpleAppBar from "../SimpleAppBar";
import './exam.css'

const titleWrapper = {
    flexDirection: 'row',
    alignItems: 'center',
    display: 'flex',
    color: '#505763',
    flex: '1 1 auto',
    fontSize: '18px',
    fontWeight: '600',
    boxSizing: 'border-box',
    backgroundColor: ' #f9f9f9',
    border: 'solid 1px #e8e9eb',
    margin: '2px'
}

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
        const firstChapter = chapters.length > 0 ? chapters[0] : undefined
        return (
            <div>
                <SimpleAppBar header={firstChapter ? `${firstChapter.className} - ${firstChapter.subjectName}` : ''}/>
                <Grid>
                    <Grid.Column width={1}/>
                    <Grid.Column width={14}>
                        <Accordion fluid>
                            {
                                chapters.map((item, index) => {
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
                                                }}>{activeIndex === index ? '-' : '+'}</span>{item.name} </p>
                                            </Accordion.Title>
                                            <Accordion.Content active={activeIndex === index}>
                                                <div style={{marginLeft: '3em '}}>
                                                    <LessonComponent chapterId={item._id}/>
                                                </div>
                                            </Accordion.Content>
                                        </div>
                                    )
                                })
                            }
                        </Accordion>
                    </Grid.Column>
                    <Grid.Column width={1}/>
                </Grid>

            </div>
        )
    }
}

export default withRouter(ChapterComponent)