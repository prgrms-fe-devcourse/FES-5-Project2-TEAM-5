import S from '../style.module.css';
import { CgClose } from 'react-icons/cg';

interface Props {
  imageId: string;
  imageFile?: File | null;
  imagePreview?: string | null;
  imagePreviewUrl?: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearImage: () => void;
  onClearPreviewUrl: () => void;
}

export const ImageUpload = ({
  imageId,
  imageFile,
  imagePreview,
  imagePreviewUrl,
  onImageChange,
  onClearImage,
  onClearPreviewUrl,
}: Props) => {
  const displayImage = imagePreview || imagePreviewUrl;
  const hasNewImage = !!imageFile;
  const hasExistingImage = !hasNewImage && !!imagePreviewUrl;

  const handleClearImage = () => {
    if (hasNewImage) {
      onClearImage();
    } else if (hasExistingImage) {
      onClearPreviewUrl();
    }
  };

  const getFileName = () => {
    if (hasNewImage && imageFile) {
      return imageFile.name;
    } else if (hasExistingImage && imagePreviewUrl) {
      return imagePreviewUrl.split('/').pop() || '기존 이미지';
    }
    return '';
  };

  return (
    <div>
      <label htmlFor={imageId} className={S.itemTitle}>
        이미지
      </label>
      <div className={S.fileAttachBox}>
        <input
          type="file"
          accept="image/*"
          id={imageId}
          className="sr-only"
          onChange={onImageChange}
        />
        <button
          type="button"
          onClick={() => document.getElementById(imageId)?.click()}
          className={S.uploadButton}
        >
          이미지 첨부
        </button>

        {(hasNewImage || hasExistingImage) && (
          <div className={S.fileNameBox}>
            <p className={S.fileName}>{getFileName()}</p>
            <button type="button" className={S.deleteButton} onClick={handleClearImage}>
              <CgClose className={S.deleteIcon} size={24} />
            </button>
          </div>
        )}

        {!hasNewImage && !hasExistingImage && (
          <p className={S.placeholderText}>이미지를 첨부해 주세요</p>
        )}
      </div>

      {displayImage && (
        <div className={S.imagePreviewBox}>
          <img
            src={displayImage}
            alt="선택된 이미지"
            style={{ maxWidth: '100%', maxHeight: 200 }}
          />
        </div>
      )}
    </div>
  );
};
