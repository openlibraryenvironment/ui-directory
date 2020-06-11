import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Card,
  Col,
  KeyValue,
  Row,
  Select,
  TextField,
} from '@folio/stripes/components';

import { Field } from 'react-final-form';

import { FormattedMessage } from 'react-intl';

class ServiceField extends React.Component {
  state = {
    editing: false,
  };

  handleSave = () => {
    this.props.onSave()
      .then(() => this.setState({ editing: false }));
  }

  handleEdit = () => {
    this.setState({
      editing: true,
    });
  }

  handleCancel = () => {
    const { input: { name }, meta, mutators } = this.props;

    mutators.setServiceValue(name, meta.initial);
    this.setState({ editing: false });
  }

  renderEditButton() {
    const { editing } = this.state;
    const EditText = editing ? <FormattedMessage id="ui-directory.settings.services.finish-editing" /> :
    <FormattedMessage id="ui-directory.settings.services.edit" />;

    return (
      <Button
        bottomMargin0
        onClick={(e) => {
          e.preventDefault();
          return (
            editing ? this.handleSave() : this.handleEdit()
          );
        }}
        type={editing ? 'submit' : undefined}
      >
        {EditText}
      </Button>
    );
  }

  renderDeleteCancelButton() {
    const { editing } = this.state;
    const { onDelete } = this.props;
    const ButtonText = editing ? <FormattedMessage id="ui-directory.settings.services.cancel" /> :
    <FormattedMessage id="ui-directory.settings.services.delete" />;

    return (
      <Button
        bottomMargin0
        buttonStyle={editing ? undefined : 'danger'}
        onClick={(e) => {
          e.preventDefault();
          return (
            editing ? this.handleCancel() : onDelete()
          );
        }}
      >
        {ButtonText}
      </Button>
    );
  }

  renderCardHeader() {
    const { editing } = this.state;
    const { currentService } = this.props.serviceData;
    return (
      editing ?
        <Col xs={10}>
          <Field
            name={`${this.props.input.name}.name`}
            component={TextField}
            parse={v => v}
          />
        </Col> : <strong> {currentService?.name} </strong>
    );
  }

  renderFieldValue(value, label, refdatacat = null) {
    const { serviceData: { functions, types } } = this.props;
    return (
      <KeyValue
        label={label}
        value={!refdatacat ? value : (refdatacat === 'types' ? types.filter(obj => obj.value === value)[0]?.label : functions.filter(obj => obj.value === value)[0]?.label)}
      />
    );
  }

  renderCardContents() {
    const { editing } = this.state;
    const { serviceData: { currentService, functions, types } } = this.props;
    const addressLabel = <FormattedMessage id="ui-directory.information.serviceAddress" />;
    const typeLabel = <FormattedMessage id="ui-directory.information.serviceType" />
    const functionlabel = <FormattedMessage id="ui-directory.information.serviceFunction" />

    return (
      <>
        <Row>
          <Col xs={6}>
            {editing ?
              <Field
                name={`${this.props.input.name}.type`}
                label={typeLabel}
                component={Select}
                dataOptions={types}
                parse={v => v}
              /> : this.renderFieldValue(currentService?.type, typeLabel, 'types')
            }
          </Col>
          <Col xs={6}>
            {editing ?
              <Field
                name={`${this.props.input.name}.businessFunction`}
                label={functionlabel}
                component={Select}
                dataOptions={functions}
                parse={v => v}
              /> : this.renderFieldValue(currentService?.businessFunction, functionlabel, 'functions')
            }
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            {editing ?
              <Field
                name={`${this.props.input.name}.address`}
                label={addressLabel}
                component={TextField}
                parse={v => v}
              /> : this.renderFieldValue(currentService?.address, addressLabel)
            }
          </Col>
        </Row>
      </>
    );
  }

  render() {
    return (
      <Card
        headerEnd={
          <span>
            {this.renderDeleteCancelButton()}
            {this.renderEditButton()}
          </span>
        }
        headerStart={this.renderCardHeader()}
        roundedBorder
      >
        {this.renderCardContents()}
      </Card>
    );
  }
}

export default ServiceField;
