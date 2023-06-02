import { AttachmentIcon, CopyIcon } from '@chakra-ui/icons'
import { Button, Card, CardBody, FormHelperText, FormLabel, Image, InputGroup, InputProps } from '@chakra-ui/react'
import assign from 'lodash/assign'
import { ChangeEvent, useRef, useState } from 'react'

export interface FileI extends File {
  src?: string
}

interface Props extends InputProps {
  file: FileI | undefined
  setFile: (file?: FileI) => void
  accept?: string
  label: string
}

function FileUpload({ file, setFile, accept = 'image/png,image/jpeg', label, ...rest }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFile = e.target.files[0]
      if (newFile?.type.startsWith('image')) {
        const buffer = await newFile.arrayBuffer()
        const fileBuffer = Buffer.from(buffer)
        setFile(assign(newFile, { src: fileBuffer.toString('base64') }))
        return
      }
      setFile(newFile)
    }
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  const getSrc = () => {
    if (file?.src) {
      return `data:image/*;base64,${file.src}`
    }
  }
  const FileCard = ({ file }: { file?: FileI }) => {
    if (file)
      return (
        <Card mx="5" height="100%" width="fit-content" align="center">
          <CardBody p="0" height="100%">
            {file?.src ? (
              <Image src={getSrc()} alt="file" borderRadius="lg" height="100%" objectFit="cover" />
            ) : (
              <CopyIcon height="100%" />
            )}
            <FormHelperText textAlign="center">...{file.name.slice(-12)}</FormHelperText>
          </CardBody>
        </Card>
      )
    return <></>
  }
  return (
    <div>
      <FormLabel htmlFor={rest.name}>{label}</FormLabel>
      <FormHelperText>Haz click en el botón para subir un archivo</FormHelperText>
      <InputGroup height="5rem" my="2" alignItems="center">
        <input type="file" accept={accept} onChange={handleFileChange} ref={inputRef} hidden />
        <Button onClick={handleClick} leftIcon={<AttachmentIcon />} variant="outline">
          Subir {'archivo'}
        </Button>
        <FileCard file={file} />
      </InputGroup>{' '}
    </div>
  )
}

export const useFileUpload = (initialFile?: File) => {
  const [file, setFile] = useState<File | undefined>(initialFile)
  return {
    file,
    setFile,
    FileUpload,
  }
}

export default FileUpload
