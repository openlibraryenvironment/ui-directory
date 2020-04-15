import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Col,
  Row,
  TextField,
} from '@folio/stripes/components';

import { withKiwtFieldArray } from '@folio/stripes-erm-components';

import { required } from '../../../util/validators';

class AddressLineListField extends React.Component {
  static propTypes = {
  };

  findIndexBySeq(seq) {
    // This function is in place to ensure that the array getting jumbled up doesn't break the edit order
    const { items } = this.props;
    return items.findIndex(item => item.seq === seq);
  }


  render() {
    const { name } = this.props;
    // ToDo -- figure out a way to do this a bit more dynamically in future
    return (
      <Row>
        <Col xs={3}>
          <Field
            name={`${name}[${this.findIndexBySeq(0)}].value`}
            label={<FormattedMessage id="ui-directory.information.addresses.addressLine1" />}
            component={TextField}
            required
            validate={required}
          />
        </Col>
        <Col xs={3}>
          <Field
            name={`${name}[${this.findIndexBySeq(1)}].value`}
            label={<FormattedMessage id="ui-directory.information.addresses.addressLine2" />}
            component={TextField}
            required
            validate={required}
          />
        </Col>
        <Col xs={3}>
          <Field
            name={`${name}[${this.findIndexBySeq(2)}].value`}
            label={<FormattedMessage id="ui-directory.information.addresses.city" />}
            component={TextField}
            required
            validate={required}
          />
        </Col>
        <Col xs={1}>
          <Field
            name={`${name}[${this.findIndexBySeq(3)}].value`}
            label={<FormattedMessage id="ui-directory.information.addresses.postalCode" />}
            component={TextField}
            required
            validate={required}
          />
        </Col>
        <Col xs={2}>
          <Field
            name={`${name}[${this.findIndexBySeq(4)}].value`}
            label={<FormattedMessage id="ui-directory.information.addresses.stateProvince" />}
            component={TextField}
            required
            validate={required}
          />
        </Col>
      </Row>
    );
  }
}

export default withKiwtFieldArray(AddressLineListField);
