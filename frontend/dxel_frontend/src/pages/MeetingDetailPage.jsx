import styled from '@emotion/styled'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Download, Pencil } from 'lucide-react'

import SideBar from '../components/SideBar'
import SummaryCard from '../components/SummaryCard'
import DecisionList from '../components/DecisionList'
import TodoList from '../components/TodoList'
import TranscriptViewer from '../components/TranscriptViewer'
import NextAgenda from '../components/NextAgenda'

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
    gap: 12px;
    padding: 12px 28px 20px;
    font-size: 13.5px;
    color: #7C766A;
    flex-wrap: wrap;
    background-color: #F7F6F2;
    border-bottom: 1px solid #EBE7DF;
`

const AttendeeChip = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 11px 3px 3px;
    background-color: #F0EFE9;
    border-radius: 20px;
    font-size: 13px;
    color: #4A473F;
`

const ChipAvatar = styled.span`
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background-color: #DCD9CF;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    color: #57534A;
    font-weight: 600;
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

const meetingData = {
    title: '제품 주간 회의 — 6월 4주차',
    date: '2026. 6. 23. 월 14:00 · 1시간 12분',
    attendees: [
        { initial: '김', name: '김민수' },
        { initial: '이', name: '이서연' },
        { initial: '박', name: '박준호' }
    ],
    summary: '이번 주는 결제 모듈 장애 대응 경과와 다음 분기 로드맵 우선순위를 논의했다. 핫픽스 배포 일정과 온보딩 개선 실험 범위를 정리했고, 일부 항목은 다음 스프린트로 이월하기로 했다.',
    decisions: [
        { id: 1, text: '결제 모듈 핫픽스를 <strong>금요일(6/27)까지</strong> 배포한다.' },
        { id: 2, text: '온보딩 A/B 테스트는 다음 스프린트로 연기한다.' }
    ],
    todos: [
        { id: 1, task: '결제 로그 분석 및 원인 보고', assignee: '김민수', due: '6/26' },
        { id: 2, task: '온보딩 카피 초안 작성', assignee: '이서연', due: '6/30' },
        { id: 3, task: '로드맵 우선순위 문서 정리', assignee: null, due: null }
    ],
    nextAgenda: ['분기 로드맵 최종 확정', '고객 인터뷰 일정 조율'],
    segments: [
        { time: '00:00:12', text: '네, 지난주 결제 장애부터 보겠습니다. 로그상으로는 결제 모듈 타임아웃이 원인으로 보입니다.' },
        { time: '00:11:58', text: '그럼 핫픽스 일정은 언제로 잡을까요?' },
        { time: '00:12:47', text: '결제 모듈 핫픽스를 이번 주 금요일까지 배포하는 걸로 하시죠.' },
        { time: '00:13:20', text: '좋습니다. 로그 분석은 김민수 님이 26일까지 정리해 주세요.' },
        { time: '00:21:05', text: '온보딩 실험은 이번 스프린트엔 무리일 것 같아요.' }
    ]
}

function MeetingDetailPage() {
    const navigate = useNavigate()
    const [checkedIds, setCheckedIds] = useState([])
    const [viewType, setViewType] = useState('cleaned')

    const handleToggle = (id) => {
        setCheckedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        )
    }

    return (
        <Container>
            <SideBar />
            <Main>
                <TopBar>
                    <BackButton onClick={() => navigate('/')}>
                        <ChevronLeft size={17} /> 회의 목록
                    </BackButton>
                    <DownloadButton>
                        <Download size={16} /> 워드(.docx) 다운로드
                    </DownloadButton>
                </TopBar>

                <TitleRow>
                    <MeetingTitle>{meetingData.title}</MeetingTitle>
                    <Pencil size={16} color="#928C80" style={{ cursor: 'pointer' }} />
                </TitleRow>

                <MetaRow>
                    <span>{meetingData.date}</span>
                    <span>참석자</span>
                    {meetingData.attendees.map((a, i) => (
                        <AttendeeChip key={i}>
                            <ChipAvatar>{a.initial}</ChipAvatar>
                            {a.name}
                        </AttendeeChip>
                    ))}
                    <AttendeeChip style={{ paddingLeft: 11 }}>+ 입력</AttendeeChip>
                </MetaRow>

                <Body>
                    <LeftColumn>
                        <SummaryCard summary={meetingData.summary} />
                        <DecisionList decisions={meetingData.decisions} />
                        <TodoList
                            todos={meetingData.todos}
                            checkedIds={checkedIds}
                            onToggle={handleToggle}
                        />
                        <NextAgenda items={meetingData.nextAgenda} />
                    </LeftColumn>

                    <TranscriptViewer
                        segments={meetingData.segments}
                        viewType={viewType}
                        onViewTypeChange={setViewType}
                        highlightTime="00:12:47"
                    />
                </Body>
            </Main>
        </Container>
    )
}

export default MeetingDetailPage