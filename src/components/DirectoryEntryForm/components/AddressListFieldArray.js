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

import pluginUSA from '@folio/address-plugin-usa';
// import pluginUK from '@folio/address-plugin-uk';
// import pluginFrance from '@folio/address-plugin-france';
// ... etc ...

import { getExistingLineField } from '@folio/address-utils';

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

    const plugin = locality ? addressPlugins[locality] : undefined;
    if ((plugin || !locality) && warning) {
      this.setState((prevState) => {
        const newWarning = prevState.warning;
        newWarning[index] = '';
        return { 'warning': newWarning };
      });
    }
    if (locality && !plugin && !warning) {
      this.setState((prevState) => {
        const newWarning = prevState.warning;
        newWarning[index] = intl.formatMessage({ id: 'ui-directory.information.addresses.missingPlugin' });
        return { 'warning': newWarning };
      });
    }
    return plugin;
  }

  render() {
    const { items } = this.props;
    const supportedAddressFormats = [
      { value: '', label: '', disabled: true },
      { value: 'usa', label: 'USA' },
      { value: 'gbr', label: 'Great Britain' },
      { value: 'can', label: 'Canada' },
    ];

    return (
      <>
        {items?.map((address, index) => {
          const existingCountry = getExistingLineField(address.lines, 'country')?.value;
          const plugin = this.selectPlugin(index, existingCountry);
          return (
            <EditCard
              header={this.renderCardHeader(index)}
              key={`addresses[${index}].editCard`}
              onDelete={() => this.props.onDeleteField(index, address)}
            >
              {plugin &&
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
