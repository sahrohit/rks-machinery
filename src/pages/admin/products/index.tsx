/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { SectionIntro } from "~/components/shared/SectionIntro";
import ProductForm from "~/components/admin/ProductForm";
import {
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Skeleton,
  Tooltip,
  Button,
} from "@nextui-org/react";
import React from "react";
import { AiOutlineDelete, AiOutlinePushpin } from "react-icons/ai";
import ConfirmationModal from "~/components/ui/ConfirmationModal";
import { api } from "~/utils/api";
import { TbExternalLink } from "react-icons/tb";
import Link from "next/link";
import { toast } from "react-hot-toast";

const ProductsPage = () => {
  return (
    <>
      <SectionIntro
        eyebrow="Admin"
        title="Products"
        className="mt-4 sm:mt-6 lg:mt-8"
      >
        <div className="flex w-full flex-col justify-between md:flex-row">
          <p>This is the control panel for all you product management.</p>
          <ProductForm />
        </div>
      </SectionIntro>
      <div className="m-8">
        <ProductTable />
      </div>
    </>
  );
};

export default ProductsPage;

const columns = [
  { name: "Name", uid: "name" },
  { name: "IsPublished", uid: "isPublished" },
  { name: "Category", uid: "category" },
  { name: "Price", uid: "price" },
  { name: "ACTIONS", uid: "actions" },
];

const ProductTable = () => {
  const utils = api.useContext();

  const { data, isLoading, error } = api.product.getProducts.useQuery();
  const { mutate: mutatePublish } = api.product.setPublished.useMutation({
    onSuccess: async () => {
      await utils.product.getProducts.invalidate();
      toast.success("Product Status Updated", {
        id: "update-product-status",
      });
    },
    onError: () => {
      toast.error("An error occured", {
        id: "delete-product-status",
      });
    },
  });
  const { mutate: mutateDelete } = api.product.deleteProduct.useMutation({
    onSuccess: async () => {
      await utils.product.getProducts.invalidate();
      toast.success("Product Deleted Succesfully");
    },
    onError: () => {
      toast.error("An error occured");
    },
  });

  const renderCell = React.useCallback(
    (product: any, columnKey: any) => {
      const cellValue = product[columnKey];

      switch (columnKey) {
        case "category":
          return <p>{cellValue.name}</p>;

        case "isPublished":
          return (
            <Chip
              className="capitalize"
              color={product.isPublished ? "success" : "danger"}
              size="sm"
              variant="flat"
            >
              {cellValue ? "PUBLISHED" : "DRAFT"}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip color="success" content="Preview">
                <Link target="_blank" href={`/products/${product.slug}`}>
                  <Button isIconOnly variant="light">
                    <TbExternalLink className="text-lg text-default-400" />
                  </Button>
                </Link>
              </Tooltip>
              <ProductForm product={product} />
              <ConfirmationModal
                size="sm"
                variant="light"
                isIconOnly
                className="cursor-pointer text-lg text-default-400 active:opacity-50"
                header={product.isPublished ? "Un  Publish?" : "Publish"}
                body="Are you sure you want to update access for this user?"
                onConfirm={() => {
                  toast.loading("Updating Product Status", {
                    id: "update-product-status",
                  });
                  mutatePublish({
                    id: product.id,
                    isPublished: !product.isPublished,
                  });
                }}
              >
                <AiOutlinePushpin />
              </ConfirmationModal>
              <ConfirmationModal
                size="sm"
                variant="light"
                isIconOnly
                className="cursor-pointer text-lg text-danger active:opacity-50"
                header="Delete Product"
                body="Are you sure you want to delete this product?"
                onConfirm={() => {
                  toast.loading("Deleting Product", {
                    id: "delete-product-status",
                  });
                  mutateDelete({
                    id: product.id,
                  });
                }}
              >
                <AiOutlineDelete />
              </ConfirmationModal>
            </div>
          );
        case "price":
          return <p>रू {cellValue}</p>;
        default:
          return cellValue;
      }
    },
    [mutateDelete, mutatePublish]
  );

  if (isLoading) {
    return <ProductTableSkeleton />;
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

const ProductTableSkeleton = () => {
  return (
    <Table aria-label="Example table with custom cells">
      <TableHeader>
        <TableColumn align="start">Name</TableColumn>
        <TableColumn align="start">IsPublished</TableColumn>
        <TableColumn align="start">Category</TableColumn>
        <TableColumn align="start">Price</TableColumn>
        <TableColumn align="center">ACTIONS</TableColumn>
      </TableHeader>
      <TableBody>
        {[1, 2, 3, 4, 5].map((row) => (
          <TableRow key={`mock-cell-${row}`}>
            {[1, 2, 3, 4, 5].map((col) => (
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
