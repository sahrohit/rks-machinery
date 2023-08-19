/* eslint-disable @typescript-eslint/no-misused-promises */
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { useFieldArray, useForm } from "react-hook-form";
import { AiOutlineClose, AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import { z } from "zod";
import { SectionIntro } from "~/components/shared/SectionIntro";
import { TbCurrencyRupeeNepalese } from "react-icons/tb";
import { api } from "~/utils/api";
import { type Category } from "@prisma/client";
import AutoComplete from "~/components/ui/AutoComplete";
import useFormPersist from "react-hook-form-persist";
import FileUploader from "~/components/ui/FileUploader";
import Image from "next/image";

const ProductsPage = () => {
  return (
    <SectionIntro
      eyebrow="Admin"
      title="Products"
      className="mt-4 sm:mt-6 lg:mt-8"
    >
      <div className="flex w-full flex-col justify-between md:flex-row">
        <p>This is the control panel for all you product management.</p>
        <AddNewProduct />
      </div>
    </SectionIntro>
  );
};

export default ProductsPage;

interface IFeature {
  title: string;
  description: string;
}

interface IImages {
  url: string;
}

const ProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  slug: z.string().min(3, "Slug must be at least 3 characters long"),
  desc: z.string().min(3, "Description must be at least 3 characters long"),
  price: z.string(),
  categoryId: z.string(),
  features: z.array(
    z.object({
      title: z.string().min(3, "Title must be at least 3 characters long"),
      description: z
        .string()
        .min(3, "Description must be at least 3 characters long"),
    })
  ),
  images: z.array(z.object({ url: z.string() })),
});

export interface IProduct {
  name: string;
  slug: string;
  desc: string;
  price: string;
  categoryId: string;
  features: IFeature[];
  images: IImages[];
}

const AddNewProduct = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { data } = api.category.getCategory.useQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    watch,
  } = useForm<IProduct>({
    defaultValues: {
      name: "",
      slug: "",
      desc: "",
      price: "",
      categoryId: "",
      features: [
        {
          title: "",
          description: "",
        },
        {
          title: "",
          description: "",
        },
      ],
      images: [],
    },
    resolver: zodResolver(ProductSchema),
  });

  const {
    fields: featuresFields,
    append: featuresAppend,
    remove: featureRemove,
  } = useFieldArray({
    control,
    name: "features",
  });

  const {
    fields: imagesFields,
    append: imagesAppend,
    remove: imagesRemove,
  } = useFieldArray({
    control,
    name: "images",
  });

  console.log(errors);

  useFormPersist("create-product", { watch, setValue });

  return (
    <>
      <Button onPress={onOpen} color="primary">
        <AiOutlinePlus />
        Add New Product
      </Button>
      <Modal
        size="4xl"
        isOpen={isOpen}
        scrollBehavior="outside"
        onOpenChange={onOpenChange}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <form
              onSubmit={handleSubmit((val) => {
                console.log(val);
              })}
            >
              <ModalHeader className="flex flex-col gap-1">
                Add Product
              </ModalHeader>
              <ModalBody>
                <h2 className="text-2xl">Product Description</h2>
                <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
                  <Input
                    {...register("name")}
                    autoFocus
                    label="Product Name"
                    description="Name of the product"
                    errorMessage={errors.name?.message}
                    color={errors.name ? "danger" : "default"}
                    variant="bordered"
                    onChange={(e) => {
                      setValue(
                        "slug",
                        e.target.value.replace(/\s/g, "-").toLowerCase()
                      );
                    }}
                  />
                  <Input
                    isReadOnly
                    isDisabled
                    value={watch("name").replace(/\s/g, "-").toLowerCase()}
                    {...register("slug")}
                    placeholder="Product Slug"
                    label="Product Slug"
                    variant="bordered"
                  />
                </div>
                <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
                  <Input
                    {...register("price")}
                    startContent={<TbCurrencyRupeeNepalese />}
                    label="Price"
                    description="Price of the product"
                    errorMessage={errors.price?.message}
                    color={errors.name ? "danger" : "default"}
                    variant="bordered"
                  />
                  <AutoComplete
                    options={
                      data?.map((category: Category) => ({
                        name: category.name,
                        id: category.id,
                      })) ?? []
                    }
                    setValue={setValue}
                    description={
                      errors.categoryId?.message ? (
                        <div className="text-tiny text-danger">
                          {errors.categoryId?.message}
                        </div>
                      ) : (
                        <div className="text-tiny text-foreground-400">
                          Select a product Category
                        </div>
                      )
                    }
                  />
                </div>
                <Textarea
                  {...register("desc")}
                  label="Description"
                  description="Description of the product"
                  variant="bordered"
                  errorMessage={errors.desc?.message}
                  color={errors.desc ? "danger" : "default"}
                />
                <h2 className="text-2xl">Feature of the Product</h2>
                {featuresFields.map((field, index) => (
                  <div
                    key={`feature-array-${index + 1}`}
                    className="flex w-full flex-col justify-between gap-4 md:flex-row"
                  >
                    <Input
                      key={`title-${field.id}`}
                      {...register(`features.${index}.title`)}
                      label={`Title ${index + 1}`}
                      description={`Feature Title ${index + 1}`}
                      errorMessage={errors.features?.[index]?.title?.message}
                      color={errors.features?.[index] ? "danger" : "default"}
                      variant="bordered"
                    />
                    <Input
                      key={`description-${field.id}`}
                      {...register(`features.${index}.description`)}
                      label={`Description ${index + 1}`}
                      description={`Feature Description ${index + 1}`}
                      errorMessage={
                        errors.features?.[index]?.description?.message
                      }
                      color={errors.features?.[index] ? "danger" : "default"}
                      variant="bordered"
                    />
                    {index !== 0 && index !== 1 ? (
                      <Button
                        isIconOnly
                        size="lg"
                        color="danger"
                        type="button"
                        onClick={() => featureRemove(index)}
                      >
                        <AiOutlineClose />
                      </Button>
                    ) : null}
                  </div>
                ))}
                <div>
                  <Button
                    color="success"
                    type="button"
                    onClick={() =>
                      featuresAppend({ title: "", description: "" })
                    }
                  >
                    Add New Feature
                  </Button>
                </div>
                <h2 className="text-2xl">Images of the product</h2>
                <div className="flex w-full flex-row flex-wrap gap-4">
                  {imagesFields.map((field, index) => (
                    <div key={field.url}>
                      <Image
                        src={field.url}
                        width={112}
                        height={112}
                        alt="Uploaded Image"
                        className="h-32 w-28 overflow-hidden"
                      />
                      <Button
                        variant="light"
                        color="danger"
                        className="mt-1 w-full"
                        isIconOnly
                        onClick={() => imagesRemove(index)}
                      >
                        <AiOutlineDelete />
                      </Button>
                    </div>
                  ))}
                </div>
                <FileUploader append={imagesAppend} />
              </ModalBody>
              <ModalFooter className="sticky bottom-0 bg-background">
                <Button color="default" variant="flat" onClick={onClose}>
                  Close
                </Button>
                <Button color="primary" type="submit">
                  Submit
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
