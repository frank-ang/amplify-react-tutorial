import React, { useState } from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import ImagePreview from './ImagePreview';
import { Storage } from 'aws-amplify'

/*
Capture image from web cam and upload to S3.

Component from:
https://www.npmjs.com/package/react-html5-camera-photo
yarn add react-html5-camera-photo
*/

function RegisterFace (props) {
  const [dataUri, setDataUri] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');

  function handleTakePhotoAnimationDone (dataUri) {
    setDataUri(dataUri);
  }

  function resetFacePhoto(e) {
    e.preventDefault();
    setDataUri(null)
  }

  function useFacePhoto(e) {
    e.preventDefault();
    var blobData = dataURItoBlob(dataUri);
    // TODO get the person_name from a preceding process.
    var person_name = "person_name_TODO.jpg";
    Storage.put(person_name, blobData, {
        contentType: "image/jpeg",
        level: 'protected'
    })
    .then(setUploadStatus("uploading..."))
    .then(result => setUploadStatus("Uploaded. " + JSON.stringify(result.key)))
    .catch(err => console.log(err));
  }

  function dataURItoBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
  }

  const isFullscreen = false;
  return (
    <div>
      {
        (dataUri)
          ? <div style={{position: "relative", textAlign: "center", margin:"auto"}}>
              <ImagePreview dataUri={dataUri} isFullscreen={isFullscreen}
              />
              <button onClick={useFacePhoto}>Use Photo</button>
              <button onClick={resetFacePhoto}>Retake Photo</button>
              <br/>
              {uploadStatus}
            </div>
          : <Camera onTakePhotoAnimationDone = {handleTakePhotoAnimationDone}
            isFullscreen={isFullscreen}
            />
      }
      <br/>
      <br/>
    </div>
  );
}
 
export default RegisterFace;