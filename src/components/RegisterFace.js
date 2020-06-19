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
    var file_name = props.personName + ".jpg"; //"person_name_TODO.jpg";
    Storage.put(file_name, blobData, {
        contentType: "image/jpeg",
        level: 'protected'
    })
    .then(setUploadStatus("uploading to S3: " + file_name))
    .then(result => {
      setUploadStatus("Uploaded. " + JSON.stringify(result.key));
      props.handleSelfie(result.key)
    }).catch(err => console.log(err));
    
  }

  function dataURItoBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
  }

  return (
    <div>
      {
        (dataUri)
          ? <div style={{position: "relative", textAlign: "center", margin:"auto"}}>
              <ImagePreview dataUri={dataUri} isFullscreen={false}
              />
              <button onClick={useFacePhoto}>Use Photo</button>
              <button onClick={resetFacePhoto}>Retake Photo</button>
              <br/>
              {uploadStatus}
            </div>
          : <Camera onTakePhotoAnimationDone = {handleTakePhotoAnimationDone}
            isFullscreen={false}
            />
      }
      <br/>
      <br/>
    </div>
  );
}
 
export default RegisterFace;