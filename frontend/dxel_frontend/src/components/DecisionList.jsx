import styled from '@emotion/styled'

const Decision = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`

const DecisionTitle = styled.p`
    font-size: 15px;
    color: #1C1B18;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;

    &::before {
        content: '';
        width: 6px;
        height: 6px;
        border-radius: 2px;
        background-color: #0F766E;
    }
`

const DecisionCard = styled.div`
    background-color: #FFFFFF;
    border: 1px solid #EBE7DF;
    padding: 12px 14px;
    border-radius: 10px;
`

const DecisionCardText = styled.p`
    font-size: 14.5px;
    color: #3A362E;
    display: flex;
    align-items: center;
    gap: 11px;

    &::before {
        content: '';
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: #0F766E;
        flex-shrink: 0;
    }

    strong { font-weight: 700; }
`

function DecisionList({ decisions }) {
    return (
        <Decision>
            <DecisionTitle>결정사항</DecisionTitle>
            {decisions.map(decision => (
                <DecisionCard key={decision.id}>
                    <DecisionCardText dangerouslySetInnerHTML={{ __html: decision.text }} />
                </DecisionCard>
            ))}
        </Decision>
    )
}

export default DecisionList