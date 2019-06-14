import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route, Switch } from 'react-router-dom';
import DirectoryEntries from './routes/DirectoryEntries';
import Settings from './settings';

class Directory extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    actAs: PropTypes.string.isRequired,
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
      actAs,
      match: {
        path
      }
    } = this.props;

    if (actAs === 'settings') {
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
          render={() => <this.connectedDirectoryEntries {...this.props} />}
        />
      </Switch>
    );
  }
}

export default Directory;
