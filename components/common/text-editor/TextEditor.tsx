import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import type ReactQuillType from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import './editor-styles.module.css'
interface Props {
  value: string
  onChange: (value: string) => void
}
const toolbarOptions = [
  [{ size: [] }],
  [{ align: [] }],

  ['bold', 'italic', 'underline', 'strike'],
  [{ header: 1 }, { header: 2 }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['link', 'image'],
]
export default function TextEditor({ value, onChange }: Props) {
  const ReactQuill: typeof ReactQuillType = useMemo(
    () => dynamic(() => import('react-quill'), { ssr: false }),
    []
  ) as any

  return (
    <div>
      <ReactQuill
        modules={{ toolbar: toolbarOptions }}
        className="editor"
        theme="snow"
        value={value}
        onChange={onChange}
      />
    </div>
  )
}
