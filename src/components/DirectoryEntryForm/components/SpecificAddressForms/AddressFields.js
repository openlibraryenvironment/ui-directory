import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  TextField,
} from '@folio/stripes/components';

import { required } from '../../../../util/validators';

export const AddressFieldText = (props) => {
  const { country, fieldType, name } = props;
  return (
    <Field
      name={name}
      label={<FormattedMessage id={`ui-directory.information.addresses.${country}.${fieldType}`} />}
      component={TextField}
      required
      validate={required}
    />
  );
};

AddressFieldText.propTypes = {
  country: PropTypes.string.isRequired,
  fieldType: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export const AddressFieldCountrySelect = (props) => {

}
