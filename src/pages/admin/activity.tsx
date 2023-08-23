/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Skeleton,
  User,
} from "@nextui-org/react";
import React from "react";
import { SectionIntro } from "~/components/shared/SectionIntro";
import { api } from "~/utils/api";

const columns = [
  { name: "User", uid: "user" },
  { name: "Type", uid: "type" },
  { name: "Description", uid: "desc" },
];

const ActivityLog = () => {
  return (
    <>
      <SectionIntro
        eyebrow="Admin"
        title="Activity log"
        className="mt-4 sm:mt-6 lg:mt-8"
      >
        <div className="flex w-full flex-col justify-between md:flex-row">
          <p>Every admin actions is logged here.</p>
        </div>
      </SectionIntro>
      <div className="m-8">
        <ActivityTable />
      </div>
    </>
  );
};

export default ActivityLog;

const ActivityTable = () => {
  const { data, isLoading, error } = api.logs.getAll.useQuery();

  const renderCell = React.useCallback((log: any, columnKey: any) => {
    const cellValue = log[columnKey];

    switch (columnKey) {
      case "user":
        return (
          <User
            avatarProps={{ radius: "lg", src: log.user.image }}
            description={log.user.email}
            name={cellValue.name}
          >
            {cellValue.name}
          </User>
        );

      default:
        return cellValue;
    }
  }, []);

  if (isLoading) {
    return <ActivityTableSkeleton />;
  }

  if (error) {
    return <div>An Error Occured</div>;
  }

  return (
    <Table aria-label="Example table with custom cells">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={data}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

const ActivityTableSkeleton = () => {
  return (
    <Table aria-label="Example table with custom cells">
      <TableHeader>
        <TableColumn align="start">User</TableColumn>
        <TableColumn align="start">Description</TableColumn>
        <TableColumn align="center">Type</TableColumn>
      </TableHeader>
      <TableBody>
        {[1, 2, 3].map((row) => (
          <TableRow key={`mock-cell-${row}`}>
            {[1, 2, 3].map((col) => (
              <TableCell key={`mock-cell-${col}`}>
                <Skeleton className="w-3/5 rounded-lg">
                  <div className="h-10 w-3/5 rounded-lg bg-default-200"></div>
                </Skeleton>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
