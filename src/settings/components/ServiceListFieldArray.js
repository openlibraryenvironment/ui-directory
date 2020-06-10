import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Button,
  Col,
  Row,
  Select,
  TextField,
} from '@folio/stripes/components';

import { EditCard } from '@folio/stripes-erm-components';

import { required } from '../../util/validators';

class ServiceListFieldArray extends React.Component {
  static propTypes = {
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }).isRequired,
  };

  render() {
    console.log("SLFA PROPS: %o", this.props)
    return (
      <>
        <p> Hi there </p>
      </>
    );
  }
}

export default injectIntl(ServiceListFieldArray);
