import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Calendar, ChevronLeft, Download, Pencil } from 'lucide-react'

import SideBar from '../components/SideBar'
import SummaryCard from '../components/SummaryCard'
import DecisionList from '../components/DecisionList'
import TodoList from '../components/TodoList'
import NextAgenda from '../components/NextAgenda'
import TranscriptViewer from '../components/TranscriptViewer'
import { exportUrl, fetchMeetingDetail, updateParticipants } from '../services/meetingApi'

const Container = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
`

const Main = styled.main`
    flex: 1;
    height: 100%;
    background-color: #FFFFFF;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
`

const TopBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 28px;
    background-color: #F7F6F2;
`

const BackButton = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: none;
    background: transparent;
    font-size: 14px;
    color: #57534A;
    cursor: pointer;
    font-family: 'IBM Plex Sans KR', 'IBM Plex Mono', sans-serif;
`

const DownloadButton = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 10px 18px;
    border: none;
    border-radius: 9px;
    background-color: #0F766E;
    color: #FFFFFF;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'IBM Plex Sans KR', 'IBM Plex Mono', sans-serif;
`

const TitleRow = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 28px 0;
    background-color: #F7F6F2;
`

const MeetingTitle = styled.h1`
    font-size: 25px;
    font-weight: 700;
    color: #1C1B18;
`

const MetaRow = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 12px 28px 20px;
    font-size: 13.5px;
    color: #7C766A;
    flex-wrap: wrap;
    background-color: #F7F6F2;
    border-bottom: 1px solid #EBE7DF;
`

const DateText = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 6px;
`

const ParticipantsLabel = styled.span`
    color: #7C766A;
`

const AttendeeChip = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 11px;
    background-color: #FFFFFF;
    border-radius: 20px;
    font-size: 13px;
    color: #1C1B18;
    border: 1px solid #E4E0D7;
`

const AddChip = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 11px;
    background-color: transparent;
    border: 1px dashed #C9C3B5;
    border-radius: 20px;
    font-size: 13px;
    color: #928C80;
    cursor: pointer;
    font-family: 'IBM Plex Sans KR', 'IBM Plex Mono', sans-serif;
`

const ParticipantsEditRow = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
`

const ParticipantsInput = styled.input`
    flex: 1;
    max-width: 320px;
    padding: 7px 12px;
    border: 1px solid #DDD8CD;
    border-radius: 8px;
    font-size: 13.5px;
    outline: none;
    font-family: 'IBM Plex Sans KR', 'IBM Plex Mono', sans-serif;

    &:focus {
        border-color: #0F766E;
    }
`

const SaveButton = styled.button`
    padding: 7px 14px;
    border: none;
    border-radius: 8px;
    background-color: #0F766E;
    color: white;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
`

const CancelSmallButton = styled.button`
    padding: 7px 14px;
    border: 1px solid #DDD8CD;
    border-radius: 8px;
    background-color: white;
    color: #57534A;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
`

const Span = styled.span`
    display: flex;
    gap: 7px;
    align-items: center;
`

const Body = styled.div`
    flex: 1;
    display: flex;
`

const LeftColumn = styled.div`
    flex: 1;
    padding: 24px 28px;
    display: flex;
    flex-direction: column;
    gap: 26px;
`

const LoadingText = styled.p`
    padding: 40px;
    text-align: center;
    color: #928C80;
    font-size: 14px;
`

function formatTime(seconds) {
    const hour = Math.floor(seconds / 3600)
    const minute = Math.floor((seconds % 3600) / 60)
    const second = Math.floor(seconds % 60)

    const pad = (n) => String(n).padStart(2, '0')

    return `${pad(hour)}:${pad(minute)}:${pad(second)}`
}

