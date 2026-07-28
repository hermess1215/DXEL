import styled from '@emotion/styled'
import { Check } from 'lucide-react'

const Todo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`

const TodoTitle = styled.p`
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
        background-color: #0F766E;
        border-radius: 2px;
    }
`

const Table = styled.table`
    width: 100%;
    border: 1px solid #EBE7DF;
    border-radius: 11px;
    border-collapse: separate;
    border-spacing: 0;
    overflow: hidden;
`

const HeaderRow = styled.th`
    text-align: left;
    padding: 9px 15px;
    background-color: #FAF9F5;
    color: #928C80;
    font-size: 12px;
    border-bottom: 1px solid #F3F0E9;

    &:nth-of-type(2) { width: 100px }
    &:nth-of-type(3) { width: 80px }
`

const Td = styled.td`
    padding: 12px 15px;
    border-bottom: 1px solid #F2EFE8;
    font-size: 13.5px;
    color: ${props => props.$empty ? '#B0AB9D' : '#57534A'};

    tr:last-of-type & {
        border-bottom: none;
    }
`

const TaskTd = styled(Td)`
    font-size: 14px;
    color: ${props => props.$done ? '#B0AB9D' : '#1C1B18'};
    text-decoration: ${props => props.$done ? 'line-through' : 'none'};
`

const TaskInner = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`

const Checkbox = styled.button`
    width: 17px;
    height: 17px;
    border-radius: 5px;
    flex-shrink: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;

    border: ${props => props.$checked ? 'none' : '1px solid #C9C3B5'};
    background-color: ${props => props.$checked ? '#0F766E' : '#FFFFFF'};
    color: white;
`

function TodoList({ todos, checkedIds, onToggle }) {
    return (
        <Todo>
            <TodoTitle>할 일</TodoTitle>
            <Table>
                <thead>
                    <tr>
                        <HeaderRow>할 일</HeaderRow>
                        <HeaderRow>담당자</HeaderRow>
                        <HeaderRow>기한</HeaderRow>
                    </tr>
                </thead>
                <tbody>
                    {todos.map(todo => {
                        const isChecked = checkedIds.includes(todo.id)
                        return (
                            <tr key={todo.id}>
                                <TaskTd $done={isChecked}>
                                    <TaskInner>
                                        <Checkbox
                                            $checked={isChecked}
                                            onClick={() => onToggle(todo.id)}
                                            aria-label="할일 완료 토글"
                                        >
                                            {isChecked && <Check size={12} strokeWidth={3} />}
                                        </Checkbox>
                                        {todo.task}
                                    </TaskInner>
                                </TaskTd>
                                <Td $empty={!todo.assignee}>{todo.assignee || '미지정'}</Td>
                                <Td $empty={!todo.due}>{todo.due || '—'}</Td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </Todo>
    )
}

export default TodoList