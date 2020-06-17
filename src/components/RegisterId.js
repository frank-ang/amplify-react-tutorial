import React from 'react';
import { Storage } from 'aws-amplify'

/*
 Capture image from web cam and upload to S3.
*/


class RegisterId extends React.Component {

    constructor(props) {
        super(props);
        // this.state = { source: "" };
        this.takePhoto = this.takePhoto.bind(this);
        this.uploadPhoto = this.uploadPhoto.bind(this);
    }
    
    componentDidMount() {
        navigator.mediaDevices.getUserMedia({video: true, audio: false})
          .then(this.handleSuccess)
          .catch(this.videoError);
    }

    handleSuccess(stream) {
        const video = document.querySelector('video');
        const videoTracks = stream.getVideoTracks();
        console.log(`Using video device: ${videoTracks[0].label}`);
        window.stream = stream; // make variable available to browser console
        video.srcObject = stream;
    }

    videoError = (err) => {
        console.error(err)
    }

    takePhoto(e) {
        e.preventDefault();
        console.log("Taking Photo...");
        const canvas = this.refs.canvas;
        const video = this.refs.video;
        canvas.width = 720;
        canvas.height = 400;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    };

    dataURItoBlob(dataURI) {
        var binary = atob(dataURI.split(',')[1]);
        var array = [];
        for(var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
    }
    
    uploadPhoto(e) {
        e.preventDefault();
        console.log("Uploading Photo...");
        const canvas = this.refs.canvas;
        const dataUrl = canvas.toDataURL("image/png");
        var blobData = this.dataURItoBlob(dataUrl);
        Storage.put('id-pic.jpg', blobData, {
            contentType: "image/jpeg",
            level: 'protected'
        })
        .then (result => console.log(result))
        .catch(err => console.log(err));
        
    }
    
    render() {
        return (
          <div>
             <div style={{position: "relative", textAlign: "center", margin:"auto"}}>
                <div>
                    <video ref="video" width="720" autoPlay="false" playsinline></video>
                </div>
                <div>
                    <button id="TakePhoto" onClick={this.takePhoto}>Take Photo</button>
                </div>
                <div>
                    <canvas ref="canvas" width="720" ></canvas>
                </div>
                <div>
                    <button id="UploadPhoto" onClick={this.uploadPhoto}>Upload Photo</button>
                </div>
            </div>
            <br/>
          </div>
        )
    }

}

export default RegisterId;
