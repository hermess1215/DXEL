import styled from '@emotion/styled'

const Summary = styled.div`
    display: flex;
    flex-direction: column;
    gap: 9px;
`

const SummaryTitle = styled.p`
    font-size: 15px;
    font-weight: 700;
    color: #1C1B18;
    display: flex;
    gap: 8px;
    align-items: center;

    &::before {
        content: '';
        width: 6px;
        height: 6px;
        border-radius: 2px;
        background-color: #0F766E;
    }
`

const SummaryText = styled.p`
    color: #3A362E;
    line-height: 24.6px;
    font-size: 14.5px;
`

function SummaryCard({ summary }) {
    return (
        <>
            <Summary>
                <SummaryTitle>요약</SummaryTitle>
                <SummaryText>{ summary }</SummaryText>
            </Summary>
        </>
    )
}

export default SummaryCard