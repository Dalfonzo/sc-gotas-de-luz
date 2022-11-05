import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from '@chakra-ui/react'
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace'
export interface CommonModalProps extends Omit<ModalProps, 'isOpen' | 'children'> {
  visible: boolean
  title: string | ReactJSXElement
  body: string | ReactJSXElement
  footer?: ReactJSXElement
  onClose: () => void
  center?: boolean
}
export default function BasicModal({
  visible,
  title,
  body,
  onClose,
  footer,
  center = true,
  ...rest
}: CommonModalProps) {
  return (
    <>
      <Modal isCentered={center} isOpen={visible} onClose={onClose} {...rest}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{body}</ModalBody>

          {footer && <ModalFooter>{footer}</ModalFooter>}
        </ModalContent>
      </Modal>
    </>
  )
}
