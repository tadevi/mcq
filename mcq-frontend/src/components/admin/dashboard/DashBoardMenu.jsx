import React from "react";
import { Dropdown, Header, Image, Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { removeToken } from "../../../utils/ApiUtils";
import { SERVER_FILES } from "../../../config";

export default function DashBoardMenu(props) {
    const logout = () => {
        removeToken()
        window.location.href = '/'
    }
    return (
        <Menu borderless>
            <Menu.Item header position='left' as='a' href={'/'}>
                <div>
                    <Image size='mini' verticalAlign='middle'
                        src='/logo.png' avatar />
                    <span style={{ fontSize: 20, marginLeft: '10px' }}>Quản trị</span>
                </div>
            </Menu.Item>
            <Header as={'h3'}>{props.header || ''}</Header>
            <Menu.Menu position='right'>
                <Dropdown text="Tài khoản của tôi" pointing className='link item' style={{fontSize:'13pt'}}>
                    <Dropdown.Menu>
                        <Dropdown.Item as={Link} to='/profile' icon='user' text="Thông tin" />
                        <Dropdown.Item icon='log out' text="Đăng xuất" onClick={logout} />
                    </Dropdown.Menu>
                </Dropdown>
            </Menu.Menu>
        </Menu>
    )
}
