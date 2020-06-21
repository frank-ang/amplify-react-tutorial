import React, { useState } from 'react';
import RegisterFace from './RegisterFace'
import RegisterIdCard from './RegisterIdCard'
import Card from 'react-bootstrap/Card'

function RegisterPerson (props) {
  const [personName, setPersonName] = useState('');
  const [personEmail, setPersonEmail] = useState('');
  const [selfie, setSelfie] = useState('');

  function handleParticularsChange(name, email) {
    setPersonName(name);
    setPersonEmail(email);
    console.log("handleParticulars: " + personName + "," + personEmail);
  }

  function handleSelfie(selfie) {
    setSelfie(selfie);
    console.log("handleSelfie: " + selfie);
  }

  return (
    <div>
    {
     (!personName) ?
      <Card>
        <Card.Header>Register ID Card</Card.Header>
        <Card.Body>
          <RegisterIdCard handleParticularsChange={handleParticularsChange}/>
        </Card.Body>
      </Card>
      :
        (!selfie) ?
        <Card>
          <Card.Header>Register Profile Selfie</Card.Header>
          <Card.Body>
            <RegisterFace personName={personName} handleSelfie={handleSelfie}/>
          </Card.Body>
        </Card>
        :
        <Card>
          <Card.Header>Register Profile Completed</Card.Header>
          <Card.Body>
            <Card.Title>Profile registration complete, thank you.</Card.Title>
          </Card.Body>
        </Card>
    }
    </div>
  );
}
export default RegisterPerson;