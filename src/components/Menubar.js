import React from 'react';
import { Nav, NavDropdown, Navbar } from 'react-bootstrap';
import { AmplifySignOut } from '@aws-amplify/ui-react';
import { Auth } from 'aws-amplify';

class Menubar extends React.Component {

    constructor(props) {
        super(props);
        this.state = { username: "" };
        Auth.currentAuthenticatedUser()
            .then(user => { 
                console.log(user);
                this.setState({ "username": user.username});
            })
            .catch(err => console.log(err));
    }

    render () {
   
        return (
        <div>
            <Navbar bg="dark" variant="dark" expand="lg" sticky="top" fixed="top" >
                <Navbar.Brand href="#home">Amplify it!</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/todos">Todos</Nav.Link>
                    <NavDropdown title="AWSome features" id="basic-nav-dropdown">
                        <NavDropdown.Item href="/upload">Upload to S3</NavDropdown.Item>
                    </NavDropdown>
                    </Nav>
                    <Nav>
                        <Nav.Item><Navbar.Text>Hello, {this.state.username} &nbsp;&nbsp;</Navbar.Text></Nav.Item>
                        <Nav.Item><AmplifySignOut/></Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
        );
    }
}
export default Menubar;