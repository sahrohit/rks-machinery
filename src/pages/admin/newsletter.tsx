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
  Button,
} from "@nextui-org/react";
import React from "react";
import { toast } from "react-hot-toast";
import { AiOutlineCheck, AiOutlineCopy, AiOutlineDelete } from "react-icons/ai";
import { useCopyToClipboard } from "~/components/hooks/useCopyToClipboard";
import { SectionIntro } from "~/components/shared/SectionIntro";
import ConfirmationModal from "~/components/ui/ConfirmationModal";
import { api } from "~/utils/api";

const columns = [
  { name: "Email", uid: "email" },
  { name: "Actions", uid: "actions" },
];

const ActivityLog = () => {
  const { data } = api.newsletter.getUsers.useQuery();

  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const hasCopiedText = Boolean(copiedText);

  return (
    <>
      <SectionIntro
        eyebrow="Admin"
        title="Newsletters"
        className="mt-4 sm:mt-6 lg:mt-8"
      >
        <div className="flex w-full flex-col justify-between md:flex-row">
          <p>List of people waiting to hear, what you write.</p>
          <Button
            variant="flat"
            color={hasCopiedText ? "success" : "primary"}
            onClick={() => {
              if (typeof copyToClipboard !== "function") return;
              copyToClipboard(data?.map((d) => d.email).join(",") ?? "");
            }}
          >
            {hasCopiedText ? <AiOutlineCheck /> : <AiOutlineCopy />}
            Copy Emails
          </Button>
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
  const utils = api.useContext();

  const { data, isLoading, error } = api.newsletter.getUsers.useQuery();

  const { mutate: mutateUnsubscribe } = api.newsletter.delete.useMutation({
    onSuccess: async () => {
      toast.success("Unsubscribed Successfully", {
        id: "delete-newsletter",
      });
      await utils.newsletter.getUsers.invalidate();
    },
    onError: async (error) => {
      toast.error(error.message, {
        id: "delete-newsletter",
      });
      await utils.newsletter.getUsers.invalidate();
    },
  });

  const renderCell = React.useCallback(
    (log: any, columnKey: any) => {
      const cellValue = log[columnKey];

      switch (columnKey) {
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <ConfirmationModal
                size="sm"
                variant="light"
                className="cursor-pointer text-lg text-danger active:opacity-50"
                header="Delete Newsletter User"
                body="Are you sure you want to delete this user from your database?"
                onConfirm={() => {
                  toast.loading("Updating access", {
                    id: "delete-newsletter",
                  });
                  mutateUnsubscribe({
                    email: log.email,
                  });
                }}
              >
                <AiOutlineDelete />
              </ConfirmationModal>
            </div>
          );

        default:
          return cellValue;
      }
    },
    [mutateUnsubscribe]
  );

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
        <TableColumn align="start">Actions</TableColumn>
      </TableHeader>
      <TableBody>
        {[1, 2, 3].map((row) => (
          <TableRow key={`mock-cell-${row}`}>
            {[1, 2].map((col) => (
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
