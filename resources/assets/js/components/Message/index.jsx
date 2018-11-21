import React from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Card,
  CardTitle,
  CardText,
  UncontrolledTooltip,
} from 'reactstrap';
import styled from 'styled-components';
import { connect } from 'react-redux';

const StyledCardText = styled(CardText)`
  width: 100%;
`;

const StyledCard = styled(Card)`
  padding: .75rem;
  max-width: 100%;
`;

const Message = ({
  id,
  content,
  createdAt,
  users,
  user,
  sender,
}) => {
  const title = new Date(createdAt).toLocaleTimeString();
  const target = `message_${id}`;

  const messageUser = users.find(u => u.id === user);

  if (sender) {
    return (
      <Row className="my-2 align-items-center justify-content-end">
        <Col xs="8" className="d-flex flex-column align-items-end">
          <StyledCard body inverse color="primary" className="d-flex align-items-end" id={target}>
            <StyledCardText>{ content }</StyledCardText>
          </StyledCard>
          <UncontrolledTooltip
            placement="auto"
            target={target}
            delay={{
              show: 500,
              hide: 0,
            }}
          >
            { title }
          </UncontrolledTooltip>
        </Col>
      </Row>
    );
  }

  return (
    <Row className="my-2 align-items-center">
      <Col tag="figure" sm="auto" className="pr-0">
        <img src="/img/avatar.png" alt="avatar" height="40" className="conversation__avatar" />
      </Col>
      <Col sm="8">
        <StyledCard body id={`message_${id}`}>
          {
            messageUser && (
              <CardTitle className="small">
                { messageUser.firstName }
                {' '}
                { messageUser.lastName }
              </CardTitle>
            )
          }
          <StyledCardText>{ content }</StyledCardText>
        </StyledCard>
        <UncontrolledTooltip
          placement="auto"
          target={target}
          delay={{
            show: 500,
            hide: 0,
          }}
        >
          { title }
        </UncontrolledTooltip>
      </Col>
    </Row>
  );
};

Message.propTypes = {
  id: PropTypes.number.isRequired,
  content: PropTypes.string.isRequired,
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  })).isRequired,
  user: PropTypes.number.isRequired,
  createdAt: PropTypes.string.isRequired,
  sender: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  users: state.conversation.current.users,
});

export default connect(mapStateToProps)(Message);
