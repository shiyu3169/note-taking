import { FormEvent, useRef, useState } from 'react'
import { Form, Stack, Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import CreatableReactSelect from 'react-select/creatable'
import { NoteActionType, Tag, useNoteContext } from '../providers/NoteProvider'
import { v4 as uuidv4 } from 'uuid'

function NoteForm() {
  const titleRef = useRef<HTMLInputElement>(null)
  const markdownRef = useRef<HTMLTextAreaElement>(null)
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const {
    dispatch,
    state: { tags },
  } = useNoteContext()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    dispatch({
      type: NoteActionType.CREATE_NOTE,
      payload: {
        note: {
          title: titleRef.current!.value,
          markdown: markdownRef.current!.value,
          tags: selectedTags,
        },
      },
    })
  }

  const createTag = (label: string) => {
    const tag = {
      label,
      id: uuidv4(),
    }
    setSelectedTags((tags) => [...tags, tag])
    dispatch({
      type: NoteActionType.CREATE_TAG,
      payload: {
        tag,
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
              <CreatableReactSelect
                options={tags.map((tag) => ({
                  label: tag.label,
                  value: tag.id,
                }))}
                onCreateOption={(label) => {
                  createTag(label)
                }}
                value={selectedTags.map((tag) => ({
                  label: tag.label,
                  value: tag.id,
                }))}
                onChange={(tags) => {
                  setSelectedTags(
                    tags.map((tag) => ({
                      label: tag.label,
                      id: tag.value,
                    })),
                  )
                }}
                isMulti
              />
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
