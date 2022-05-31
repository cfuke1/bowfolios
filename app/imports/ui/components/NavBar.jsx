import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { NavLink } from 'react-router-dom';
import { Container, Image, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BoxArrowRight, PersonFill, PersonPlusFill } from 'react-bootstrap-icons';

const NavBar = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { currentUser } = useTracker(() => ({
    currentUser: Meteor.user() ? Meteor.user().username : '',
  }), []);
  const menuStyle = { marginBottom: '0px' };
  return (
    <Navbar expand="lg" style={menuStyle} className="bg-light">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          <Image src="/images/logo.png" width={50}/>
          <span className='bowfolio-green' style={{ fontWeight: 800, fontSize: '24px' }}>Bowfolios</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto justify-content-start">
            {currentUser ? (
              <Nav.Link as={NavLink} id="homeMenuItem" to="/home" key='home'>Home</Nav.Link>
            ) : ''}
            <Nav.Link as={NavLink} id="profilesMenuItem" to="/profiles" key='profiles'>Profiles</Nav.Link>
            <Nav.Link as={NavLink} id="projectsMenuItem" to="/projects" key='projects'>Projects</Nav.Link>
            <Nav.Link as={NavLink} id="interestsMenuItem" to="/interests" key='interests'>Interests</Nav.Link>
            {currentUser ? (
              [<Nav.Link as={NavLink} id="addProjectMenuItem" to="/addProject" key='addP'>Add Project</Nav.Link>,
                <Nav.Link as={NavLink} id="filterMenuItem" to="/filter" key='filter'>Filter</Nav.Link>]
            ) : ''}
          </Nav>
          <Nav className="justify-content-end">
            {currentUser === '' ? (<NavDropdown id="login-dropdown" title="Login">
              <NavDropdown.Item id="login-dropdown-sign-in" as={NavLink} to="/signin"><PersonFill />Sign
                in</NavDropdown.Item>
              <NavDropdown.Item id="login-dropdown-sign-up" as={NavLink} to="/signup"><PersonPlusFill />Sign
                up</NavDropdown.Item>
            </NavDropdown>) : (<NavDropdown id="navbar-current-user" title={currentUser}>
              <NavDropdown.Item id="navbar-sign-out" as={NavLink} to="/signout"><BoxArrowRight /> Sign
                out</NavDropdown.Item>
            </NavDropdown>)}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
