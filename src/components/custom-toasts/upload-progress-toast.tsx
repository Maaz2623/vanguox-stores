// UploadProgressToast.tsx
import React from "react";

interface Props {
  fileName: string;
  progress: number;
}

export const UploadProgressToast: React.FC<Props> = ({
  fileName,
  progress,
}) => {
  return (
    <div className="w-[300px] p-4 bg-white rounded shadow">
      <p className="text-sm font-medium mb-2">Uploading: {fileName}</p>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-200"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};
