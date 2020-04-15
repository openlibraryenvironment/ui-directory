import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion, Col, KeyValue, Row } from '@folio/stripes/components';

import { Address } from '../components';

function renderAddress(address, index, count) {
  return (
    <Address {...{ address, index, count }} />
  );
}


class ContactInformation extends React.Component {
  static propTypes = {
    record: PropTypes.object,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  render() {
    const { record } = this.props;
    const addresses = record.addresses || [];

    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-directory.information.heading.contactInformation" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <Row>
          <Col xs={4}>
            <KeyValue
              label={<FormattedMessage id="ui-directory.information.mainPhoneNumber" />}
              value={record.phoneNumber ? record.phoneNumber : '-'}
            />
          </Col>
          <Col xs={4}>
            <KeyValue
              label={<FormattedMessage id="ui-directory.information.mainEmailAddress" />}
              value={record.emailAddress ? record.emailAddress : '-'}
            />
          </Col>
          <Col xs={4}>
            <KeyValue
              label={<FormattedMessage id="ui-directory.information.mainContactName" />}
              value={record.contactName ? record.contactName : '-'}
            />
          </Col>
        </Row>
        {addresses.map((address, i) => renderAddress(address, i + 1, addresses.length))}
      </Accordion>
    );
  }
}

export default ContactInformation;