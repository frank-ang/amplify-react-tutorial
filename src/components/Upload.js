import React from 'react'
import { Storage } from 'aws-amplify'

class Upload extends React.Component {
    onChange(e) {
        const file = e.target.files[0];
        Storage.put(file.name, file, {
            contentType: file.type,
            level: 'protected',
            customPrefix: {
                public: 'public/predictions/index-faces/',
                protected: 'protected/predictions/index-faces/',
                private: 'private/predictions/index-faces/',
            }
        })
        .then (result => console.log(result))
        .catch(err => console.log(err));
    }
  
    render() {
        return (
            <input
                type="file" accept='*/*'
                onChange={(evt) => this.onChange(evt)}
            />
        )
    }
  }
export default Upload