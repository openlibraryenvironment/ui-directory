import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Col,
  Row,
  TextField,
} from '@folio/stripes/components';

import { EditCard, withKiwtFieldArray } from '@folio/stripes-erm-components';

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
            label="Address line 1"
            component={TextField}
          />
        </Col>
        <Col xs={3}>
          <Field
            name={`${name}[${this.findIndexBySeq(1)}].value`}
            label="Address line 2"
            component={TextField}
          />
        </Col>
        <Col xs={3}>
          <Field
            name={`${name}[${this.findIndexBySeq(2)}].value`}
            label="City"
            component={TextField}
          />
        </Col>
        <Col xs={1}>
          <Field
            name={`${name}[${this.findIndexBySeq(3)}].value`}
            label="Postal Code"
            component={TextField}
          />
        </Col>
        <Col xs={2}>
          <Field
            name={`${name}[${this.findIndexBySeq(4)}].value`}
            label="State/Province"
            component={TextField}
          />
        </Col>
      </Row>
    );
  }
}

export default withKiwtFieldArray(AddressLineListField);
