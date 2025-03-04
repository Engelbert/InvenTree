import { t } from '@lingui/macro';
import { Text } from '@mantine/core';
import { useCallback, useMemo } from 'react';

import { ApiPaths } from '../../../enums/ApiEndpoints';
import { UserRoles } from '../../../enums/Roles';
import {
  openCreateApiForm,
  openDeleteApiForm,
  openEditApiForm
} from '../../../functions/forms';
import { useTableRefresh } from '../../../hooks/TableRefresh';
import { apiUrl } from '../../../states/ApiState';
import { useUserState } from '../../../states/UserState';
import { AddItemButton } from '../../buttons/AddItemButton';
import { TableColumn } from '../Column';
import { DescriptionColumn } from '../ColumnRenderers';
import { InvenTreeTable } from '../InvenTreeTable';
import { RowAction, RowDeleteAction, RowEditAction } from '../RowActions';

/**
 * Table for displaying list of project codes
 */
export function ProjectCodeTable() {
  const { tableKey, refreshTable } = useTableRefresh('project-code');

  const user = useUserState();

  const columns: TableColumn[] = useMemo(() => {
    return [
      {
        accessor: 'code',
        sortable: true,
        title: t`Project Code`
      },
      DescriptionColumn()
    ];
  }, []);

  const rowActions = useCallback(
    (record: any): RowAction[] => {
      return [
        RowEditAction({
          hidden: !user.hasChangeRole(UserRoles.admin),
          onClick: () => {
            openEditApiForm({
              url: ApiPaths.project_code_list,
              pk: record.pk,
              title: t`Edit project code`,
              fields: {
                code: {},
                description: {}
              },
              onFormSuccess: refreshTable,
              successMessage: t`Project code updated`
            });
          }
        }),
        RowDeleteAction({
          hidden: !user.hasDeleteRole(UserRoles.admin),
          onClick: () => {
            openDeleteApiForm({
              url: ApiPaths.project_code_list,
              pk: record.pk,
              title: t`Delete project code`,
              successMessage: t`Project code deleted`,
              onFormSuccess: refreshTable,
              preFormContent: (
                <Text>{t`Are you sure you want to remove this project code?`}</Text>
              )
            });
          }
        })
      ];
    },
    [user]
  );

  const addProjectCode = useCallback(() => {
    openCreateApiForm({
      url: ApiPaths.project_code_list,
      title: t`Add project code`,
      fields: {
        code: {},
        description: {}
      },
      onFormSuccess: refreshTable,
      successMessage: t`Added project code`
    });
  }, []);

  const tableActions = useMemo(() => {
    let actions = [];

    actions.push(
      <AddItemButton onClick={addProjectCode} tooltip={t`Add project code`} />
    );

    return actions;
  }, []);

  return (
    <InvenTreeTable
      url={apiUrl(ApiPaths.project_code_list)}
      tableKey={tableKey}
      columns={columns}
      props={{
        rowActions: rowActions,
        customActionGroups: tableActions
      }}
    />
  );
}
