import React, { useState } from "react";
import {
  Datagrid,
  getAutoSizedColumnWidth,
  useDatagrid,
  useFiltering,
  useOnRowClick,
  useRowIsMouseOver,
  useSelectRows,
} from "@carbon/ibm-products";
import { catalogApiRef } from "@backstage/plugin-catalog-react";
import { useApi } from "@backstage/core-plugin-api";
import useAsync from 'react-use/lib/useAsync';
import { DatagridActions } from "./DatagridActions";
import { Link as CarbonLink } from "@carbon/react";
import { Link, Navigate } from 'react-router-dom';

const headers = [
  { Header: 'Name', sticky: 'left', accessor: 'name', 
    Cell: ({ cell: { value } }) => (
      <CarbonLink as={Link} to={value.href}>{value.title}</CarbonLink>
  )},
  { Header: 'Owner', accessor: 'owner',
    Cell: ({ cell: { value } }) => (
      <CarbonLink as={Link} to={value.href}>{value.title}</CarbonLink>
  )},
  { Header: 'Type', accessor: 'type', filter: 'checkbox'},
  { Header: 'Lifecycle', accessor: 'lifecycle', filter: 'dropdown', },
  { Header: 'Description', accessor: 'description', },
  { Header: 'Kind', accessor: 'kind', filter: 'checkbox'},
];


const filterProps = {
  variation: "panel",
  updateMethod: "instant",
  primaryActionLabel: "Apply",
  secondaryActionLabel: "Cancel",
  panelIconDescription: `Open filters`,
  closeIconDescription: "Close panel",
  autoHideFilters: false,
  sections: [
    {
      categoryTitle: "Entity",
      hasAccordion: false,
      filters: [
        {
          filterLabel: 'Kind',
          filter: {
            type: 'checkbox',
            column: 'kind',
            props: {
              FormGroup: {
                legendText: 'Kind'
              },
              Checkbox: [
                {id: 'system', labelText: 'System', value: 'System'},
                {id: 'component', labelText: 'Component', value: 'Component'},
                {id: 'domain', labelText: 'Domain', value: 'Domain'},
                {id: 'api', labelText: 'API', value: 'API'},
              ]
            }
          }
        },
        {
          filterLabel: 'Component type',
          filter: {
            type: 'checkbox',
            column: 'type',
            props: {
              FormGroup: {
                legendText: 'Component type'
              },
              Checkbox: [
                {id: 'pipeline', labelText: 'Pipeline', value: 'Pipeline'},
              ]
            }
          }
        },
        {
          filterLabel: "Owner",
          filter: {
            type: "text",
            column: "owner",
            props: {
              TextInput: {
                id: 'owner-text-input',
                type: 'text',
                labelText: 'Owner',
                helperText: 'Owner of the entity',
              },
            },
          },
        },
        {
          filterLabel: "Lifecycle",
          filter: {
            type: "dropdown",
            column: "lifecycle",
            props: {
              Dropdown: {
                id: "lifecycle-dropdown",
                ariaLabel: "Lifecycle dropdown",
                items: ["experimental", "development", "production"],
                label: "Lifecycle",
                titleText: "Lifecycle",
              },
            },
          },
        },
      ],
    },
  ],
  // onPanelOpen: action("onPanelOpen"),
  // onPanelClose: action("onPanelClose"),
  panelTitle: "Filter",
  renderDateLabel: (start, end) => {
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    return `${startDateObj.toLocaleDateString()} - ${endDateObj.toLocaleDateString()}`;
  },
  initialState: {
    filters: [
      {id: 'kind', type: 'checkbox', value: 'Component'}
    ]
  },
};

export const CatalogItemsTable = () => {
  const columns = React.useMemo(
    () => [
      ...headers,
    ],
    [],
  );

  const [data, setData] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const catalogApi = useApi(catalogApiRef);
  const { value, loading, error } = useAsync(async () => {
    const response = await catalogApi.getEntities({
      // filter: {
      //   'kind': 'Component',
      // }
    });

    const entities = response.items.flatMap(entity => {
      const name = entity.metadata.name;
      const namespace = entity.metadata.namespace || 'default';
      const kind = entity.kind;

      return {
        name: {
          title: entity.metadata.name,
          href: `/catalog/${namespace}/${kind}/${name}`.toLowerCase()
        },
        owner: {
          title: entity.spec.owner,
          href: `/catalog/${namespace}/user/${name}`.toLowerCase()
        },
        type: entity.spec?.type || '',
        lifecycle: entity.spec?.lifeycle || '',
        description: entity.spec.description || '',
        kind: entity.kind,
      }
    });

    setData(entities);
    setIsFetching(false);
  }, [catalogApi]);
  // TODO: Handle error

  const datagridState = useDatagrid(
    {
      columns,
      data,
      loading,
      filterProps,
      DatagridActions,
      isFetching: isFetching,
      gridTitle: 'Catalog',
      gridDescription: 'The catalog keeps track of ownership and metadata for Backstage components',
    },
    useFiltering,
    useRowIsMouseOver,
  );

  return <Datagrid datagridState={{ ...datagridState }} style={{height: '100vh'}}/>;
};

export default CatalogItemsTable;
