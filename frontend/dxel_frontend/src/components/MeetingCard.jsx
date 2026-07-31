import styled from '@emotion/styled'
import { Mic } from 'lucide-react'
import ProgressBar from './ProgressBar'

export const CardList = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 11px;
`

const Card = styled.div`
    width: 100%;
    background-color: #FFFFFF;
    border: 1px solid #EBE7DF;
    padding: 16px 18px;
    border-radius: 13px;
    display: flex;
    flex-direction: column;
    gap: 9px;
    cursor: pointer;

    &:hover {
        border-color: #D4CFC4;
    }
`

const TopRow = styled.div`
    display: flex;
    align-items: center;
    gap: 9px;
`

const IconBackground = styled.div`
    width: 46px;
    height: 46px;
    border-radius: 11px;
    background-color: ${props => {
        if (props.$type === 'processing') return '#EEF2F0'
        if (props.$type === 'done') return '#F0EFE9'
        if (props.$type === 'cleaned') return '#F0EFE9'
    }};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 20px;
`

const IconColor = (type) => {
    if (type === 'processing') return '#0F766E'
    return '#8A8478'
}

const CardTitle = styled.p`
    font-size: 16.5px;
    font-weight: 600;
    color: #1C1B18;
`

const Badge = styled.span`
    font-size: 12px;
    font-weight: 600;
    padding: 2px 10px;
    border-radius: 20px;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    flex-shrink: 0;

    background-color: ${props => {
        if (props.$type === 'processing') return '#FBF0D9'
        if (props.$type === 'done') return '#E6F0EC'
        if (props.$type === 'cleaned') return '#F0EDE5'
    }};

    color: ${props => {
        if (props.$type === 'processing') return '#9A6B16'
        if (props.$type === 'done') return '#13413B'
        if (props.$type === 'cleaned') return '#6B6658'
    }};
`

const ChevronIcon = styled.span`
    margin-left: auto;
    color: #BDB7AA;
    font-size: 18px;
`

const ProgressRow = styled.div`
    display: flex;
    align-items: center;
    gap: 11px;
    padding-left: 42px;
`

const PercentText = styled.span`
    font-size: 12.5px;
    color: #7C766A;
    flex-shrink: 0;
`

const Meta = styled.p`
    font-size: 13px;
    color: #928C80;
    padding-left: 42px;
`

const SnippetBox = styled.div`
    background-color: #FBF3DF;
    border-radius: 9px;
    padding: 9px 14px;
    display: flex;
    gap: 8px;
    font-size: 13px;
    color: #5C5648;
    margin-left: 42px;
`

const Timestamp = styled.span`
    color: #B08B2E;
    font-weight: 600;
    flex-shrink: 0;
`

const Highlight = styled.mark`
    background-color: #F5DD8F;
    padding: 0 2px;
    border-radius: 2px;
    color: #1C1B18;
`

function MeetingCard({ meeting, onClick }) {
    const isProgressing = meeting.status === 'processing'

    return (
        <Card onClick={onClick}>
            <TopRow>
                <IconBackground $type={isProgressing ? 'processing' : 'done'}>
                    <Mic size={20} color={IconColor(isProgressing ? 'processing' : 'done')} strokeWidth={1.42} />
                </IconBackground>
                <CardTitle>{meeting.title}</CardTitle>
                {isProgressing && <Badge $type="processing">• 처리 중</Badge>}
                {!isProgressing && <Badge $type="done">완료</Badge>}
                {meeting.isCleaned && <Badge $type="cleaned">정리본</Badge>}
                {!isProgressing && <ChevronIcon>›</ChevronIcon>}
            </TopRow>

            {isProgressing ? (
                <ProgressRow>
                    <ProgressBar percent={meeting.progress} />
                    <PercentText>{meeting.progress}%</PercentText>
                </ProgressRow>
            ) : (
                <>
                    <Meta>
                        {meeting.date} · {meeting.duration} · 참석 {meeting.attendeeCount}명
                    </Meta>
                    {meeting.snippet && (
                        <SnippetBox>
                            <Timestamp>{meeting.snippet.timestamp}</Timestamp>
                            <span>
                                ...{meeting.snippet.before}
                                <Highlight>{meeting.snippet.keyword}</Highlight>
                                {meeting.snippet.after}
                            </span>
                        </SnippetBox>
                    )}
                </>
            )}
        </Card>
    )
}

export default MeetingCard