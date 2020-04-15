import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Button,
  Select,
  TextField,
} from '@folio/stripes/components';

import { EditCard, withKiwtFieldArray } from '@folio/stripes-erm-components';

import { required } from '../../../util/validators';

class AddressListField extends React.Component {
  static propTypes = {
  };

  renderAddSymbol = () => {
    return (
      <Button
        id="add-symbol-btn"
        onClick={() => this.props.onAddField()}
      >
        <FormattedMessage id="ui-directory.information.addresses.add" />
      </Button>
    );
  }

  render() {
    return (
      <p>Hi there</p>
    );
  }
}

export default withKiwtFieldArray(AddressListField);
