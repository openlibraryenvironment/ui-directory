import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import {
  Accordion,
  Col,
  Label,
  Row,
  TextField,
} from '@folio/stripes/components';

import pluginUSA from '@folio/address-plugin-usa';
// import pluginUK from '@folio/address-plugin-uk';
// import pluginFrance from '@folio/address-plugin-france';
// ... etc ...

import { AddressListFieldArray } from '../components';

const addressPlugins = {
  usa: pluginUSA,
  // uk: pluginUK,
  // france: pluginFrance,
  // ... etc ...
};


class DirectoryEntryFormContactInfo extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    parentResources: PropTypes.shape({
      typeValues: PropTypes.object,
      query: PropTypes.shape({
        layer: PropTypes.string,
      }),
      records: PropTypes.object,
    }),
    values: PropTypes.object,
  };


  getCurrentLayer() {
    const layer = this.props?.parentResources?.query?.layer;
    return layer;
  }

  render() {
    const locality = 'usa'; // We might get this from the user via a <select>
    const plugin = addressPlugins[locality];
    if (!plugin) return <div>No such address plugin!</div>;

    return (
      <>
        <Accordion
          id={this.props.id}
          label={<FormattedMessage id="ui-directory.information.heading.contactInformation" />}
          open={this.props.open}
          onToggle={this.props.onToggle}
        >
          <React.Fragment>
            <Row>
              <Col xs={4}>
                <Field
                  id="edit-directory-entry-phone-number"
                  name="phoneNumber"
                  component={TextField}
                  label={<FormattedMessage id="ui-directory.information.mainPhoneNumber" />}
                />
              </Col>
              <Col xs={4}>
                <Field
                  id="edit-directory-entry-email-address"
                  name="emailAddress"
                  component={TextField}
                  label={<FormattedMessage id="ui-directory.information.mainEmailAddress" />}
                />
              </Col>
              <Col xs={4}>
                <Field
                  id="edit-directory-entry-contact-name"
                  name="contactName"
                  component={TextField}
                  label={<FormattedMessage id="ui-directory.information.mainContactName" />}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <Label>
                  <FormattedMessage id="ui-directory.information.addresses" />
                </Label>

                <plugin.addressForm textFieldComponent={TextField} />

                <FieldArray
                  name="addresses"
                >
                  {({ fields, input, meta }) => <AddressListFieldArray {... { fields, input, meta }} /> }
                </FieldArray>
              </Col>
            </Row>
          </React.Fragment>
        </Accordion>
      </>
    );
  }
}

export default DirectoryEntryFormContactInfo;
