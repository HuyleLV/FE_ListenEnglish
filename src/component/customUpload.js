/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState } from 'react'
import { Upload, Button } from 'antd'
import {
  UploadOutlined,
  PlusOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import axios from "axios";
import { getBase64 } from '../helper';

export default function CustomUpload({
  value,
  onChange,
  description = '',
  type = 'image', //image, file
  //disabled = false,
  multiple = false,
  showUploadList= true,
  accept = '.png, .jpg, .jpeg, .jfif',
}) {

  const [loading, setLoading] = useState(false)
  const uploading = useRef(false)
  const uploadRef = useRef(null)

  const uploadFile = async (file) => {
    const uploadForm = new FormData();
      uploadForm.append("image_url", file);
      const result = await axios.post(
        `${process.env.REACT_APP_API_URL}/uploadImage`,
        uploadForm
      );
      const url = result?.data;

      return { url };
  };

  const getFileList = () => {
    if (!value) {
      return []
    }

    return Array.isArray(value)
      ? value
          ?.filter((file) => file !== undefined)
          .map((file) => ({ uid: file, name: file, url: file }))
      : [{ uid: value, name: value, url: value }]

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }

    const handleUpload = (_, fileList) => {
        if (uploading.current) {
        return
        }

        uploading.current = true

        setLoading(true)
        return new Promise((resolve, reject) => {
        Promise.all(
            fileList?.map(async (file) => {
            const action = uploadFile
            return action(file)
                .then((data) => {
                return data?.url
                })
                .catch((err) => {
                reject(err)
                })
                .finally(() => setLoading(false))
            }),
        ).then((files) => {
            if (files?.[0]) {
            const newValues = multiple ? [...(value || []), ...files] : files?.[0]
            onChange && onChange(newValues)
            uploading.current = false
            resolve(newValues)
            }
        })
        })
    }

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }

        return window.open(file.url, '_blank', 'noopener,noreferrer')
    }

  const handleRemove = (file) => {
    const newValues = multiple
      ? value.filter((url) => url !== file?.url)
      : null
    onChange && onChange(newValues)
  }

  const UploadButton = () => {
    return <div>{loading ? <LoadingOutlined /> : <PlusOutlined />}</div>
  }

  return (
    <>
      <Upload
        showUploadList={showUploadList}
        fileList={getFileList()}
        listType={type === 'image' ? 'picture-card' : 'text'}
        beforeUpload={handleUpload}
        onPreview={handlePreview}
        multiple={multiple}
        onRemove={(file) => handleRemove(file)}
        {...(accept && { accept })}
      >
        {type === 'image' ? (
          multiple ? (
            <UploadButton />
          ) : getFileList().length === 0 ? (
            <UploadButton />
          ) : null
        ) : (
          <div>
            <Button
              loading={loading}
              onClick={() => uploadRef.current?.click()}
              icon={<UploadOutlined />}
              style={{ marginTop: 6 }}
            >
              Upload File
            </Button>
            <div style={{ paddingTop: 4 }}>{description}</div>
          </div>
        )}
      </Upload>
    </>
  )
}
