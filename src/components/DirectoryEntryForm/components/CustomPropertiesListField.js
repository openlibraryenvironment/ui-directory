import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Col,
  Row,
  Select,
  TextArea,
  TextField,
} from '@folio/stripes/components';
import { EditCard } from '@folio/stripes-erm-components';
import { isEmpty } from 'lodash';

const TERM_TYPE_TEXT = 'com.k_int.web.toolkit.custprops.types.CustomPropertyText'; // eslint-disable-line no-unused-vars
const TERM_TYPE_NUMBER = 'com.k_int.web.toolkit.custprops.types.CustomPropertyInteger';
const TERM_TYPE_SELECT = 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata';

const CustomPropertiesListField = ({
  availableCustProps,
  input: { onChange, value },
  tab
}) => {
  const [errors, setErrors] = useState({});
  const custPropsLocal = availableCustProps.filter(custprop => custprop.defaultInternal);
  const custPropsShared = availableCustProps.filter(custprop => !custprop.defaultInternal);

  let custProps = [];
  if (tab === 'local') {
    custProps = custPropsLocal;
  } else {
    custProps = custPropsShared;
  }

  const getCustProp = (custPropValue) => {
    return availableCustProps.find(cp => cp.value === custPropValue);
  };

  const isInvalid = (values) => {
    const err = {};

    custProps.forEach((cp) => {
      const { note, publicNote, value: theVal } = values?.[cp.value]?.[0] ?? {};

      if (!cp.primary && cp.value && !value) {
        err[cp.value] = <FormattedMessage id="stripes-core.label.missingRequiredField" />;
      }

      if ((note && !theVal) || (publicNote && !theVal)) {
        err[cp.value] = <FormattedMessage id="ui-directory.errors.custPropsNoteWithoutValue" />;
      }
    });

    setErrors({ err });

    return Object.keys(err).length > 0;
  };

  const renderCustPropValue = (cp, i) => {
    const currentValue = value[cp.value] ? value[cp.value][0] : {};

    // Initialise to just the value (for text/number values)
    // and then check if it's an object (for Select/refdata values).
    let controlledFieldValue = currentValue.value;
    if (controlledFieldValue && controlledFieldValue.value) {
      controlledFieldValue = controlledFieldValue.value;
    }

    // Figure out which component we're rendering and specify its unique props.
    let FieldComponent = TextArea;
    const fieldProps = {};
    if (cp.type === TERM_TYPE_SELECT) {
      FieldComponent = Select;
      fieldProps.dataOptions = cp.options;
    }

    if (cp.type === TERM_TYPE_NUMBER) {
      FieldComponent = TextField;
      fieldProps.type = 'number';
    }

    const handleChange = e => {
      onChange({
        ...value,
        [cp.value]: [{
          ...currentValue,
          _delete: e.target.value === '' ? true : undefined, // Delete custprop if removing the value.
          value: e.target.value
        }],
      });
    };

    return (
      <FieldComponent
        data-test-custprop-value
        id={`edit-custprop-${i}-value`}
        onChange={handleChange}
        value={controlledFieldValue}
        error={!isEmpty(errors) ? errors[cp.value] : undefined}
        {...fieldProps}
      />
    );
  };

  const renderCustProps = () => {
    return custProps.map((cp, i) => {
      const header = cp.label;
      return (
        <EditCard
          header={header}
          key={cp.value}
        >
          <Row>
            <Col xs={12} md={6}>
              {renderCustPropValue(cp, i)}
            </Col>
          </Row>
        </EditCard>
      );
    });
  };

  return (
    <div>
      {renderCustProps()}
    </div>
  );
};

CustomPropertiesListField.propTypes = {
  input: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    onChange: PropTypes.func,
  }),
  meta: PropTypes.object,
  availableCustProps: PropTypes.arrayOf(PropTypes.shape({
    description: PropTypes.string,
    label: PropTypes.string.isRequired,
    options: PropTypes.array,
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    defaultInternal: PropTypes.bool,
  })).isRequired,
  tab: PropTypes.string,
};

export default CustomPropertiesListField;
