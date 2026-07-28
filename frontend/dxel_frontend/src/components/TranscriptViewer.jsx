import styled from '@emotion/styled'
import { Search } from 'lucide-react'

import { useState } from 'react'

const Panel = styled.div`
    width: 340px;
    flex-shrink: 0;
    border-left: 1px solid #EBE7DF;
    padding: 18px 22px 14px;
    display: flex;
    flex-direction: column;
    gap: 12px;
`

const PanelHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const PanelTitle = styled.p`
    font-size: 15px;
    font-weight: 700;
    color: #1C1B18;
`

const Toggle = styled.div`
    display: inline-flex;
    padding: 2px;
    background-color: #FFFFFF;
    border-radius: 8px;
    gap: 2px;
    border: 1px solid #E4E0D7;
`

const ToggleButton = styled.button`
    padding: 5px 11px;
    border: none;
    border-radius: 6px;
    font-size: 12.5px;
    cursor: pointer;
    font-family: 'IBM Plex Sans KR', 'IBM Plex Mono', sans-serif;

    background-color: ${props => props.$active ? '#EEF2F0' : 'transparent'};
    color: ${props => props.$active ? '#13413B' : '#7C766A'};
    font-weight: ${props => props.$active ? '600' : '400'};
`

const SearchBox = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 12px;
    background-color: #FFFFFF;
    border: 1px solid #E4E0D7;
    border-radius: 8px;
    color: #928C80;
`

const SearchInput = styled.input`
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 13.5px;
    font-family: 'IBM Plex Sans KR', 'IBM Plex Mono', sans-serif;

    &::placeholder {
        color: #A8A395;
    }
`

const SegmentList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    overflow-y: auto;
`

const Segment = styled.div`
    display: flex;
    gap: 11px;
    padding: ${props => props.$highlight ? '9px 11px' : '0px'};
    border-left: ${props => props.$highlight ? '3px solid #E0B53A' : 'none'};
    background-color: ${props => props.$highlight ? '#FDF6E3' : 'transparent'};
`

const Time = styled.span`
    font-size: 12px;
    color: ${props => props.$highlight ? '#B09A52' : '#0F766E'};
    flex-shrink: 0;
    font-family: 'IBM Plex Mono', monospace;
    padding-top: 2px;
    border-radius: ${props => props.$highlight ? '0px 8px 8px 0px' : '0px'};
`

const Text = styled.p`
    font-size: 14px;
    line-height: 22.4px;
    color: #3A362E;
`

function TranscriptViewer({ segments, viewType, onViewTypeChange, highlightTime, keyword }) {
    return (
        <Panel>
            <PanelHeader>
                <PanelTitle>전사문</PanelTitle>
                <Toggle>
                    <ToggleButton
                        $active={viewType === 'raw'}
                        onClick={() => onViewTypeChange('raw')}
                    >
                        원문
                    </ToggleButton>
                    <ToggleButton
                        $active={viewType === 'cleaned'}
                        onClick={() => onViewTypeChange('cleaned')}
                    >
                        정리본
                    </ToggleButton>
                </Toggle>
            </PanelHeader>

            <SearchBox>
                <Search size={15} />
                <SearchInput
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="전사문 안에서 검색"
                />
            </SearchBox>

            <SegmentList>
                {segments.map((seg, i) => {
                    const isHighlighted = seg.time === highlightTime
                    return (
                        <Segment key={i} $highlight={isHighlighted}>
                            <Time $highlight={isHighlighted}>{seg.time}</Time>
                            <Text>{seg.text}</Text>
                        </Segment>
                    )
                })}
            </SegmentList>
        </Panel>
    )
}

export default TranscriptViewer