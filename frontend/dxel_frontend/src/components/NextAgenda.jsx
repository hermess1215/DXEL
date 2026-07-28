import styled from '@emotion/styled'

const NextAgendaBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`

const NextTitle = styled.p`
    font-size: 15px;
    font-weight: 700;
    color: #1C1B18;
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

const NextItem = styled.p`
    font-size: 14.5px;
    color: #3A362E;
    display: flex;
    align-items: center;
    gap: 6px;

    &::before {
        content: '';
        width: 4px;
        height: 4px;
        border-radius: 2px;
        background-color: #0F766E;
    }
`

function NextAgenda({ items }) {
    return (
        <NextAgendaBox>
            <NextTitle>다음 안건</NextTitle>
            {items.map((item, i) => (
                <NextItem key={i}>{ item }</NextItem>
            ))}
        </NextAgendaBox>
    )
}

export default NextAgenda