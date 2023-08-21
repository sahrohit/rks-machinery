import { type UseFieldArrayAppend } from "react-hook-form";
import { toast } from "react-hot-toast";
import { UploadDropzone } from "~/utils/uploadthing";
import { type IProduct } from "../admin/ProductForm";

interface FileUploaderProps {
  append: UseFieldArrayAppend<IProduct, "images">;
}

const FileUploader = ({ append }: FileUploaderProps) => {
  return (
    <main className="w-full">
      <UploadDropzone
        appearance={{
          container: {},
        }}
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          res?.forEach((file) => {
            append({
              url: file.url,
            });
          });
          toast.success(`Files upload successfully`);
        }}
        onUploadError={(error: Error) => {
          toast.error(`ERROR! ${error.message}`);
        }}
      />
    </main>
  );
};

export default FileUploader;
