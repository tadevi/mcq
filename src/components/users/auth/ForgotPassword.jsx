import React from "react";
import SimpleAppBar from "../exam/list/SimpleAppBar";
import {Button, Form, Grid, Message} from "semantic-ui-react";
import {anonymousCall} from "../../../utils/ApiUtils";
import {SERVER_API} from "../../../config";
import validator from 'validator'
export default class ForgotPassword extends React.Component {
    state = {
        email: '',
        msg: '',
        loading: false
    }

    getPassword() {
        if(!validator.isEmail(this.state.email)){
            this.setState({
                msg:'Email không chính xác!'
            })
            return
        }
        this.setState({
            loading: true
        })
        anonymousCall(
            'GET',
            `${SERVER_API}/forgot/${this.state.email}`,
            data => this.setState({
                msg: 'Kiểm tra email để lấy mật khẩu mới'
            }),
            err => this.setState({
                msg: err
            }),
            err => this.setState({
                msg: err
            }),
            () => {
                this.setState({
                    loading: false
                })
            }
        )
    }

    render() {
        return (
            <div>
                <SimpleAppBar header={'Quên mật khẩu'}/>
                <Grid columns={3} centered>
                    <Grid.Column width={2}/>
                    <Grid.Column width={6}>
                        <Form style={{marginTop: '60px'}}>
                            <Form.Input
                                label={'Email'}
                                name={'email'}
                                fluid
                                value={this.state.email}
                                onChange={(e, {name, value}) => this.setState({[name]: value})}
                            />
                            <Message
                                warning
                                visible={this.state.msg !== ''}
                                content={this.state.msg}
                            />
                            <Button style={{display:'block',margin:'0 auto'}} type={'submit'} primary loading={this.state.loading}
                                    onClick={() => this.getPassword()}>
                                Lấy mật khẩu
                            </Button>
                        </Form>
                    </Grid.Column>
                    <Grid.Column width={2}/>
                </Grid>
            </div>
        )
    }
}
