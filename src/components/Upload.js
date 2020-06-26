import React from 'react'
import { Storage } from 'aws-amplify'

class Upload extends React.Component {

    constructor(props) {
        super(props);
        this.state = { status: '' };
        this.onChange = this.onChange.bind(this);
    }

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
        .then (result => {
            console.log(result);
            this.setState({ status: result.key });
        })
        .catch(err => console.log(err));
    }
  
    render() {
        return (
            <div>
                <input
                    type="file" accept='*/*'
                    onChange={(evt) => this.onChange(evt)}
                />
                <br/>
                { (this.state.status) ? `Uploaded: ${this.state.status}`: "Please select a file to upload." }
            </div>
        )
    }
  }
export default Upload