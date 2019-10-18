import React from 'react'
import {Header} from 'semantic-ui-react'
import {CircleButton} from './CircleButton'

export const AnswerBoard=({totalQuestions=0})=>{
    return (
        <div>
            <Header color='blue'>
                {`Tổng số câu hỏi: ${totalQuestions} `}
            </Header>
            <div style={{display:'flex'}}>
                <CircleButton text='10' />
            </div>
        </div>
    )
}
