import { FormEvent, useRef } from 'react'
import { Form, Stack, Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import CreatableReactSelect from 'react-select/creatable'
import { NoteActionType, useNoteContext } from '../providers/NoteProvider'

function NoteForm() {
  const titleRef = useRef<HTMLInputElement>(null)
  const markdownRef = useRef<HTMLTextAreaElement>(null)
  const { dispatch } = useNoteContext()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    dispatch({
      type: NoteActionType.CREATE_NOTE,
      payload: {
        note: {
          title: titleRef.current!.value,
          markdown: markdownRef.current!.value,
          tags: [],
        },
      },
    })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Stack gap={4}>
        <Row>
          <Col>
            <Form.Group controlId='title'>
              <Form.Label>Title</Form.Label>
              <Form.Control required ref={titleRef} />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId='title'>
              <Form.Label>Tags</Form.Label>
              <CreatableReactSelect isMulti />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId='markdown'>
          <Form.Label>Body</Form.Label>
          <Form.Control required as='textarea' rows={15} ref={markdownRef} />
        </Form.Group>
        <Stack direction='horizontal' gap={2} className='justify-content-end'>
          <Button type='submit'>Save</Button>
          <Link to='..'>
            <Button type='button' variant='outline-secondary'>
              Cancel
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Form>
  )
}

export default NoteForm
