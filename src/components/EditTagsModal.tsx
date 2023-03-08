import { Button, Col, Form, Modal, Row, Stack } from 'react-bootstrap'
import { NoteActionType, useNoteContext } from '../providers/NoteProvider'
import { ChangeEvent } from 'react'

type EditTagsModalProps = {
  show: boolean
  handleClose: () => void
}

const EditTagsModal = ({ show, handleClose }: EditTagsModalProps) => {
  const {
    state: { tags },
    dispatch,
  } = useNoteContext()

  // TODO: fix the changeEvent type here
  const onUpdate = (e: ChangeEvent<any>, id: string) => {
    dispatch({
      type: NoteActionType.UPDATE_TAG,
      payload: {
        id,
        label: e.target.value,
      },
    })
  }

  const onDelete = (id: string) => {
    dispatch({
      type: NoteActionType.DELETE_TAG,
      payload: {
        id,
      },
    })
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Tags</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Stack gap={2}>
            {Object.entries(tags).map(([id, label]) => (
              <Row key={id}>
                <Col>
                  <Form.Control
                    type='text'
                    value={label}
                    onChange={(e) => onUpdate(e, id)}
                  />
                </Col>
                <Col xs='auto'>
                  <Button variant='outline-danger' onClick={() => onDelete(id)}>
                    &times;
                  </Button>
                </Col>
              </Row>
            ))}
          </Stack>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default EditTagsModal
