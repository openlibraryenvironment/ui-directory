import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
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

import permissionToEdit from '../../util/permissionToEdit';
import getRefdataValuesFromParentResources from '../../util/getRefdataValuesFromParentResources';
import DirectoryEntryForm from '../DirectoryEntryForm';

const defaultSubmit = (directory, dispatch, props) => {
  return props.onUpdate(directory)
    .then(() => props.onCancel());
};

const plugins = [pluginGeneric, pluginNA, pluginGBR];
const pluginMap = {};
plugins.forEach(plugin => {
  plugin.listOfSupportedCountries.forEach(country => {
    pluginMap[country] = plugin;
  });
});

const EditDirectoryEntry = (props) => {
  // Destructure this separately because onSubmit appears to take the entirety of props atm...?
  const {
    initialValues,
    onCancel,
    onSubmit = defaultSubmit,
    resources,
    stripes,
    parentResources
  } = props;

  const intl = useIntl();

  const layer = resources?.query?.layer ?? parentResources?.query?.layer;

  const renderFirstMenu = () => {
    return (
      <PaneMenu>
        <FormattedMessage id="ui-directory.closeNewDirectoryEntry">
          {ariaLabel => (
            <IconButton
              icon="times"
              id="close-directory-form-button"
              onClick={onCancel}
              aria-label={ariaLabel}
            />
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  };

  const renderLastMenu = (pristine, submitting, submit) => {
    let id;
    let label;
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
  };

  const selectPlugin = (domain) => {
    if (!domain) {
      return undefined;
    }

    const plugin = pluginMap[domain] ?? pluginMap.Generic;

    if (!plugin) {
      throw new Error(intl.formatMessage({ id: 'ui-directory.information.addresses.missingPlugin' }));
    }
    return plugin;
  };

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

  if (!permissionToEdit(stripes, initialValues) && !stripes.hasPerm('ui-directory.create')) {
    // Users should never see this message, so no need to internationalize
    return 'no perm';
  }


  // TODO this seems like terrible code...
  // This allows the initial values to hold the current parent value
  if (initialValues) {
    initialValues.parent = initialValues.parent?.id;
    initialValues.type = initialValues.type?.id;

    if (initialValues.services) {
      const newServices = [];
      initialValues.services.forEach(serviceacct => {
        newServices.push({ ...serviceacct, service: serviceacct.service.id });
      });
      initialValues.services = newServices;
    }
  }

  // the submit handler passed in from SearchAndSort expects props as provided by redux-form
  const compatSubmit = values => {
    // Not submitting values itself because then on failure data changes shape
    const submitValues = { ...values };

    // When creating a NEW entry we want to set status to managed, but when editing an existing one we want to leave alone
    if (layer === 'create' || layer === 'unit') {
      // When creating a root or new entry, the layer is "create" or "unit", else layer is "edit"
      const managedStatus = getRefdataValuesFromParentResources(parentResources, 'DirectoryEntry.Status')
        .filter(obj => obj.label === 'Managed')[0] || {};
      submitValues.status = managedStatus.value;
    }

    if (values.parent) {
      submitValues.parent = { id: values.parent };
    }

    if (values.services) {
      const newServices = [];
      values.services.forEach(serviceacct => {
        newServices.push({ ...serviceacct, service: { id: serviceacct.service } });
      });
      submitValues.services = newServices;
    }

    submitValues.symbols = values.symbols?.map(obj => (obj?.authority?.id ? obj : ({ ...obj, authority: { id: obj.authority } })));

    if (submitValues.addresses) {
      const newAddresses = [];
      submitValues.addresses.forEach((address) => {
        if (address._delete === true) {
          // If we're deleting the address we can just leave it as is
          newAddresses.push(address);
        } else {
          const plugin = selectPlugin(address.countryCode);
          const newAddress = plugin.fieldsToBackend(address);
          // The plugins do not have the notion of seq
          // so we obtain their fieldOrder and add that manually
          const fieldOrder = plugin.fieldOrder;
          newAddress.lines.forEach(line => {
            const lineType = line.type?.value;
            line.seq = fieldOrder[lineType];
          });
          newAddresses.push(newAddress);
        }
      });
      submitValues.addresses = newAddresses;
    }
    onSubmit(submitValues, null, props);
  };

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
            firstMenu={renderFirstMenu()}
            lastMenu={renderLastMenu(pristine, submitting, handleSubmit)}
            paneTitle={paneTitle}
          >
            <Layout className="centered" style={{ maxWidth: '80em' }}>
              <DirectoryEntryForm values={values} form={form} {...props} />
              <FormattedMessage id="ui-directory.confirmDirtyNavigate">
                {prompt => <Prompt when={!pristine && !(submitting || submitSucceeded)} message={prompt} />}
              </FormattedMessage>
            </Layout>
          </Pane>
        </form>
      )}
    </Form>
  );
};

EditDirectoryEntry.propTypes = {
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
};

export default EditDirectoryEntry;
