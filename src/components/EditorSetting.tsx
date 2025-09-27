import React, { useState, useEffect} from "react";
import type { SettingProps } from "../interface/common.interface";
import { Input } from "@mui/material";
export default function EditorSetting({ canvas }: SettingProps) {
  const [canvasHeight, setCanvasHeight] = useState(500);
  const [canvasWidth, setCanvasWidth] = useState(500);

  useEffect(() => {
    if (canvas) {
      canvas.setHeight(canvasHeight);
      canvas.setWidth(canvasWidth);
      canvas.renderAll();
    }
  }, [canvasHeight, canvasWidth, canvas]);

  const handleCanvasHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value.replace(/,/g, ""), 10);
    if (value > 0) {
      setCanvasHeight(value);
    }
  };
  const handleCanvasWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value.replace(/,/g, ""), 10);
    if (value > 0) {
      setCanvasWidth(value);
    }
  };
  return (
    <div className="flex flex-col bg-[#fff] p-2 rounded-md shadow-md">
      <label className="label">Canvas Width</label>
      <Input value={canvasWidth} onChange={handleCanvasWidthChange} />
      <label className="label">Canvas Height</label>
      <Input value={canvasHeight} onChange={handleCanvasHeightChange} />
    </div>
  );
}
