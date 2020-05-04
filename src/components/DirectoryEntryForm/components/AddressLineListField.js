import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
} from '@folio/stripes/components';

import { withKiwtFieldArray } from '@folio/stripes-erm-components';

import { AddressFieldText } from './SpecificAddressForms/AddressFields';

class AddressLineListField extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      seq: PropTypes.number.isRequired,
    })),
    name: PropTypes.string.isRequired,
  };

  findIndexByType(type) {
    // This function is in place to ensure that the array getting jumbled up doesn't break the edit order
    const { items } = this.props;
    return items.findIndex(item => item.type?.value === type.toLowerCase());
  }


  render() {
    const { name } = this.props;
    // ToDo -- figure out a way to do this a bit more dynamically in future
    return (
      <>
        <Row>
          <Col xs={4}>
            <AddressFieldText name={`${name}[${this.findIndexByType('premise')}].value`} country="US" fieldType="premise" />
          </Col>
          <Col xs={4}>
            <AddressFieldText name={`${name}[${this.findIndexByType('thoroughfare')}].value`} country="US" fieldType="thoroughfare" />
          </Col>
          <Col xs={4}>
            <AddressFieldText name={`${name}[${this.findIndexByType('locality')}].value`} country="US" fieldType="locality" />
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <AddressFieldText name={`${name}[${this.findIndexByType('administrativeArea')}].value`} country="US" fieldType="administrativeArea" />
          </Col>
          <Col xs={4}>
            <AddressFieldText name={`${name}[${this.findIndexByType('postalCode')}].value`} country="US" fieldType="postalCode" />
          </Col>
        </Row>
      </>
    );
  }
}

export default withKiwtFieldArray(AddressLineListField);
