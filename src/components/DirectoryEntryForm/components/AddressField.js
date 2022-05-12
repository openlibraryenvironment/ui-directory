import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Field, useForm, useFormState } from 'react-final-form';

import {
  Col,
  MessageBanner,
  Select,
  TextField,
} from '@folio/stripes/components';

import { EditCard } from '@folio/stripes-erm-components';

import { required } from '../../../util/validators';

import { pluginMap, useSupportedAddressFormats } from "../../../util/pluginMap";
import { useEffect } from 'react';

const AddressField = ({
  address = {},
  index,
  name,
  onDeleteField
}) => {
  const intl = useIntl();
  const supportedAddressFormats = useSupportedAddressFormats();
  const domain = address.countryCode;
  const plugin = pluginMap[domain] ? pluginMap[domain] : pluginMap.Generic;

  const { change } = useForm();
  const { values } = useFormState();

  useEffect(() => {
    const { addressLabel, countryCode, lines, ..._restOfAddress } = address;
    
    // When changing country code, automatically change country field with it
    const newCountry = intl.formatMessage({ id: `ui-${plugin.pluginName}.${countryCode}.countryCode` })

    const newAddress = {
      addressLabel,
      countryCode,
      lines,
      ...plugin.backendToFields(address),
      country: newCountry
    };

    change(`${name}[${index}]`, newAddress);
  }, [address.countryCode]);

  const renderWarning = () => {
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

  const renderCardHeader = () => {
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

  return (
    <EditCard
      header={renderCardHeader()}
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
      {renderWarning()}
    </EditCard>
  );
};

AddressField.propTypes = {
  address: PropTypes.object,
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  onDeleteField: PropTypes.func.isRequired
};

export default AddressField;
