import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Accordion,
  Col,
  MessageBanner,
  Row,
  Select,
  TextField,
} from '@folio/stripes/components';


import { required } from '../../../util/validators';

class DirectoryEntryFormInfo extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    parentResources: PropTypes.shape({
      typeValues: PropTypes.object,
      records: PropTypes.object,
    }),
    values: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      directoryEntryValues: [],
      selectedParent: '',
      warning: '',
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { parentResources, values } = props;
    const newState = {};

    // TODO the blank option below is used to allow "unsetting" of parent whilst waiting for component https://issues.folio.org/browse/STCOM-576
    if (parentResources.records.records.length !== state.directoryEntryValues.length) {
      newState.directoryEntryValues = [
        { value: '', label: '' },
        ...parentResources.records.records.map(obj => ({ value: obj.id, label: obj.fullyQualifiedName })).filter(obj => {
          if (values) {
            return obj.value !== values.id;
          } else {
            return obj.value;
          }
        }),
      ];
    }
    if (Object.keys(newState).length) return newState;

    return null;
  }

  render() {
    const { directoryEntryValues, selectedParent, warning } = this.state;
    const { values } = this.props;
    console.log("DEFI Props: %o", this.props)
    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-directory.information.heading.directoryEntry" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <React.Fragment>
          <Row>
            <Col xs={5}>
              <Field
                id="edit-directory-entry-name"
                name="name"
                label={<FormattedMessage id="ui-directory.information.name" />}
                validate={required}
                required
              >
                {props => (
                  <TextField
                    {...props}
                    onChange={(e) => {
                      props.input.onChange(e);
                      const inputValue = e.target.value;
                      let warningMessage = '';

                      if (inputValue != null && selectedParent.includes(inputValue)) {
                        warningMessage = <FormattedMessage id="ui-directory.information.parent.warning" />;
                      }
                      this.setState({ warning: warningMessage });
                    }}
                    placeholder="Name"
                  />
                )}

              </Field>
            </Col>
            <Col xs={2}>
              <FormattedMessage id="ui-directory.information.status">
                {placeholder => (
                  <Field
                    id="edit-directory-entry-status"
                    name="status"
                    label={placeholder}
                    component={TextField}
                    placeholder={placeholder}
                  />
                )}
              </FormattedMessage>
            </Col>
            <Col xs={5}>
              <FormattedMessage id="ui-directory.information.slug">
                {placeholder => (
                  <Field
                    id="edit-directory-entry-slug"
                    name="slug"
                    label={placeholder}
                    component={TextField}
                    placeholder={placeholder}
                    disabled={values?.id !== undefined}
                    required
                    validate={required}
                  />
                )}
              </FormattedMessage>
            </Col>
          </Row>
          {this.props.values?.parent &&
          <Row>
            <Col xs={6}>
              <Field
                id="edit-directory-entry-parent"
                name="parent"
                label={<FormattedMessage id="ui-directory.information.parent" />}
              >
                {props => (
                  <Select
                    {...props}
                    dataOptions={directoryEntryValues}
                    onChange={(e) => {
                      props.input.onChange(e);

                      // The below is finding the selected index and then grabbing the label of that element (saves doing a separate lookup)
                      const selectedValue = e.target[e.target.selectedIndex].text;
                      this.setState({ selectedParent: selectedValue });

                      let warningMessage = '';

                      if (values.name != null && selectedValue.includes(values.name)) {
                        warningMessage = <FormattedMessage id="ui-directory.information.parent.warning" />;
                      }
                      this.setState({ warning: warningMessage });
                    }}
                    placeholder=" "
                    disabled
                  />
                )}
              </Field>
            </Col>
          </Row>
          }
          <Row>
            <Col xs={4}>
              <Field
                id="edit-directory-entry-phone-number"
                name="phoneNumber"
                component={TextField}
                label={<FormattedMessage id="ui-directory.information.phoneNumber" />}
                validate={required}
                required
              />
            </Col>
            <Col xs={4}>
              <Field
                id="edit-directory-entry-email-address"
                name="emailAddress"
                component={TextField}
                label={<FormattedMessage id="ui-directory.information.emailAddress" />}
                validate={required}
                required
              />
            </Col>
            <Col xs={4}>
              <Field
                id="edit-directory-entry-contact-name"
                name="contactName"
                component={TextField}
                label={<FormattedMessage id="ui-directory.information.contactName" />}
                validate={required}
                required
              />
            </Col>
          </Row>
          {warning ? <MessageBanner type="warning"> {warning} </MessageBanner> : null}
        </React.Fragment>
      </Accordion>
    );
  }
}

export default DirectoryEntryFormInfo;
