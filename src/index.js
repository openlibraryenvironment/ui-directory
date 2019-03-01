import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route, Switch } from 'react-router-dom';
import DirectoryEntries from './routes/directory-entries';
import Settings from './settings';

/*
  STRIPES-NEW-APP
  This is the main entry point into your new app.
*/

class Directory extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    showSettings: PropTypes.bool,
    stripes: PropTypes.shape({
      connect: PropTypes.func,
    }),
  };

  constructor(props) {
    super(props);
    this.connectedDirectoryEntries = props.stripes.connect(DirectoryEntries);
  }

  render() {
    const {
      showSettings,
      stripes,
      match: {
        path
      }
    } = this.props;

    if (showSettings) {
      return <Settings {...this.props} />;
    }
    return (
      <Switch>
        <Redirect
          exact
          from={path}
          to={`${path}/entries`}
        />
        <Route
          path={`${path}/entries`}
          render={() => <this.connectedDirectoryEntries stripes={stripes} />}
        />
      </Switch>
    );
  }
}

export default Directory;
