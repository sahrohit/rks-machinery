/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Skeleton,
} from "@nextui-org/react";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineMail } from "react-icons/ai";
import { z } from "zod";
import { SectionIntro } from "~/components/shared/SectionIntro";
import ConfirmationModal from "~/components/ui/ConfirmationModal";
import { api } from "~/utils/api";

const columns = [
  { name: "Email", uid: "email" },
  { name: "ACCESS", uid: "access" },
  { name: "ACTIONS", uid: "actions" },
];

const TeamPage = () => {
  return (
    <>
      <SectionIntro
        eyebrow="Admin"
        title="Manage Team"
        className="mt-4 sm:mt-6 lg:mt-8"
      >
        <div className="flex w-full flex-col justify-between md:flex-row">
          <p>You can add admin, and also revoke their permissions here.</p>
          <AddNewTeam />
        </div>
      </SectionIntro>
      <div className="m-8">
        <TeamTable />
      </div>
    </>
  );
};

const TeamTable = () => {
  const utils = api.useContext();

  const { data, isLoading, error } = api.admin.getAdmins.useQuery();

  const { mutate } = api.admin.deleteAdminById.useMutation({
    onSuccess: () => {
      toast.success("Admin deleted successfully", {
        id: "update-access",
      });
      void utils.admin.getAdmins.invalidate();
    },
    onError: (error) => {
      toast.error(error.message, {
        id: "update-access",
      });
    },
  });

  const { mutate: mutateAccess } = api.admin.updateAccessById.useMutation({
    onSuccess: () => {
      toast.success("Admin access updated successfully", {
        id: "update-access",
      });
      void utils.admin.getAdmins.invalidate();
    },
    onError: (error) => {
      toast.error(error.message, {
        id: "update-access",
      });
    },
  });

  const renderCell = React.useCallback(
    (user: any, columnKey: any) => {
      const cellValue = user[columnKey];

      switch (columnKey) {
        case "email":
          return (
            <User
              // avatarProps={{ radius: "lg", src: user.avatar }}
              //   description={user.email}
              name={cellValue}
            >
              {cellValue}
            </User>
          );

        case "access":
          return (
            <Chip
              className="capitalize"
              color={user.access ? "success" : "danger"}
              size="sm"
              variant="flat"
            >
              {cellValue ? "ADMIN" : "REVOKED"}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <ConfirmationModal
                size="sm"
                variant="light"
                className="cursor-pointer text-lg text-default-400 active:opacity-50"
                header={user.access ? "Revoke Access" : "Grant Access"}
                body="Are you sure you want to update access for this user?"
                onConfirm={() => {
                  toast.loading("Updating access", {
                    id: "update-access",
                  });
                  mutateAccess({
                    id: user.id,
                    access: !user.access,
                  });
                }}
              >
                <AiOutlineEdit />
              </ConfirmationModal>
              <ConfirmationModal
                size="sm"
                variant="light"
                className="cursor-pointer text-lg text-danger active:opacity-50"
                header="Delete User"
                body="Are you sure you want to delete this user?"
                onConfirm={() => {
                  toast.loading("Updating access", {
                    id: "update-access",
                  });
                  mutate({
                    id: user.id,
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
    [mutate, mutateAccess]
  );

  if (isLoading) {
    return <TeamTableSkeleton />;
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

const TeamTableSkeleton = () => {
  return (
    <Table aria-label="Example table with custom cells">
      <TableHeader>
        <TableColumn align="start">Email</TableColumn>
        <TableColumn align="start">ACCESS</TableColumn>
        <TableColumn align="center">ACTIONS</TableColumn>
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

const AddNewTeam = () => {
  const utils = api.useContext();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const { mutate, isLoading } = api.admin.addAdmin.useMutation({
    onSuccess: async () => {
      toast.success("Invited successfully");
      await utils.admin.getAdmins.invalidate();
      onClose();
    },
    onError: () => {
      toast.error("An error occured");
    },
  });

  const { register, handleSubmit } = useForm<{
    email: string;
  }>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(
      z.object({
        email: z.string().email(),
      })
    ),
  });

  return (
    <>
      <Button onPress={onOpen} color="primary">
        Add New User
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <form
              onSubmit={handleSubmit((val) => {
                mutate({
                  email: val.email,
                });
              })}
            >
              <ModalHeader className="flex flex-col gap-1">
                User will be granted admin access
              </ModalHeader>
              <ModalBody>
                <Input
                  {...register("email")}
                  autoFocus
                  endContent={
                    <AiOutlineMail className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
                  }
                  label="Email"
                  placeholder="Enter user's google associated email"
                  variant="bordered"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="flat" onClick={onClose}>
                  Close
                </Button>
                <Button isLoading={isLoading} color="warning" type="submit">
                  Grant Access
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default TeamPage;
