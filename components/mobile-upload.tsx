import { useEffect, useState } from 'react';
import { CldUploadButton } from 'next-cloudinary';
import Image from 'next/image';

interface MobileUploadProps {
  value: string;
  onChange: (src: string) => void;
  disabled?: boolean;
}

const MobileUpload = ({ value, onChange, disabled }: MobileUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, [isMounted]);

  if (!isMounted) {
    return null;
  }
  return (
    <div className="flex flex-col w-full justify-center items-center space-y-4">
      <CldUploadButton
        onUpload={(result: any) => onChange(result.info.secure_url)}
        options={{ maxFiles: 1 }}
        uploadPreset="enycyb5o"
      >
        <div className="p-4 border-4 border-dashed border-primary/10 rounded-lg my-2 hover:opacity-75 transition flex flex-col space-y-4">
          <div className="relative w-40 h-40 rounded-lg">
            <Image
              className="rounded-lg object-cover"
              src={value || '/placeholder.svg'}
              alt="placeholder"
              fill
            />
          </div>
        </div>
      </CldUploadButton>
    </div>
  );
};

export default MobileUpload;
