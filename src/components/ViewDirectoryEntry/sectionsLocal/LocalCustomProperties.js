import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion } from '@folio/stripes/components';


class LocalCustomProperties extends React.Component {
  static propTypes = {
    record: PropTypes.object,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  render() {
    const pFull = this.props.record.customProperties || {};
    const pLocalKeys = Object.keys(pFull).filter(key => pFull[key][0].type.defaultInternal === true);
    const p = _.pick(pFull, pLocalKeys);
    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-directory.information.local.heading.customProps" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <ul>
          {
            Object.keys(p).sort().map(key => (
              <li key={key}>
                <b>{key}</b>
                :
                <pre>{JSON.stringify(p[key], null, 2)}</pre>
              </li>
            ))
          }
        </ul>
      </Accordion>
    );
  }
}

export default LocalCustomProperties;