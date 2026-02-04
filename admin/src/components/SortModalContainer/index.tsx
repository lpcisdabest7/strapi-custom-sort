// https://docs.strapi.io/dev-docs/migration/v4-to-v5/additional-resources/helper-plugin#usecmeditviewdatamanager
import { unstable_useContentManagerContext as useContentManagerContext } from '@strapi/strapi/admin';

import { Button } from '@strapi/design-system';

import { config } from '../../config';
import SortModal from '../SortModal';

//
// Components
//

/**
 * Returns the `<SortModal />` component if needed, meaning the current content type
 * supports sorting the entries and is correctly configured. Otherwise returns `null`.
 */
const SortModalContainer = () => {
  const { contentType, layout } = useContentManagerContext();
  if (!contentType) {
    return null;
  }

  const { attributes } = contentType;
  if (!(config.sortOrderField in attributes)) {
    return null;
  }

  const sortOrderFieldAttributes = attributes[config.sortOrderField];
  if (sortOrderFieldAttributes.type !== 'integer') {
    console.warn(`${config.sortOrderField} needs to be of type integer.`);
    return null;
  }

  const { uid } = contentType;
  const { mainField } = layout.list.settings;

  return (
    <>
      {/* Legacy global sort modal (existing behaviour) – icon only */}
      <SortModal uid={uid} mainField={mainField} contentType={contentType} mode="global" />
      {/* New scoped sort modal: reindexes sortOrder only within the currently active filters */}
      <SortModal
        uid={uid}
        mainField={mainField}
        contentType={contentType}
        mode="scoped"
        label="Scoped sort (by filters)"
      />
    </>
  );
};

export default SortModalContainer;
