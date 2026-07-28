import MeetingCard, { CardList } from './MeetingCard'

function MeetingCardList({ meetings, onCardClick }) {
    return (
        <CardList>
            {meetings.map(meeting => (
                <MeetingCard
                    key={meeting.id}
                    meeting={meeting}
                    onClick={() => onCardClick(meeting)}
                />
            ))}
        </CardList>
    )
}

export default MeetingCardList