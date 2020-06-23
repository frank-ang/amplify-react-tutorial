import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import { Auth, API, Storage } from 'aws-amplify'

function DetectRiceDisease (props) {
    const [response, setResponse] = useState("")
    const [file, setFile] = useState("")
    const [userId, setUserId] = useState("")

    Auth.currentUserInfo().then((userInfo) => {
        console.log("userInfo.id: " + userInfo.id);
        setUserId(userInfo.id);
    })
  
    function upload(file) {
        setFile(URL.createObjectURL(file))
        setResponse("Uploading...")
        Storage.put(file.name, file, {
            contentType: file.type,
            level: 'protected',
        })
        .then (result => {
            console.log("uploaded key: " + result.key);
            setResponse("Uploaded: " + result.key + ". Now running detection on image...")

            var s3path = "/protected/" + userId + "/" + result.key;
            detectRiceDisease(s3path).then(detectResult => {
                console.log(detectResult);
                setResponse(JSON.stringify(detectResult.data,null, 2));
            }).catch (err => {
                console.log(err);
                setResponse(JSON.stringify(err, null, 2));
            });
        })
    }

    function detectRiceDisease(s3path) {
        const apiName = "detect";
        const apiPath = "/rice";
        const apiRequestConfig = {
            response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
            queryStringParameters: { 
                image: s3path,
            },
        }
        return API.get(apiName, apiPath, apiRequestConfig);
    }

    const imgStyle = { 
        width: "400px",
        height: "auto"
    }

    return (
        <CardGroup className="m-1">
            <Card>
                <Card.Header>Detect Rice Crop Disease</Card.Header>
                <Card.Body>
                    <Card.Title>Please upload rice leaf picture.</Card.Title>
                    <input type='file' accept='image/png,image/jpeg,image/jpg'
                        onChange={(e) => upload(e.target.files[0])}
                    />
                    <br/>
                    <img src={file} style={imgStyle}/>
                    <br/>
                    <pre>{response}</pre>
                </Card.Body>
            </Card>

        </CardGroup>
    );
}
export default DetectRiceDisease;