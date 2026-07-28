import styled from '@emotion/styled'

const Track = styled.div`
    flex: 1;
    height: 7px;
    background-color: #ECE9E2;
    border-radius: 5px;
`

const Fill = styled.div`
    height: 100%;
    background-color: #0F766E;
    border-radius: inherit;
    width: ${props => props.$percent}%;
`

function ProgressBar({ percent }) {
    return (
        <Track>
            <Fill $percent={percent} />
        </Track>
    )
}

export default ProgressBar