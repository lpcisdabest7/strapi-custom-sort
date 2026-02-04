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

  // Try to find a usable sort field on this content type.
  // We support multiple candidate field names (sort, sortOrder, order, orderIndex).
  const resolveSortFieldForContentType = (): string | null => {
    if (!attributes) {
      return null;
    }

    // Prefer any of the configured candidate fields that exist and are integers.
    for (const candidate of config.sortFieldCandidates) {
      const attribute = attributes[candidate];
      if (attribute && attribute.type === 'integer') {
        return candidate;
      }
    }

    // Fallback to the default config field if present and valid.
    const fallbackAttr = attributes[config.sortOrderField];
    if (fallbackAttr && fallbackAttr.type === 'integer') {
      return config.sortOrderField;
    }

    return null;
  };

  const sortField = resolveSortFieldForContentType();
  if (!sortField) {
    // Current content type does not have any supported integer sort field.
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
