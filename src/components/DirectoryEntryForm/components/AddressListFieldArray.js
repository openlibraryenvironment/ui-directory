import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Button,
  Col,
  TextField,
} from '@folio/stripes/components';

import { EditCard, withKiwtFieldArray } from '@folio/stripes-erm-components';

import pluginUSA from '@folio/address-plugin-usa';
// import pluginUK from '@folio/address-plugin-uk';
// import pluginFrance from '@folio/address-plugin-france';
// ... etc ...

import { required } from '../../../util/validators';

const addressPlugins = {
  usa: pluginUSA,
  // uk: pluginUK,
  // france: pluginFrance,
  // ... etc ...
};


class AddressListFieldArray extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      map: PropTypes.func,
    })),
    name: PropTypes.string,
    onAddField: PropTypes.func.isRequired,
    onDeleteField: PropTypes.func.isRequired,
  };

  renderAddAddress = () => {
    return (
      <Button
        id="add-address-btn"
        onClick={() => this.props.onAddField()}
      >
        <FormattedMessage id="ui-directory.information.addresses.add" />
      </Button>
    );
  }

  renderCardHeader = (index) => {
    const { intl } = this.props;
    return (
      <Col xs={8}>
        <Field
          name={`addresses[${index}].addressLabel`}
          component={TextField}
          placeholder={intl.formatMessage({ id: 'ui-directory.information.addresses.namePlaceholder' })}
          required
          validate={required}
        />
      </Col>
    );
  }

  render() {
    const locality = 'usa'; // We might get this from the user via a <select>
    const plugin = addressPlugins[locality];
    if (!plugin) return <div>No such address plugin!</div>;

    const { items } = this.props;
    return (
      <>
        {items?.map((address, index) => {
          return (
            <EditCard
              header={this.renderCardHeader(index)}
              key={`addresses[${index}].editCard`}
              onDelete={() => this.props.onDeleteField(index, address)}
            >
              <Field
                name={`${this.props.name}[${index}]`}
              >
                {props => (
                  <plugin.addressForm
                    {...props}
                    textFieldComponent={TextField}
                    name={`${this.props.name}[${index}]`}
                  />
                )}
              </Field>
            </EditCard>

          );
        })}
        {this.renderAddAddress()}
      </>
    );
  }
}

export default injectIntl(withKiwtFieldArray(AddressListFieldArray));
