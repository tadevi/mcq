import React, {Component, createRef} from 'react';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document'
import '../../../App.css'
import {anonymousCall, userCallWithData} from "../../../utils/ApiUtils";
import {SERVER_API} from "../../../config";
import {Button, Loader, Message} from "semantic-ui-react";
import {Log} from "../../../utils/LogUtil";

class FullScreenEditor extends Component {
    state = {
        data: '',
        loading: false,
        error: '',
        success: false,
        homepage: '<div/>',
        toolbar: null
    }
    contextRef = createRef()

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
                homepage: window.editor.getData()
            },
            data => this.setState({success: true}),
            err => this.setError(err),
            err => this.setError(err),
            () => this.setLoading(false)
        )
    }

    componentDidMount() {
        anonymousCall(
            'GET',
            `${SERVER_API}/homepage`,
            data => {
                this.setState({
                    homepage: data
                })
                window.editor.setData(data)
            },
            err => Log(err),
            err => Log(err),
            () => {
            }
        )
        DecoupledEditor
            .create(document.querySelector('.document-editor__editable'), {})
            .then(editor => {
                const toolbarContainer = document.querySelector('.document-editor__toolbar');

                toolbarContainer.appendChild(editor.ui.view.toolbar.element);

                window.editor = editor;
            })
            .catch(err => {
            });
    }

    render() {
        return (
            <div>
                <div className="document-editor">
                    <div className="document-editor__toolbar"/>
                    <div className="document-editor__editable-container">
                        <div className="document-editor__editable">
                        </div>
                    </div>
                </div>
                <Loader active={this.state.loading}/>
                <Message
                    error
                    hidden={this.state.error === ''}
                    header="Error"
                    content={this.state.error}
                />
                <Message
                    success
                    hidden={this.state.success === false}
                    header="Successfully"
                    content="Thay đổi nội dung trang chủ hoàn tất"
                />
                <Button primary style={{marginTop: '10px'}} onClick={() => this.changeHomePage()}>
                    Cập nhật
                </Button>
            </div>
        );
    }
}

export default FullScreenEditor;
