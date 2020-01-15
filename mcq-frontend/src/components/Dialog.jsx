import React from 'react'
import {Button, Icon, Modal} from "semantic-ui-react";

export default function Dialog({header, visible, onClose, onYes, onNo, noLabel, yesLabel = 'OK', children}) {
    return (
        <Modal open={visible} onClose={onClose}>
            <Modal.Header>{header}</Modal.Header>
            <Modal.Content>
                {children}
            </Modal.Content>
            <Modal.Actions>
                {
                    noLabel ?
                        (
                            <Button color='red' onClick={onNo}>
                                <Icon name='remove'/> {noLabel}
                            </Button>
                        ) : null
                }

                <Button color='green' onClick={onYes}>
                    <Icon name='checkmark'/> {yesLabel}
                </Button>
            </Modal.Actions>
        </Modal>
    )
}