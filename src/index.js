import React from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
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
    mutator: PropTypes.object,
    resources: PropTypes.object,
    stripes: PropTypes.shape({
      connect: PropTypes.func,
    }),
  }

  constructor(props) {
    super(props);
    this.connectedDirectoryEntries = props.stripes.connect(DirectoryEntries);
  }

  render() {
    if (this.props.showSettings) {
      return <Settings {...this.props} />;
    }
    return (
      <Switch>
        <Route
          path={`${match.path}/entries`}
          render={() => <this.connectedDirectoryEntries stripes={stripes} />}
        />
        <Redirect
          exact
          from={`${match.path}`}
          to={`${match.path}/entries`}
        />
      </Switch>
    );
  }
}

export default Directory;
