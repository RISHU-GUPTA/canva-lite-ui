import { IconButton, Tooltip } from "@mui/material";
import React from "react";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import type { SettingProps } from "../interface/common.interface";
import { FabricImage } from "fabric";
export default function Image({ canvas }: SettingProps) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files && e?.target?.files[0];
    if (file) {
      const url = URL.createObjectURL(file);

      const imgElement = document.createElement("img");
      imgElement.src = url;

      imgElement.crossOrigin = "anonymous";

      imgElement.onload = () => {
        const canvasWidth = canvas?.width!;
        const canvasHeight = canvas?.height!;

        const scale = Math.min(
          canvasWidth / imgElement.width,
          canvasHeight / imgElement.height
        );

        const fabricImage = new FabricImage(imgElement, {
          left: 50,
          top: 50,
          scaleX: scale,
          scaleY: scale,
          selectable: true,
          hasControls: true,
          lockUniScaling: true,
        });

        canvas?.add(fabricImage);
        canvas?.setActiveObject(fabricImage);
        canvas?.renderAll();
      };
    }
  };

  const handleImageUplaodBtnClcik = () => {
    fileInputRef?.current?.click();
  };
  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageUpload}
      />
      <Tooltip title="Upload Image">
        <IconButton onClick={handleImageUplaodBtnClcik}>
          <ImageOutlinedIcon />
        </IconButton>
      </Tooltip>
    </>
  );
}
