import styled from '@emotion/styled'
import UploadBox from '../components/UploadBox'

import { useState } from 'react'

const Aside = styled.aside`
    width: 236px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 22px 16px;
    background-color: #FBFAF7;
    border: solid  1px #E9E5DD;
`

const NewButton = styled.button`
    width: 203.3px;
    height: 45px;
    padding: 11px 66px;
    background-color: #0F766E;
    border: none;
    border-radius: 9px;
    color: white;
    font-size: 15px;
    font-weight: 600;
    box-shadow: inset 0 1px 2px rgba(15, 118, 110, 0.35);
    cursor: pointer;
    line-height: normal;
`

function SideBar({ onUploadComplete }) {
    const [showUploadBox, setShowUploadBox] = useState(false)

    return (
        <Aside>
            <NewButton onClick={() => setShowUploadBox(true)}>+ 새 회의</NewButton>

            {showUploadBox && (
                <UploadBox onClose={() => setShowUploadBox(false)} onUploadComplete={onUploadComplete} />
            )}
        </Aside>
    )
}

export default SideBar