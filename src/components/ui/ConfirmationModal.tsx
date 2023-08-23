import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  type ButtonProps,
  Tooltip,
} from "@nextui-org/react";
import { type ReactNode } from "react";

interface ConfirmationModalProps extends ButtonProps {
  header: ReactNode;
  body: ReactNode;
  confirmButtonProps?: ButtonProps;
  onConfirm: () => void;
}

const ConfirmationModal = ({
  header,
  body,
  onConfirm,
  confirmButtonProps,
  ...props
}: ConfirmationModalProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Tooltip color="danger" content={header}>
        <Button {...props} onPress={onOpen} color="primary" />
      </Tooltip>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <form>
              <ModalHeader className="flex flex-col gap-1">
                {header}
              </ModalHeader>
              <ModalBody>{body}</ModalBody>
              <ModalFooter>
                <Button color="default" variant="flat" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  {...confirmButtonProps}
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                >
                  Confirm
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConfirmationModal;
