import React, { useState } from 'react';
import Camera, { FACING_MODES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import ImagePreview from './ImagePreview';
import { Predictions } from 'aws-amplify';
import Form from 'react-bootstrap/Form';

/*
Capture ID Card image from web cam and upload to S3.

Component from:
https://www.npmjs.com/package/react-html5-camera-photo

install dependency:
yarn add react-html5-camera-photo
*/

function RegisterIdCard (props) {
  const [dataUri, setDataUri] = useState('');
  const [response, setResponse] = useState('Enter name or scan ID card...')
  const [personName, setPersonName] = useState('');

  function handleTakePhotoAnimationDone (dataUri) {
    setDataUri(dataUri);
  }

  function resetPhoto(e) {
    e.preventDefault();
    setDataUri(null)
    setResponse(null)
    setPersonName(null)
  }

  function usePhoto(e) {
    e.preventDefault();
    console.log("Using ID Card. Detecting Text...");
    identifyText(dataUri);
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
        format: "PLAIN", // Available options "PLAIN", "FORM", "TABLE", "ALL"
      }
    }).then(({text: { fullText }}) => {
      setResponse(fullText);
      console.log(fullText);
      // heuristic, assume the first 2 tokens are the person's name.
      var tokens = fullText.split(" ", 3);
      setPersonName(tokens[0] + " " + tokens[1]);
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
              <button onClick={usePhoto}>Use Photo</button>
              <button onClick={resetPhoto}>Retake Photo</button>
              <div className="Text">
                  <p>{response}</p>
              </div>
            </div>
          : <Camera onTakePhotoAnimationDone = {handleTakePhotoAnimationDone}
            isFullscreen={isFullscreen} idealFacingMode={FACING_MODES.ENVIRONMENT}
            />
      }
      <br/>
      <Form>
        <Form.Group controlId="formPerson">
          <Form.Label>Your Name</Form.Label>
          <Form.Control type="text" value={personName} placeholder="Enter name or scan ID card."/>
          <Form.Text className="text-muted">
            We'll never share your particulars with anyone else.
          </Form.Text>
        </Form.Group>
      </Form>
      <br/>
    </div>
  );
}
 
export default RegisterIdCard;