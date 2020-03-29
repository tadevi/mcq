import React from 'react'
import {Button, Grid, Message, Modal} from "semantic-ui-react";
import {withRouter} from 'react-router-dom'


const contentStyle = color => ({
    color,
    fontWeight: '600'
})

class ExamResult extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            isOpen: props.isOpen || false,
            result: props.result || {},
            error: props.error || ''
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.loading !== this.props.loading) {
            const {loading} = this.props
            this.setState({
                loading
            })
        }
        if (prevProps.isOpen !== this.props.isOpen) {
            const {isOpen} = this.props
            this.setState({
                isOpen
            })
        }
        if (prevProps && prevProps.result !== this.props.result) {
            const {result} = this.props
            this.setState({
                result
            })
        }
        if (prevProps && prevProps.error !== this.props.error) {
            const {error} = this.props
            this.setState({
                error
            })
        }
    }

    render() {
        const {loading, result, isOpen} = this.state
        const {history} = this.props
        return (
            <Modal
                open={isOpen}
            >
                <Modal.Header>Nộp bài</Modal.Header>
                <Modal.Content>
                    {
                        !loading ? (
                            <Grid columns={2}>
                                <Grid.Row>
                                    <Grid.Column>
                                        <b>Tổng số câu hỏi:</b>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <span style={contentStyle('blue')}>{result.total}</span>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        <b>Tổng số câu trả lời đúng:</b>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <span style={contentStyle('blue')}>{result.correct}</span>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        <b>Điểm:</b>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <span style={contentStyle('red')}>{result.point}</span>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        ) : (
                            'Chờ giây lát'
                        )
                    }
                </Modal.Content>
                <Message
                    error
                    content={this.state.error}
                    hidden={this.state.error === ''}/>
                <Modal.Actions>
                    <Button
                        onClick={() => {
                            this.setState({isOpen: false})
                            const {onClose} = this.props
                            if (typeof onClose === 'function') {
                                onClose()
                            }
                        }
                        }
                        negative
                        labelPosition='left'
                        content='Đóng'
                    />
                    <Button
                        onClick={() => {
                            history.push(`/result/${result._id || ''}`)
                        }}
                        disabled={loading || this.state.error !== ''}
                        positive
                        labelPosition='right'
                        icon='checkmark'
                        content='Xem kết quả'
                    />
                </Modal.Actions>
            </Modal>
        )
    }
}

export default withRouter(ExamResult)
