import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { Prompt } from 'react-router-dom';

import {
  Button,
  IconButton,
  Layout,
  Pane,
  PaneMenu,
} from '@folio/stripes/components';

import pluginNA from '@folio/address-plugin-north-america';
import pluginGeneric from '@folio/address-plugin-generic';
import pluginGBR from '@folio/address-plugin-british-isles';
// import pluginCAN from '@folio/address-plugin-can';
// ... etc ...

import permissionToEdit from '../../util/permissionToEdit';
import DirectoryEntryForm from '../DirectoryEntryForm';

const defaultSubmit = (directory, dispatch, props) => {
  return props.onUpdate(directory)
    .then(() => props.onCancel());
};

const addressPlugins = {
  usa: pluginNA,
  generic: pluginGeneric,
  gbr: pluginGBR,
  // can: pluginCAN,
  // ... etc ...
};

class EditDirectoryEntry extends React.Component {
  static propTypes = {
    initialValues: PropTypes.object,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    onUpdate: PropTypes.func.isRequired,
    parentResources:PropTypes.shape({
      query: PropTypes.shape({
        layer: PropTypes.string,
      }),
    }),
    resources: PropTypes.shape({
      query: PropTypes.shape({
        layer: PropTypes.string,
      }),
    }),
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
    }).isRequired,
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }).isRequired,
  }

  static defaultProps = {
    onSubmit: defaultSubmit
  }

  getCurrentLayer() {
    const layer = this.props?.resources ? this.props?.resources?.query?.layer : this.props?.parentResources?.query?.layer;
    return layer;
  }

  renderFirstMenu() {
    return (
      <PaneMenu>
        <FormattedMessage id="ui-directory.closeNewDirectoryEntry">
          {ariaLabel => (
            <IconButton
              icon="times"
              id="close-directory-form-button"
              onClick={this.props.onCancel}
              aria-label={ariaLabel}
            />
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  }

  renderLastMenu(pristine, submitting, submit) {
    let id;
    let label;
    const layer = this.getCurrentLayer();

    if (layer === 'edit') {
      id = 'clickable-update-directory-entry';
      label = <FormattedMessage id="ui-directory.updateDirectoryEntryNoName" />;
    } else {
      id = 'clickable-create-directory-entry';
      label = <FormattedMessage id="ui-directory.create" />;
    }

    return (
      <PaneMenu>
        <Button
          id={id}
          type="submit"
          disabled={pristine || submitting}
          onClick={submit}
          buttonStyle="primary paneHeaderNewButton"
          marginBottom0
        >
          {label}
        </Button>
      </PaneMenu>
    );
  }

  selectPlugin(locality) {
    const { intl } = this.props;
    const plugin = locality ? (addressPlugins[locality] ? addressPlugins[locality] : addressPlugins.generic) : undefined;

    if (!plugin) {
      throw new Error(intl.formatMessage({ id: 'ui-directory.information.addresses.missingPlugin' }));
    }
    return plugin;
  }

  render() {
    const { initialValues, onSubmit, stripes } = this.props;

    if (!permissionToEdit(stripes, initialValues)) {
      // Users should never see this message, so no need to internationalize
      return 'no perm';
    }

    // This allows the initial values to hold the current parent value
    if (initialValues) {
      if (initialValues.parent) {
        initialValues.parent = initialValues.parent.id;
      }
      if (initialValues.type) {
        initialValues.type = initialValues.type.id;
      }
    }
    // the submit handler passed in from SearchAndSort expects props as provided by redux-form
    const compatSubmit = values => {
      // Not submitting values itself because then on failure data changes shape
      const submitValues = { ...values };

      if (values.parent) {
        submitValues.parent = { id: values.parent };
      }
      submitValues.symbols = values.symbols?.map(obj => (obj?.authority?.id ? obj : ({ ...obj, authority: { id: obj.authority } })));

      if (submitValues.addresses) {
        const newAddresses = [];
        submitValues.addresses.forEach((address) => {
          if (address._delete === true) {
            // If we're deleting the address we can just leave it as is
            newAddresses.push(address);
          } else {
            const plugin = this.selectPlugin(address.country);
            const newAddress = plugin.fieldsToBackend(address);
            newAddresses.push(newAddress);
          }
        });
        submitValues.addresses = newAddresses;
      }
      // console.log('Submitted values: %o', submitValues);
      onSubmit(submitValues, null, this.props);
    };

    const layer = this.getCurrentLayer();
    let paneTitle = <FormattedMessage id="ui-directory.notSet" />;
    switch (layer) {
      case 'edit':
        if (initialValues && initialValues.id) {
          paneTitle = <FormattedMessage id="ui-directory.updateDirectoryEntry" values={{ dirent: initialValues.name }} />;
        } else {
          paneTitle = <FormattedMessage id="ui-directory.updateDirectoryEntryNoName" />;
        }
        break;
      case 'unit':
        paneTitle = <FormattedMessage id="ui-directory.createUnitDirectoryEntry" />;
        break;
      case 'create':
        paneTitle = <FormattedMessage id="ui-directory.createDirectoryEntry" />;
        break;
      default:
        break;
    }

    return (
      <Form
        onSubmit={compatSubmit}
        initialValues={initialValues}
        keepDirtyOnReinitialize
        mutators={{
          ...arrayMutators,
        }}
      >
        {({ form, handleSubmit, pristine, submitting, submitSucceeded, values }) => (
          <form id="form-directory-entry">
            <Pane
              defaultWidth="100%"
              firstMenu={this.renderFirstMenu()}
              lastMenu={this.renderLastMenu(pristine, submitting, handleSubmit)}
              paneTitle={paneTitle}
            >
              <Layout className="centered" style={{ maxWidth: '80em' }}>
                <DirectoryEntryForm values={values} form={form} {...this.props} />
                <FormattedMessage id="ui-directory.confirmDirtyNavigate">
                  {prompt => <Prompt when={!pristine && !(submitting || submitSucceeded)} message={prompt} />}
                </FormattedMessage>
              </Layout>
            </Pane>
          </form>
        )}
      </Form>
    );
  }
}

export default injectIntl(EditDirectoryEntry);
