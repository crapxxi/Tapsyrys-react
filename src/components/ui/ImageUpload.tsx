import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface ImageUploadProps {
  preview: string | null;
  onFile: (file: File) => void;
  labelKey?: string;
}

export function ImageUpload({ preview, onFile, labelKey = 'myProducts.form.image' }: ImageUploadProps) {
  const { t } = useTranslation();
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-ink">{t(labelKey)}</label>
      <div
        role="button"
        tabIndex={0}
        onClick={() => ref.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && ref.current?.click()}
        className="relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-surface-muted bg-surface-elevated p-6 transition-all duration-150 hover:border-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        {preview ? (
          <div className="relative">
            <img src={preview} alt={t('myProducts.form.preview')} className="max-h-44 rounded-xl object-contain" />
            <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-sm">
              ✓
            </span>
          </div>
        ) : (
          <>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
              <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-sub">{t('myProducts.form.imageHint')}</p>
            <p className="mt-1 text-xs text-faint">{t('myProducts.form.imageFormats')}</p>
          </>
        )}
        <input
          ref={ref}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFile(file);
          }}
        />
      </div>
    </div>
  );
}
