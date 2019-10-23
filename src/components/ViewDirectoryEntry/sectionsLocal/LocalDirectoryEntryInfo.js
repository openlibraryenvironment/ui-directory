import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

class LocalDirectoryEntryInfo extends React.Component {
  static propTypes = {
    record: PropTypes.object,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  render() {
    const { record } = this.props;

    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-directory.information.local.heading.directoryEntry" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <Row>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-directory.information.local.patronAccountBarcode" />}
              value={record.customProperties.local_patronAccountBarcode ? record.customProperties.local_patronAccountBarcode[0].value : '-'}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-directory.information.local.widget1" />}
              value={record.customProperties.local_widget_1 ? record.customProperties.local_widget_1[0].value : '-'}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-directory.information.local.widget2" />}
              value={record.customProperties.local_widget_2 ? record.customProperties.local_widget_2[0].value : '-'}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-directory.information.local.widget3" />}
              value={record.customProperties.local_widget_3 ? record.customProperties.local_widget_3[0].value : '-'}
            />
          </Col>
        </Row>
      </Accordion>
    );
  }
}

export default LocalDirectoryEntryInfo;
