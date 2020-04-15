import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import { FieldArray } from 'react-final-form-arrays';

import {
  Col,
  TextField,
} from '@folio/stripes/components';

import { EditCard } from '@folio/stripes-erm-components';

import AddressLineListField from './AddressLineListField';
import { required } from '../../../util/validators';

class AddressListField extends React.Component {
  static propTypes = {
  };

  renderCardHeader = (index) => {
    return (
      <Col xs={8} >
        <Field
          name={`addresses[${index}].addressLabel`}
          component={TextField}
          required
          validate={required}
          placeholder={<FormattedMessage id="ui-directory.information.addresses.namePlaceholder" />}
        />
      </Col>
    );
  }

  render() {
    const { index, input: { name }, address } = this.props;
    return (
      <EditCard
        header={this.renderCardHeader(index)}
        key={`addresses[${index}].editCard`}
        onDelete={() => this.props.onDeleteField(index, address)}
      >
        <FieldArray
          name={`${name}.lines`}
        >
          {({ fields, input, meta }) => <AddressLineListField {... { fields, input, meta }} /> }
        </FieldArray>
      </EditCard>
    );
  }
}

export default AddressListField;
