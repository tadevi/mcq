import React, {Component, createRef} from 'react'

import {Button, Form, Message, Segment} from 'semantic-ui-react';

import {SERVER_API} from '../../../config';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-decoupled-document'
import {anonymousCall, userCallWithData} from "../../../utils/ApiUtils";
import {Log} from "../../../utils/LogUtil";

class Editor extends Component {
    state = {
        data: '',
        loading: false,
        error: '',
        success: false,
        homepage: '<div/>',
        toolbar: null
    }
    contextRef = createRef()

    componentDidMount() {
        //loading content homepage
        anonymousCall(
            'GET',
            `${SERVER_API}/homepage`,
            data => this.setState({
                homepage: data
            }),
            err => Log(err),
            err => Log(err),
            () => {
            }
        )
    }

    setError(error) {
        this.setState({
            error
        })
    }

    setLoading(status) {
        this.setState({
            loading: status
        })
    }

    changeHomePage() {
        this.setLoading(true)
        userCallWithData(
            'PUT',
            `${SERVER_API}/homepage`,
            {
                homepage: this.state.data
            },
            data => this.setState({success: true}),
            err => this.setError(err),
            err => this.setError(err),
            () => this.setLoading(false)
        )
    }

    render() {
        return (
            <Form className="App" success={this.state.success} loading={this.state.loading}
                  error={this.state.error !== ''}>
                <h2 id={'header'}>Nội dung trang chủ</h2>
                <Segment>
                    <CKEditor
                        onInit={editor => {
                            editor.ui.getEditableElement().parentElement.insertBefore(
                                editor.ui.view.toolbar.element,
                                editor.ui.getEditableElement()
                            );
                        }}
                        editor={ClassicEditor}
                        data={this.state.homepage}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            this.setState({data})
                        }}
                    />
                </Segment>


                <Message
                    error
                    header="Error"
                    content={this.state.error}
                />
                <Message
                    success
                    header="Successfully"
                    content="Thay đổi nội dung trang chủ hoàn tất"
                />
                <Button primary style={{marginTop: '10px'}} onClick={() => this.changeHomePage()}>
                    Cập nhật
                </Button>
            </Form>
        )
    }
}


export default Editor
