import styled from '@emotion/styled'
import MeetingCardList from '../components/MeetingCardList'
import SideBar from '../components/SideBar'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchMeetingList } from '../services/meetingApi'

const Container = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
`

const ConferenceBox = styled.div`
    width: 203px;
    display: flex;
    flex-direction: column;
    gap: 4px;
`

const Main = styled.main`
    width: 100%;
    height: 100%;
    background-color: #F7F6F2;
    padding: 18px 28px 0;
`

const Alarm = styled.div`
    width: 100%;
    height: 45px;
    background-color: #FBF3DF;
    border: solid 1px #EFDDB4;
    padding: 11px 15px;
    border-radius: 15px;
    display: flex;
    gap: 10px;
`

const ConferenceTitle = styled.p`
    color: #8A6312;
    font-size: 14px;
    font-weight: 600;
`

const Progress = styled.p`
    color: #8A6312;
    font-size: 14px;
    font-weight: 400;
`

const Background = styled.p`
    color: #A98A3E;
    font-size: 13px;
    font-weight: 400;
    margin-left: auto;
`
const ListSearch = styled.div`
    width: 100%;
    padding: 22px 0 16px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 13px;
`

const Title = styled.p`
    font-size: 25px;
    font-weight: 700;
`

const SearchRow = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
`

const FilterContainer = styled.div`
    display: inline-flex;
    padding: 3px;
    background-color: #FFFFFF;
    border: 1px solid #E4E0D7;
    border-radius: 10px;
    flex-shrink: 0;
`

const FilterButton = styled.button`
    padding: 6px 12px;
    border: none;
    border-radius: 7px;
    font-size: 13.5px;
    font-family: 'IBM Plex Sans KR', 'IBM Plex Mono', sans-serif;
    cursor: pointer;
    
    background-color: ${props => props.$active ? '#EEF2F0' : 'transparent'};
    color: ${props => props.$active ? '#13413B' : '#7C766A'};
    font-weight: ${props => props.$active ? '600' : '400'};
`

const SearchBox = styled.div`
    width: 100%;
    height: 45px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 13px;
    background-color: #FFFFFF;
    border: 1px solid #E4E0D7;
    border-radius: 9px;
`

const SearchIcon = styled.svg`
    width: 17px;
    height: 17px;
    flex-shrink: 0;
    color: #9B958A;
`

const SearchInput = styled.input`
    width: 100%;
    flex: 1;
    border: none;
    outline: none;
    font-size: 15px;
    color: #1C1B18;
    font-weight: 400;
    font-family: 'IBM Plex Sans KR', 'IBM Plex Mono', sans-serif;
    background-color: transparent;
    border-radius: 9px;
`

const ClearButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    flex-shrink: 0;
    color: #9B9690;

    &:hover {
        color: #6B6660;
    }
`

const CountRow = styled.div`
    display: flex;
    align-items: baseline;
    gap: 4px;
`

const Count = styled.p`
    color: #7C766A;
    font-size: 13.5px;
    font-weight: 400;
    display: inline;
`

const Number = styled.p`
    color: #1C1B18;
    font-weight: 600;
    font-size: 13.5px;
`

function HomePage() {
    const [activeTab, setActiveTab] = useState('title')
    const [keyword, setKeyword] = useState('')
    const [meetings, setMeetings] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    const handleClear = () => {
        setKeyword('')
    }

    const loadMeetings = async () => {
        try {
            setIsLoading(true)
            const data = await fetchMeetingList(keyword, activeTab)

            const formatted = data.map(m => ({
                id: m.id,
                title: m.title,
                status: m.status,
                progress: m.progress,
                date: formatDate(m.created_at),
                duration: formatDuration(m.duration),
                attendeeCount: m.attendee_count,
                snippet: m.snippet
            }))

            setMeetings(formatted)
        } finally {
            setIsLoading(false)
        }
    }

    function formatDate(isoString) {
        const d = new Date(isoString)
        const days = ['일', '월', '화', '수', '목', '금', '토']
        return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}. ${days[d.getDay()]}`
    }

    function formatDuration(seconds) {
        if(!seconds)
            return '-'

        const minutes = Math.round(seconds / 60)

        if (minutes < 60)
            return `${minutes}분`

        const hour = Math.floor(minutes / 60)
        const minute = minutes % 60
        
        return minute > 0 ? `${hour}시간 ${minute}분` : `${hour}시간`
    }

    useEffect(() => {
        loadMeetings()
    }, [keyword, activeTab])

    useEffect(() => {
        const interval = setInterval(() => {
            loadMeetings()
        }, 2000)

        return () => clearInterval(interval)
    }, [keyword, activeTab])

    const handleCardClick = (meeting) => {
        if (meeting.status !== 'processing') {
            navigate(`/meetings/${meeting.id}`)
        }
    }

    return (
        <>
            <Container>
                <SideBar onUploadComplete={loadMeetings} />
                <Main>
                    <Alarm>
                        <ConferenceTitle>제품 주간 회의 — 6월 4주차</ConferenceTitle>
                        <Progress>전사 중·64%·약 12분 남음</Progress>
                        <Background>백그라운드에서 계속 처리됩니다</Background>
                    </Alarm>
                    <ListSearch>
                        <Title>회의 목록</Title>
                        <SearchRow>
                            <FilterContainer>
                                <FilterButton
                                    $active={activeTab === 'title'}
                                    onClick={() => setActiveTab('title')}
                                >
                                    제목·날짜
                                </FilterButton>
                                <FilterButton
                                    $active={activeTab === 'transcript'}
                                    onClick={() => setActiveTab('transcript')}
                                >
                                    전사 내용
                                </FilterButton>
                            </FilterContainer>
                            <SearchBox>
                                <SearchIcon viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </SearchIcon>

                                <SearchInput
                                    type="text"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    placeholder={activeTab === 'title' ? '제목 또는 날짜로 검색' : '전사 내용으로 검색'}
                                />

                                {keyword && (
                                    <ClearButton onClick={handleClear} aria-label="검색어 지우기">
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <line x1="5" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            <line x1="19" y1="5" x2="5" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    </ClearButton>
                                )}
                            </SearchBox>
                        </SearchRow>
                        {keyword && (
                            <CountRow>
                            <Count>{activeTab === 'title' ? '제목·날짜에서' : '전사 내용에서'}</Count>
                            <Number>'{keyword}' {meetings.length}건</Number>
                        </CountRow>
                        )}
                        <MeetingCardList
                            meetings={meetings}
                            onCardClick={handleCardClick}
                        />
                    </ListSearch>
                </Main>
            </Container>
        </>
    )
}

export default HomePage