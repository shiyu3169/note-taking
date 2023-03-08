import { Badge, Button, Col, Row, Stack } from 'react-bootstrap'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import { Link, useNavigate } from 'react-router-dom'
import { NoteActionType, useNoteContext } from '../providers/NoteProvider'
import { useNote } from './NoteLayout'

const Note = () => {
  const note = useNote()
  const {
    state: { tags },
  } = useNoteContext()
  const navigate = useNavigate()
  const { dispatch } = useNoteContext()

  const onDelete = () => {
    dispatch({
      type: NoteActionType.DELETE_NOTE,
      payload: { id: note.id },
    })
    navigate('..')
  }

  return (
    <>
      <Row className='align-items-center mb-4'>
        <Col>
          <h1>{note.title}</h1>
          {note.tagIds.length > 0 && (
            <Stack gap={1} direction='horizontal' className='flex-wrap'>
              {note.tagIds.map((id) => {
                const tag = tags[id]
                return (
                  tag && (
                    <Badge className='text-truncate' key={id}>
                      {tag}
                    </Badge>
                  )
                )
              })}
            </Stack>
          )}
        </Col>
        <Col xs='auto'>
          <Stack gap={2} direction='horizontal'>
            <Link to={`/${note.id}/edit`}>
              <Button variant='primary'>Edit</Button>
            </Link>
            <Button variant='outline-danger' onClick={onDelete}>
              Delete
            </Button>
            <Link to='..'>
              <Button variant='outline-secondary'>Back</Button>
            </Link>
          </Stack>
        </Col>
      </Row>
      <ReactMarkdown>{note.markdown}</ReactMarkdown>
    </>
  )
}

export default Note
