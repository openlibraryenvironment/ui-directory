import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Button,
  Col,
  MessageBanner,
  Select,
  TextField,
} from '@folio/stripes/components';

import { EditCard, withKiwtFieldArray } from '@folio/stripes-erm-components';

import pluginGeneric from '@folio/address-plugin-generic';
import pluginUSA from '@folio/address-plugin-usa';
import pluginGBR from '@folio/address-plugin-gbr';
// import pluginCAN from '@folio/address-plugin-can';
// ... etc ...

import { getExistingLineField } from '@folio/address-utils';

import { required } from '../../../util/validators';

const addressPlugins = {
  generic: pluginGeneric,
  usa: pluginUSA,
  gbr: pluginGBR,
  // can: pluginCAN,
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
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }).isRequired,
  };

  state = {
    selectedAddressFormat: {},
    warning: {}
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

  selectPlugin(index, initialLocality) {
    const locality = this.state.selectedAddressFormat[index] || initialLocality;
    const warning = this.state.warning[index];
    const { intl } = this.props;

    const plugin = addressPlugins[locality] ? addressPlugins[locality] : addressPlugins.generic;

    if (((plugin !== addressPlugins.generic && plugin) || !locality) && warning) {
      this.setState((prevState) => {
        const newWarning = prevState.warning;
        newWarning[index] = '';
        return { 'warning': newWarning };
      });
    }

    if (locality && (!plugin || plugin === addressPlugins.generic) && !warning) {
      this.setState((prevState) => {
        const newWarning = prevState.warning;
        newWarning[index] = intl.formatMessage({ id: 'ui-directory.information.addresses.missingPlugin' });
        return { 'warning': newWarning };
      });
    }

    return plugin;
  }

  render() {
    const { intl, items } = this.props;
    const supportedAddressFormats = [
      { value: '', label: '', disabled: true },
      { value: 'usa', label: intl.formatMessage({ id: 'ui-directory.information.addresses.country.usa' }) },
      { value: 'gbr', label: intl.formatMessage({ id: 'ui-directory.information.addresses.country.gbr' }) },
      { value: 'can', label: intl.formatMessage({ id: 'ui-directory.information.addresses.country.can' }) },
      { value: 'generic', label: intl.formatMessage({ id: 'ui-directory.information.addresses.country.generic' }) }
    ];

    return (
      <>
        {items?.map((address, index) => {
          const existingCountry = getExistingLineField(address.lines, 'country')?.value;
          const plugin = this.selectPlugin(index, existingCountry);
          const locality = this.state.selectedAddressFormat[index] || existingCountry;
          return (
            <EditCard
              header={this.renderCardHeader(index)}
              key={`addresses[${index}].editCard`}
              onDelete={() => this.props.onDeleteField(index, address)}
            >
              {plugin && locality &&
                <Field
                  name={`${this.props.name}[${index}]`}
                >
                  {props => (
                    <plugin.addressFields
                      {...props}
                      textFieldComponent={TextField}
                      requiredValidator={required}
                      name={`${this.props.name}[${index}]`}
                      savedAddress={address}
                    />
                  )}
                </Field>
              }
              <Field
                name={`${this.props.name}[${index}].country`}
                initialValue={existingCountry}
                label={<FormattedMessage id="ui-directory.information.addresses.country" />}
                parse={v => v}
                required
                validate={required}
              >
                {props => (
                  <Select
                    {...props}
                    dataOptions={supportedAddressFormats}
                    onChange={(e) => {
                      props.input.onChange(e);
                      const selectedFormat = e.target.value;
                      this.setState((prevState) => {
                        const newSelectedAddress = prevState.selectedAddressFormat;
                        newSelectedAddress[index] = selectedFormat;
                        return { 'selectedAddressFormat': newSelectedAddress };
                      });
                    }}
                  />
                )}
              </Field>
              {this.state.warning?.[index] ? <MessageBanner type="warning"> {this.state.warning?.[index]} </MessageBanner> : null}
            </EditCard>
          );
        })}
        {this.renderAddAddress()}
      </>
    );
  }
}

export default injectIntl(withKiwtFieldArray(AddressListFieldArray));
