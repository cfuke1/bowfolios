import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Badge, Container, Card, Image, Row, Col } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesInterests } from '../../api/profiles/ProfilesInterests';
import { ProfilesProjects } from '../../api/profiles/ProfilesProjects';
import { Projects } from '../../api/projects/Projects';
import LoadingSpinner from '../components/LoadingSpinner';

/* Returns the Profile and associated Projects and Interests associated with the passed user email. */
function getProfileData(email) {
  const data = Profiles.collection.findOne({ email });
  const interests = _.pluck(ProfilesInterests.collection.find({ profile: email }).fetch(), 'interest');
  const projects = _.pluck(ProfilesProjects.collection.find({ profile: email }).fetch(), 'project');
  const projectPictures = projects.map(project => Projects.collection.findOne({ name: project }).picture);
  // console.log(_.extend({ }, data, { interests, projects: projectPictures }));
  return _.extend({}, data, { interests, projects: projectPictures });
}

/* Component for layout out a Profile Card. */
const MakeCard = (props) => (
  <Col>
    <Card className="h-100">
      <Card.Body>
        <Card.Img src={props.profile.picture} width={50}/>
        <Card.Title>{props.profile.firstName} {props.profile.lastName}</Card.Title>
        <Card.Subtitle>
          <span className='date'>{props.profile.title}</span>
        </Card.Subtitle>
        <Card.Text>
          {props.profile.bio}
        </Card.Text>
        <Card.Text>{_.map(
          props.profile.interests,
          (interest, index) => <Badge key={index} bg="info">{interest}</Badge>,
        )}</Card.Text>
        <h5>Projects</h5>
        {_.map(props.profile.projects, (project, index) => <Image key={index} src={project} width={50}/>)}
      </Card.Body>
    </Card>
  </Col>
);

MakeCard.propTypes = {
  profile: PropTypes.object.isRequired,
};

/** Renders the Profile Collection as a set of Cards. */
const ProfilesPage = () => {

  const { ready } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    const sub1 = Meteor.subscribe(Profiles.userPublicationName);
    const sub2 = Meteor.subscribe(ProfilesInterests.userPublicationName);
    const sub3 = Meteor.subscribe(ProfilesProjects.userPublicationName);
    const sub4 = Meteor.subscribe(Projects.userPublicationName);
    return {
      ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready(),
    };
  }, []);
  const emails = _.pluck(Profiles.collection.find().fetch(), 'email');
  const profileData = emails.map(email => getProfileData(email));
  return ready ? (
    <Container id="profiles-page">
      <Row xs={1} md={2} lg={4} className="g-2">
        {_.map(profileData, (profile, index) => <MakeCard key={index} profile={profile}/>)}
      </Row>
    </Container>
  ) : <LoadingSpinner/>;
};

export default ProfilesPage;
