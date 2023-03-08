import { Col, Row } from 'react-bootstrap'
import { useNote } from './NoteLayout'

const Note = () => {
  const note = useNote()

  return (
    <>
      <Row className='align-items-center mb-4'>
        <Col>
          <h1>{note.title}</h1>
        </Col>
      </Row>
    </>
  )
}

export default Note
