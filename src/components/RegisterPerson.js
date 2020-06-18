import React from 'react';
import RegisterFace from './RegisterFace'
import RegisterIdCard from './RegisterIdCard'

function RegisterPerson (props) {
 
    return (
      <div>
        <RegisterIdCard/>
        <RegisterFace/>
      </div>
    );
}
export default RegisterPerson;