import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { Storage, Predictions } from 'aws-amplify';
import ImagePreview from './ImagePreview';
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
            entities.forEach(entity => {
                console.log(entity)
                let imageId = entity.metadata.externalImageId;
                if (imageId) {
                    console.log({ imageId });
                    Storage.get("", {
                        customPrefix: {
                            public: imageId
                        },
                        level: "public",
                    })
                    .then(storageResult => {
                        console.log({storageResult});
                        setSrc(storageResult);
                        setResponse("Matched imageId: " + imageId)
                    });
               }
            });
            if (src === "")
                setResponse("No match found.");
            console.log({ entities });
        })
        .catch(err => console.log(err))
    }

    return (
        <CardGroup className="m-1">
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
                        <pre>{response}</pre>
                    </Card.Body>
                </Card>
            }
        </CardGroup>
    );
}
export default RecognizePerson;