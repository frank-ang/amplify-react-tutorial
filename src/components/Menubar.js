import React, { useState } from 'react';
import { Nav, NavDropdown, Navbar } from 'react-bootstrap';
import { AmplifySignOut } from '@aws-amplify/ui-react';
import { Auth } from 'aws-amplify';

function Menubar() {
    const [username, setUsername] = useState("")
    Auth.currentAuthenticatedUser({bypassCache: false})
    .then(user => { 
        setUsername(user.username);
    })
    .catch(err => console.log(err));
    return (
        <div>
            <Navbar bg="dark" variant="dark" expand="lg" sticky="top" fixed="top" >
                <Navbar.Brand href="/">Amplify it!</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <NavDropdown title="Features" id="basic-nav-dropdown">
                        <NavDropdown.Item href="/predict">Prediction Examples</NavDropdown.Item>
                        <NavDropdown.Item href="/registerperson">Register Person</NavDropdown.Item>
                        <NavDropdown.Item href="/recognizeperson">Recognize Person</NavDropdown.Item>
                        <NavDropdown.Item href="/detectricedisease">Detect Rice Disease</NavDropdown.Item>
                        <NavDropdown.Item href="/todos">Todos</NavDropdown.Item>
                        <NavDropdown.Item href="/upload">Simple Upload</NavDropdown.Item>
                    </NavDropdown>
                    </Nav>
                    <Nav>
                        <Nav.Item><Navbar.Text>Hello, {username} &nbsp;&nbsp;</Navbar.Text></Nav.Item>
                        <Nav.Item><AmplifySignOut/></Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );

}
export default Menubar;