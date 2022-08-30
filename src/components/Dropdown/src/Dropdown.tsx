import {
    Dropdown,
    Menu,
    // Popconfirm
} from 'antd'
import type { DropMenu } from './typing'
import React from 'react'
import PropTypes from 'prop-types'
// import { omit } from 'lodash-es'
import { MenuInfo } from 'rc-menu/lib/interface'

// const { Item, Divider } = Menu

interface DropdownComponentI {
    dropMenuList: (DropMenu & Recordable)[]
    trigger: 'click' | 'hover'
    selectedKeys: string[]
    popConfirmStatus: boolean
}

const DropdownComponent = ({
    dropMenuList,
    trigger,
    selectedKeys,
    popConfirmStatus,
}: DropdownComponentI) => {
    const handleClickMenu = ({ item, key, keyPath, domEvent }: MenuInfo): void => {
        console.log(item, key, keyPath, domEvent, selectedKeys, popConfirmStatus)
    }

    const menu = (
        <Menu
            items={dropMenuList?.map(ci => ({
                key: ci?.event,
                disabled: ci?.disabled,
                icon: ci?.popConfirm?.icon,
            }))}
            onClick={handleClickMenu}
            triggerSubMenuAction={trigger}
        />
    )

    return (
        <>
            <Dropdown overlay={menu}>
                <span>
                    <slot></slot>
                </span>
            </Dropdown>
        </>
    )
}

DropdownComponent.PropTypes = {
    dropMenuList: PropTypes.array.isRequired,
    trigger: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
    popConfirmStatus: PropTypes.bool.isRequired,
}

export default DropdownComponent
