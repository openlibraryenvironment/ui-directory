import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Button,
  Col,
  Row,
  TextField,
} from '@folio/stripes/components';

import { EditCard, withKiwtFieldArray } from '@folio/stripes-erm-components';

import pluginUSA from '@folio/address-plugin-usa';
// import pluginUK from '@folio/address-plugin-uk';
// import pluginFrance from '@folio/address-plugin-france';
// ... etc ...

import AddressListField from './AddressListField';
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
    const defaultLines = [
      {
        seq: 0,
        type: { value: 'Department' },
      },
      {
        seq: 1,
        type: { value: 'Premise' },
      },
      {
        seq: 2,
        type: { value: 'Thoroughfare' },
      },
      {
        seq: 3,
        type: { value: 'PostBox' },
      },
      {
        seq: 4,
        type: { value: 'Locality' },
      },
      {
        seq: 5,
        type: { value: 'AdministrativeArea' },
      },
      {
        seq: 6,
        type: { value: 'PostalCode' },
      },
    ];

    return (
      <Button
        id="add-address-btn"
        //onClick={() => this.props.onAddField({ lines: defaultLines })}
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
          /* <Field
            name={`${this.props.name}[${index}]`}
            component={AddressListField}
            key={index}
            index={index}
            address={address}
            onDeleteField={() => this.props.onDeleteField(index, address)}
          /> */
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
