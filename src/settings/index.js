import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Settings } from '@folio/stripes/smart-components';
import TagSettings from './TagSettings';
import StatusSettings from './StatusSettings';
import ServiceSettings from './ServiceSettings';

export default class DirectorySettings extends React.Component {
  pages = [
    {
      route: 'tags',
      label: <FormattedMessage id="ui-directory.settings.tags" />,
      component: TagSettings,
    },
    {
      route: 'services',
      label: <FormattedMessage id="ui-directory.settings.services" />,
      component: ServiceSettings,
    },
    {
      route: 'status',
      label: <FormattedMessage id="ui-directory.settings.status" />,
      component: StatusSettings,
    },
  ];

  render() {
    return (
      <Settings {...this.props} pages={this.pages} paneTitle="Directory" />
    );
  }
}
