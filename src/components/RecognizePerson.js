import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import ImagePreview from './ImagePreview';
import { Storage, Predictions } from 'aws-amplify';
import { dataURItoFile } from './Util';

function RecognizePerson (props) {
    const [dataUri, setDataUri] = useState('');
    const [response, setResponse] = useState("")
    const [src, setSrc] = useState("");

    function handleTakePhotoAnimationDone (dataUri) {
        setDataUri(dataUri);
        setResponse('searching...');
        var file = dataURItoFile(dataUri);
        Predictions.identify({
            entities: {
                source: {
                    file,
                },
                collection: true
            }
        }).then(result => {
            console.log(result);
            const entities = result.entities;
            entities.forEach(({ boundingBox, metadata: { name = "", externalImageId = "" } }) => {
                let imageId = externalImageId;
                console.log({ name });
                if (imageId) {
                    console.log({ imageId });
                    Storage.get("", {
                        customPrefix: {
                        public: imageId
                        },
                        level: "public",
                    })
                    .then(setSrc)
                    .then(setResponse("Matched imageId: " + imageId));
                }
            });
            if (src === "")
                setResponse("No match found.");
            console.log({ entities });
        })
        .catch(err => console.log(err))
    }

    return (
        <CardGroup class="m-1">
            <Card>
                <Card.Header>Identity Verification with Image Recognition</Card.Header>
                <Card.Body>
                    {
                        (dataUri) ? 
                            <div>
                                <ImagePreview dataUri={dataUri} size="XS"/>                              
                            </div>
                        : 
                            <div>
                                <Card.Title>Please take selfie.</Card.Title>
                                <Camera onTakePhotoAnimationDone = {handleTakePhotoAnimationDone}
                                    isFullscreen={false}
                                />
                            </div>
                    }
                </Card.Body>
            </Card>
            {
                dataUri && 
                <Card>
                    <Card.Header>Amazon Rekognition Result</Card.Header>
                    <Card.Body>
                        { src && <ImagePreview dataUri={src} size="XS"/> }
                        <p>{response}</p>
                    </Card.Body>
                </Card>
            }
        </CardGroup>
    );
}
export default RecognizePerson;