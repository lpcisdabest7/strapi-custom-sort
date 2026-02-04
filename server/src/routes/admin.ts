export default {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/fetch-entries/:uid',
      handler: 'controller.fetchEntries',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/update-sort-order/:uid',
      handler: 'controller.updateSortOrder',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/fetch-entries-scoped/:uid',
      handler: 'controller.fetchEntriesScoped',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/update-sort-order-scoped/:uid',
      handler: 'controller.updateSortOrderScoped',
      config: {
        policies: [],
      },
    },
  ],
};
