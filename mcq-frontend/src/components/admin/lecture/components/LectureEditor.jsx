import React from 'react'
import {Dimmer, Form, Grid, Loader} from "semantic-ui-react";

//check done
class LectureEditor extends React.Component {
    constructor(props) {
        super(props)
        const {name = '', lectureUrl, password} = props.initData
        this.state = {
            name,
            lectureUrl,
            error: '',
            success: '',
            password: password || '',
            loading: false
        }
        this.handleChange = this.handleChange.bind(this)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.error !== prevProps.error) {
            this.setState({
                error: this.props.error
            })
        }
        if (this.props.success !== prevProps.success) {
            this.setState({
                success: this.props.success
            })
        }
        if (this.props.loading !== prevProps.loading) {
            this.setState({
                loading: this.props.loading
            })
        }
        if (this.props.initData !== prevProps.initData) {
            const {name = '', lectureUrl} = this.props.initData
            this.setState({
                name,
                lectureUrl
            })
        }
    }

    handleChange(e, {name, value}) {
        this.setState({
            [name]: value
        })

        const {onChange} = this.props
        if (typeof onChange === 'function') {
            onChange(null, {name, value})
        }
    }

    render() {
        const {name, lectureUrl, loading, password} = this.state
        return (
            <div>
                <Grid centered>
                    <Grid.Row columns={1}>
                        <Grid.Column width={12}>
                            <Form>
                                <Form.Field>
                                    <label>Tên bài giảng</label>
                                    <Form.Input
                                        fluid
                                        name="name"
                                        value={name || ''}
                                        onChange={this.handleChange}
                                        type='text'
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Link bài giảng</label>
                                    <Form.Input
                                        fluid
                                        name="lectureUrl"
                                        value={lectureUrl || ''}
                                        onChange={this.handleChange}
                                        type={'text'}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Mật khẩu</label>
                                    <Form.Input
                                        fluid
                                        name="password"
                                        value={password || ''}
                                        onChange={this.handleChange}
                                        type={'text'}
                                    />
                                </Form.Field>
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Dimmer active={loading}>
                    <Loader/>
                </Dimmer>
            </div>
        )
    }
}

export default LectureEditor
