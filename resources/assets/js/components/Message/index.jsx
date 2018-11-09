import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Row, Col, Card, CardText, Tooltip,
} from 'reactstrap';
import styled from 'styled-components';

const StyledCardText = styled(CardText)`
  width: 100%;
`;

const StyledCard = styled(Card)`
  padding: .75rem;
  max-width: 100%;
`;

class Message extends PureComponent {
  static propTypes = {
    id: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    sender: PropTypes.bool.isRequired,
    createdAt: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      tooltipOpen: false,
    };
  }

  toggle() {
    this.setState(prevState => ({
      tooltipOpen: !prevState.tooltipOpen,
    }));
  }

  render() {
    const {
      id,
      content,
      sender,
      createdAt,
    } = this.props;
    const { tooltipOpen } = this.state;

    const title = new Date(createdAt).toLocaleTimeString();
    const target = `message_${id}`;

    if (sender) {
      return (
        <Row className="my-2 align-items-center justify-content-end">
          <Col xs="8" className="d-flex flex-column align-items-end">
            <StyledCard body inverse color="primary" className="d-flex align-items-end" id={target}>
              <StyledCardText>{ content }</StyledCardText>
            </StyledCard>
            <Tooltip
              placement="auto"
              isOpen={tooltipOpen}
              target={target}
              toggle={this.toggle}
              delay={{
                show: 500,
                hide: 0,
              }}
            >
              { title }
            </Tooltip>
          </Col>
        </Row>
      );
    }

    return (
      <Row className="my-2 align-items-center">
        <Col sm="auto" className="pr-0">
          <img src="/avatar.png" alt="avatar" height="40" className="conversation__avatar" />
        </Col>
        <Col sm="8">
          <StyledCard body id={`message_${id}`}>
            <StyledCardText>{ content }</StyledCardText>
          </StyledCard>
          <Tooltip
            placement="auto"
            isOpen={tooltipOpen}
            target={target}
            toggle={this.toggle}
            delay={{
              show: 500,
              hide: 0,
            }}
          >
            { title }
          </Tooltip>
        </Col>
      </Row>
    );
  }
}

export default Message;
