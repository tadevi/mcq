import React from 'react';
import {Image} from 'semantic-ui-react'

class NotFound extends React.Component {
    render() {
        return (
            <a href='/'>
                <Image fluid src='https://yourblogworks.com/wp-content/uploads/2016/12/404-error-1024x749.jpg'/>
            </a>
        );
    }
}

export default NotFound
