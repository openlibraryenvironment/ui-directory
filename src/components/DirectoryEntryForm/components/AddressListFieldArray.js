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
import pluginNA from '@folio/address-plugin-north-america';
import pluginGBR from '@folio/address-plugin-british-isles';

import { getExistingLineField } from '@folio/address-utils';

import { required } from '../../../util/validators';

const plugins = [pluginGeneric, pluginNA, pluginGBR];
const pluginMap = {};
plugins.forEach(plugin => {
  plugin.listOfSupportedCountries.forEach(country => {
    pluginMap[country] = plugin;
  });
});

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
          name={`${this.props.name}[${index}].addressLabel`}
          component={TextField}
          placeholder={intl.formatMessage({ id: 'ui-directory.information.addresses.namePlaceholder' })}
          required
          validate={required}
        />
      </Col>
    );
  }

  selectPlugin(index, initialDomain) {
    const domain = this.state.selectedAddressFormat[index] || initialDomain;
    const warning = this.state.warning[index];
    const { intl } = this.props;
    const plugin = pluginMap[domain] ? pluginMap[domain] : pluginMap.Generic;

    if ((((plugin !== pluginMap.Generic || domain === 'Generic') && plugin) || !domain) && warning) {
      this.setState((prevState) => {
        const newWarning = prevState.warning;
        newWarning[index] = '';
        return { 'warning': newWarning };
      });
    }

    if (domain && (!plugin || (plugin === pluginMap.Generic && domain !== 'Generic')) && !warning) {
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
    const supportedAddressFormats = [{ value: '', label: '', disabled: true }];
    plugins.forEach(plugin => {
      plugin.listOfSupportedCountries.forEach(country => {
        supportedAddressFormats.push({ value: country, label: intl.formatMessage({ id: `ui-${plugin.pluginName}.countryCode.${country}` }) });
      });
    });

    return (
      <>
        {items?.map((address, index) => {
          const existingCountry = address.countryCode;
          const plugin = this.selectPlugin(index, existingCountry);
          const domain = this.state.selectedAddressFormat[index] || existingCountry;
          return (
            <EditCard
              header={this.renderCardHeader(index)}
              key={`${this.props.name}[${index}].editCard`}
              onDelete={() => this.props.onDeleteField(index, address)}
            >
              <Field
                name={`${this.props.name}[${index}].countryCode`}
                label={<FormattedMessage id="ui-directory.information.addresses.format" />}
                parse={v => v}
                required
                validate={required}
              >
                {({ input, meta }) => (
                  <Select
                    {...input}
                    dataOptions={supportedAddressFormats}
                    onChange={(e) => {
                      input.onChange(e);
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
              {plugin && domain &&
                <Field
                  name={`${this.props.name}[${index}]`}
                >
                  {props => {
                    return (
                      <plugin.addressFields
                        {...props}
                        country={domain}
                        textFieldComponent={TextField}
                        requiredValidator={required}
                        name={`${this.props.name}[${index}]`}
                        savedAddress={address}
                      />
                    );
                  }}
                </Field>
              }
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
