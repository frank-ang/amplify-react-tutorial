import React, { useState } from 'react';
import Camera, { FACING_MODES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import ImagePreview from './ImagePreview';
import { Predictions } from 'aws-amplify';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

/*
Capture ID Card image from web cam and upload to S3.

Component from:
https://www.npmjs.com/package/react-html5-camera-photo

install dependency:
yarn add react-html5-camera-photo
*/

function RegisterIdCard (props) {
  const [dataUri, setDataUri] = useState('');
  const [response, setResponse] = useState('Enter particulars or scan ID card...')
  //const [personName, setPersonName] = useState('');
  //const [personEmail, setPersonEmail] = useState('');
  const [state, setState] = useState({
    personName: "",
    personEmail: ""
  })

  function handleTakePhotoAnimationDone (dataUri) {
    setDataUri(dataUri);
  }

  function resetPhoto(e) {
    e.preventDefault();
    setDataUri(null)
    state.setResponse = "Enter particulars or scan ID card...";
    state.personName = null;
    state.personEmail = null;
  }

  function usePhoto(e) {
    e.preventDefault();
    console.log("Using ID Card. Detecting Text...");
    identifyText(dataUri);
  }

  function submit(e) {
    e.preventDefault();
    console.log("Submitting particulars.");
    props.handleParticularsChange(state.personName, state.personEmail);
  }

  function handleChange(evt) {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  }  

  // Converts a data URI string into a File object.
  function dataURItoFile (dataURI) {
    // Format of a base64-encoded URL:
    // data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYAAAAEOCAIAAAAPH1dAAAAK
    var BASE64_MARKER = ';base64,';
    var mime = dataURI.split(BASE64_MARKER)[0].split(':')[1];
    var filename = 'dataURI-file-' + (new Date()).getTime() + '.' + mime.split('/')[1];
    var bytes = atob(dataURI.split(BASE64_MARKER)[1]);
    var writer = new Uint8Array(new ArrayBuffer(bytes.length));
    for (var i=0; i < bytes.length; i++) {
      writer[i] = bytes.charCodeAt(i);
    }
    return new File([writer.buffer], filename, { type: mime });
  }

  function identifyText(dataUri) {
    setResponse('identifiying text...');
    var file = dataURItoFile(dataUri);
    console.log(file)
    Predictions.identify({
      text: {
        source: {
          file,
        },
        format: "ALL", // Available options "PLAIN", "FORM", "TABLE", "ALL"
      }
    }).then(result => {
      console.log(result);
      // The result child elements include: fullText, lines[],linesDetailed
      var responseText = '';
      for (const line of result.text.lines) {
        responseText += line + '\n';
        setResponse(responseText);
        // name and email detection heuristic.
        if (line.match(/^([A-Z][A-Za-z]+\s){1,2}[A-Z][A-Za-z]+$/)) {
          state.personName = line;
        } else if (line.match(/(\w+@\w+\.[a-z]{2,4})/)) {       
          state.personEmail = line.match(/(\w+@\w+\.[a-z]{2,4})/)[0];
        }
      }
    }).catch(err => setResponse(JSON.stringify(err, null, 2)))
  }

  const isFullscreen = false;
  return (
    <div>
      {
        (dataUri)
          ? <div style={{position: "relative", textAlign: "center", margin:"auto"}}>
              <ImagePreview dataUri={dataUri} isFullscreen={isFullscreen}
              />
              <Button variant="outline-primary" onClick={usePhoto}>Use Photo</Button>
              <Button variant="outline-secondary" onClick={resetPhoto}>Retake Photo</Button>
            </div>
          : <Camera onTakePhotoAnimationDone = {handleTakePhotoAnimationDone}
            isFullscreen={isFullscreen} idealFacingMode={FACING_MODES.ENVIRONMENT}
            isImageMirror={false}
            />
      }
      <br/>
      <div className="Text">
            <pre>{response}</pre>
      </div>
      <Form onSubmit={submit}>
        <Form.Group as={Row} controlId="formPerson">
          <Form.Label column sm="2">Name</Form.Label>
          <Col>
            <Form.Control name="personName" type="text" 
              defaultValue={state.personName} onChange={handleChange}/>
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="formGridEmail">
          <Form.Label column sm="2">Email</Form.Label>
          <Col>
            <Form.Control name="personEmail" type="email" 
            defaultValue={state.personEmail} onChange={handleChange}/>
          </Col>
        </Form.Group>
        <Form.Text className="text-muted">
            We'll never share your particulars with anyone else.
        </Form.Text>
        <Button variant="primary" type="submit">Next</Button>

      </Form>
      <br/>
    </div>
  );
}
 
export default RegisterIdCard;