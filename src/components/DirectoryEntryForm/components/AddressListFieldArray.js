import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Field } from 'react-final-form';

import { useKiwtFieldArray } from '@k-int/stripes-kint-components';

import {
  Button,
  Col,
  MessageBanner,
  Select,
  TextField,
} from '@folio/stripes/components';

import { EditCard } from '@folio/stripes-erm-components';

import pluginGeneric from '@k-int/address-plugin-generic';
import pluginNA from '@k-int/address-plugin-north-america';
import pluginGBR from '@k-int/address-plugin-british-isles';

import { required } from '../../../util/validators';

const plugins = [pluginGeneric, pluginNA, pluginGBR];
const pluginMap = {};
plugins.forEach(plugin => {
  plugin.listOfSupportedCountries.forEach(country => {
    pluginMap[country] = plugin;
  });
});

const AddressListFieldArray = ({
  fields: {
    name
  }
}) => {
  const intl = useIntl();

  const {
    items,
    onAddField,
    onDeleteField
  } = useKiwtFieldArray(name);

  const renderAddAddress = () => {
    return (
      <Button
        id="add-address-btn"
        onClick={() => onAddField()}
      >
        <FormattedMessage id="ui-directory.information.addresses.add" />
      </Button>
    );
  };

  const renderCardHeader = (index) => {
    return (
      <Col xs={8}>
        <Field
          name={`${name}[${index}].addressLabel`}
          component={TextField}
          placeholder={intl.formatMessage({ id: 'ui-directory.information.addresses.namePlaceholder' })}
          required
          validate={required}
        />
      </Col>
    );
  };

  const renderWarning = (domain, plugin) => {
    let warning = '';
    if (domain && (!plugin || (plugin === pluginMap.Generic && domain !== 'Generic')) && !warning) {
      warning = intl.formatMessage({ id: 'ui-directory.information.addresses.missingPlugin' });
    }
    return (
      warning ? (
        <MessageBanner type="warning">
          {warning}
        </MessageBanner>
      ) : null
    );
  }

  const supportedAddressFormats = [{ value: '', label: '', disabled: true }];
  plugins.forEach(plugin => {
    plugin.listOfSupportedCountries.forEach(country => {
      supportedAddressFormats.push({ value: country, label: intl.formatMessage({ id: `ui-${plugin.pluginName}.${country}.countryCode` }) });
    });
  });

  return (
    <>
      {items?.map((address, index) => {
        const domain = address.countryCode;
        const plugin = pluginMap[domain] ? pluginMap[domain] : pluginMap.Generic;

        return (
          <EditCard
            header={renderCardHeader(index)}
            key={`${name}[${index}].editCard`}
            onDelete={() => onDeleteField(index, address)}
          >
            <Field
              name={`${name}[${index}].countryCode`}
              label={<FormattedMessage id="ui-directory.information.addresses.format" />}
              parse={v => v}
              required
              validate={required}
            >
              {({ input }) => (
                <Select
                  {...input}
                  dataOptions={supportedAddressFormats}
                />
              )}
            </Field>
            {plugin && domain &&
              <Field
                name={`${name}[${index}]`}
              >
                {props => {
                  return (
                    <plugin.addressFields
                      {...props}
                      country={domain}
                      textFieldComponent={TextField}
                      name={`${name}[${index}]`}
                      savedAddress={address}
                    />
                  );
                }}
              </Field>
            }
            {renderWarning(domain, plugin)}
          </EditCard>
        );
      })}
      {renderAddAddress()}
    </>
  );
}

AddressListFieldArray.propTypes = {
  name: PropTypes.string,
};

export default AddressListFieldArray;
