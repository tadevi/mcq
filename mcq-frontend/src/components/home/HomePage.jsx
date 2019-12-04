import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {withCookies} from 'react-cookie'
import AppBar from './AppBar'
import {SERVER_API} from "../../config";
import {anonymousCall} from "../../utils/ApiUtils";
import '../../App.css'
import {Log} from "../../utils/LogUtil";

class HomePage extends Component {
    state = {
        homepage: '<div/>',
        menu: []
    }

    componentDidMount() {
        this.getHomePage()
    }

    getHomePage() {
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

    componentWillUnmount() {
        window.runOne = undefined
    }

    renderEmbedded() {
        setTimeout(() => {
            if (!window.runOne) {
                document.querySelectorAll('oembed[url]').forEach(element => {
                    // Create the <a href="..." class="embedly-card"></a> element that Embedly uses
                    // to discover the media.
                    const anchor = document.createElement('a');
                    anchor.setAttribute('href', element.getAttribute('url'));
                    anchor.className = 'embedly-card';

                    element.appendChild(anchor)
                })
                window.runOne = true
            }
        }, 1000)
        return <div/>
    }

    render() {
        let content = ''
        if (typeof this.state.homepage === 'string')
            content = this.state.homepage
        return (
            <div style={{marginTop: '5.5em'}}>
                <AppBar/>
                <div dangerouslySetInnerHTML={{__html: content}}/>
                {
                    this.renderEmbedded()
                }
                {/*<footer>*/}
                {/*    <div className="ui inverted  vertical footer segment">*/}
                {/*        <div className="ui center aligned container">*/}
                {/*            <h4 className="ui inverted header">&copy; Copyright 2019 | All rights reserved </h4>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</footer>*/}
            </div>
        )
    }
}

export default withCookies(withRouter(HomePage))