function MeetingDetailPage() {
    const navigate = useNavigate()
    const { id } = useParams()

    const [meeting, setMeeting] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [checkedIds, setCheckedIds] = useState([])
    const [viewType, setViewType] = useState('cleaned')
    const [isEditingParticipants, setIsEditingParticipants] = useState(false)
    const [participantsInput, setParticipantsInput] = useState('')

    useEffect(() => {
        const loadMeeting = async () => {
            try {
                setIsLoading(true)
                const data = await fetchMeetingDetail(id)
                setMeeting(data)
            } finally {
                setIsLoading(false)
            }
        }

        loadMeeting()
    }, [id])

    const handleToggle = (todoId) => {
        setCheckedIds(prev =>
            prev.includes(todoId) ? prev.filter(x => x !== todoId) : [...prev, todoId]
        )
    }

    if (isLoading) {
        return (
            <Container>
                <SideBar />
                <Main>
                    <LoadingText>불러오는 중</LoadingText>
                </Main>
            </Container>
        )
    }

    if (!meeting) {
        return (
            <Container>
                <SideBar />
                <Main>
                    <LoadingText>회의를 찾을 수 없습니다.</LoadingText>
                </Main>
            </Container>
        )
    }

    const todos = (meeting.summary?.todos || []).map((todo, index) => ({
        id: index,
        task: todo.task,
        assignee: todo.assignee,
        due: todo.due
    }))

    const segments = (meeting.transcript?.segments || []).map(seg => ({
        time: formatTime(seg.start),
        text: seg.text
    }))

    const handleParticipants = async () => {
        if (!participantsInput.trim()) {
            setIsEditingParticipants(false)
            return
        }

        try {
            const existing = (meeting.participants || '').split(',').filter(Boolean)
            const newNames = participantsInput.split(',').map(n => n.trim()).filter(Boolean)
            const combined = [...existing, ...newNames].join(',')

            const result = await updateParticipants(meeting.id, combined)
            setMeeting(prev => ({ ...prev, participants: result.participants }))
            setParticipantsInput('')
            setIsEditingParticipants(false)
        } catch (error) {
            console.error(error)
        }
    }

    const handleStartEditing = () => {
        setParticipantsInput('')
        setIsEditingParticipants(true)
    }


    return (
        <Container>
            <SideBar />
            <Main>
                <TopBar>
                    <BackButton onClick={() => navigate('/')}>
                        <ChevronLeft size={17} /> 회의 목록
                    </BackButton>
                    <DownloadButton onClick={() => window.open(exportUrl(meeting.id))}>
                        <Download size={16} /> 워드(.docx) 다운로드
                    </DownloadButton>
                </TopBar>

                <TitleRow>
                    <MeetingTitle>{meeting.title}</MeetingTitle>
                    <Pencil size={16} color="#928C80" style={{ cursor: 'pointer' }} />
                </TitleRow>

                <MetaRow>
                    <DateText>
                        <Calendar size={14} />
                        {new Date(meeting.created_at).toLocaleString('ko-kr')}
                    </DateText>
                    <Span>
                        <ParticipantsLabel>참석자</ParticipantsLabel>
                        {!isEditingParticipants ? (
                            <>
                                {(meeting.participants || '').split(',').filter(Boolean).map((name, index) => (
                                    <AttendeeChip key={index}>
                                        {name.trim()}
                                    </AttendeeChip>
                                ))}
                                <AddChip onClick={handleStartEditing}>+ 입력</AddChip>
                            </>
                        ) : (
                            <ParticipantsEditRow>
                                <ParticipantsInput
                                    value={participantsInput}
                                    onChange={(e) => setParticipantsInput(e.target.value)}
                                    placeholder="이름을 쉼표로 구분해서 입력 (예: 김민수,이서연)"
                                    autoFocus
                                />
                                <SaveButton onClick={handleParticipants}>저장</SaveButton>
                                <CancelSmallButton onClick={() => setIsEditingParticipants(false)}>취소</CancelSmallButton>
                            </ParticipantsEditRow>
                        )}
                    </Span>
                </MetaRow>

                <Body>
                    <LeftColumn>
                        {meeting.summary && (
                            <SummaryCard summary={meeting.summary.summary_text} />
                        )}

                        {meeting.summary?.decisions?.length > 0 && (
                            <DecisionList decisions={meeting.summary.decisions.map((text, index) => ({
                                id: index,
                                text
                            }))} />
                        )}

                        {todos.length > 0 && (
                            <TodoList
                                todos={todos}
                                checkedIds={checkedIds}
                                onToggle={handleToggle}
                            />
                        )}

                        {meeting.summary?.next_agenda?.length > 0 && (
                            <NextAgenda items={meeting.summary.next_agenda} />
                        )}
                    </LeftColumn>

                    <TranscriptViewer
                        segments={segments}
                        viewType={viewType}
                        onViewTypeChange={setViewType}
                    />
                </Body>
            </Main>
        </Container>
    )
}

export default MeetingDetailPage