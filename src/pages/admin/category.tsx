/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { zodResolver } from "@hookform/resolvers/zod";
import {
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
  Textarea,
} from "@nextui-org/react";
import { type Category } from "@prisma/client";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  AiFillCloseCircle,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlinePlus,
} from "react-icons/ai";
import { z } from "zod";
import { SectionIntro } from "~/components/shared/SectionIntro";
import ConfirmationModal from "~/components/ui/ConfirmationModal";
import { api } from "~/utils/api";
import { UploadDropzone } from "~/utils/uploadthing";

const columns = [
  { name: "Name", uid: "name" },
  { name: "Slug", uid: "slug" },
  { name: "Product Count", uid: "count" },
  { name: "ACTIONS", uid: "actions" },
];

const CategoryPage = () => {
  return (
    <>
      <SectionIntro
        eyebrow="Admin"
        title="Manage Categories"
        className="mt-4 sm:mt-6 lg:mt-8"
      >
        <div className="flex w-full flex-col justify-between md:flex-row">
          <p>You can add and manage categories here.</p>
          <CategoryForm />
        </div>
      </SectionIntro>
      <div className="m-8">
        <CategoryTable />
      </div>
    </>
  );
};

const CategoryTable = () => {
  const utils = api.useContext();

  const { data, isLoading, error } =
    api.category.getCategoryWithProduct.useQuery();

  const { mutate: mutateDeleteCategory } =
    api.category.deleteCategory.useMutation({
      onSuccess: async () => {
        toast.success("Category deleted successfully", {
          id: "deleting-category",
        });
        await utils.category.getCategoryWithProduct.invalidate();
        await utils.category.getCategory.invalidate();
      },
      onError: async (error) => {
        toast.error(error.message, {
          id: "deleting-category",
        });
        await utils.category.getCategoryWithProduct.invalidate();
        await utils.category.getCategory.invalidate();
      },
    });

  const renderCell = React.useCallback(
    (category: any, columnKey: any) => {
      const cellValue = category[columnKey];

      switch (columnKey) {
        case "count":
          return category._count.products;

        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <CategoryForm category={category} />
              <ConfirmationModal
                size="sm"
                variant="light"
                isIconOnly
                className="cursor-pointer text-lg text-danger active:opacity-50"
                header={`Delete Category ${category.name}`}
                body={
                  category?.products?.length > 0 ? (
                    <div className="rounded-md bg-red-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <AiFillCloseCircle
                            className="h-5 w-5 text-red-400"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">
                            These products are associated with the category.
                            Please delete them first.
                          </h3>
                          <div className="mt-2 text-sm text-red-700">
                            <ul
                              role="list"
                              className="list-disc space-y-1 pl-5"
                            >
                              {category?.products?.map((product: any) => (
                                <li key={product.id}>{product.name}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    "Are you sure you want to delete this category?"
                  )
                }
                confirmButtonProps={
                  category?.products?.length > 0
                    ? {
                        disabled: true,
                        className: "cursor-not-allowed",
                        isDisabled: true,
                      }
                    : {}
                }
                onConfirm={() => {
                  toast.loading("Deleting category", {
                    id: "deleting-category",
                  });
                  mutateDeleteCategory({
                    id: category.id,
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
    [mutateDeleteCategory]
  );

  if (isLoading) {
    return <CategoryTableSkeleton />;
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

const CategoryTableSkeleton = () => {
  return (
    <Table aria-label="Example table with custom cells">
      <TableHeader>
        <TableColumn align="start">Name</TableColumn>
        <TableColumn align="start">Slug</TableColumn>
        <TableColumn align="center">Product Count</TableColumn>
        <TableColumn align="center">ACTIONS</TableColumn>
      </TableHeader>
      <TableBody>
        {[1, 2, 3, 4].map((row) => (
          <TableRow key={`mock-cell-${row}`}>
            {[1, 2, 3, 4].map((col) => (
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

export const CategoryForm = ({ category }: { category?: Category }) => {
  const utils = api.useContext();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const { mutate: mutateAddCategory, isLoading: addCategoryLoading } =
    api.category.addCategory.useMutation({
      onSuccess: async () => {
        toast.success("Added Category");
        await utils.admin.getAdmins.invalidate();
        onClose();
      },
      onError: () => {
        toast.error("An error occured");
      },
    });

  const { mutate: mutateUpdateCategory, isLoading: updateCategoryLoading } =
    api.category.updateCategory.useMutation({
      onSuccess: async () => {
        toast.success("Updated Category");
        await utils.admin.getAdmins.invalidate();
        onClose();
      },
      onError: () => {
        toast.error("An error occured");
      },
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<{
    name: string;
    desc: string;
    image: string;
  }>({
    defaultValues: category
      ? {
          name: category.name,
          desc: category.desc ?? "",
          image: category.image ?? "",
        }
      : {
          name: "",
          desc: "",
          image: "",
        },
    resolver: zodResolver(
      z.object({
        name: z.string(),
        desc: z.string(),
        image: z.string().url(),
      })
    ),
  });

  const watchImage = watch("image");

  return (
    <>
      <Button
        isIconOnly={category ? true : false}
        variant={category ? "light" : "solid"}
        onPress={onOpen}
        color="primary"
      >
        {category ? (
          <AiOutlineEdit />
        ) : (
          <>
            <AiOutlinePlus />
            Add New Category
          </>
        )}
      </Button>
      <Modal
        size="2xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <form
              onSubmit={handleSubmit((val) => {
                if (category) {
                  mutateUpdateCategory({
                    id: category.id,
                    ...val,
                  });
                } else {
                  mutateAddCategory(val);
                }
              })}
            >
              <ModalHeader className="flex flex-col gap-1">
                {category ? `Updating ${category.name}` : "Add New Category"}
              </ModalHeader>
              <ModalBody>
                <Input
                  {...register("name")}
                  autoFocus
                  label="Product Name"
                  description="Name of the product"
                  errorMessage={errors.name?.message}
                  color={errors.name ? "danger" : "default"}
                  variant="bordered"
                  defaultValue={category?.name}
                />
                <Textarea
                  {...register("desc")}
                  label="Description"
                  description="Description of the product"
                  variant="bordered"
                  errorMessage={errors.desc?.message}
                  color={errors.desc ? "danger" : "default"}
                  defaultValue={category?.desc ?? ""}
                />
                <div className="flex flex-col md:flex-row">
                  {(watchImage || category?.image) && (
                    <Image
                      src={watchImage ?? category?.image ?? ""}
                      width={200}
                      height={200}
                      className="m-2 rounded-lg"
                      alt="Category Image"
                    />
                  )}
                  <UploadDropzone
                    appearance={{
                      container: {
                        flexGrow: 1,
                      },
                    }}
                    endpoint="categoryImageUploader"
                    onClientUploadComplete={(res) => {
                      res?.forEach((file) => {
                        setValue("image", file.url);
                      });
                      toast.success(`Files upload successfully`);
                    }}
                    onUploadError={(error: Error) => {
                      toast.error(`ERROR! ${error.message}`);
                    }}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="flat" onClick={onClose}>
                  Close
                </Button>
                <Button
                  isLoading={addCategoryLoading || updateCategoryLoading}
                  color="primary"
                  type="submit"
                >
                  {category ? "Update Category" : "Add Category"}
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CategoryPage;
