import { useEffect, useState } from "react";
import { Input, Box } from "@mui/material";
import * as fabric from "fabric";
import "../App.css";
import type { SettingProps } from "../interface/common.interface";

export default function Setting({ canvas }: SettingProps) {
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(
    null
  );
  const [width, setWidth] = useState<Number | string>("");
  const [height, setHeight] = useState<Number | string>("");
  const [diameter, setDiameter] = useState<Number | string>("");
  const [fontSize, setFontSize] = useState<Number | string>("");
  const [color, setColor] = useState("");

  useEffect(() => {
    if (canvas) {
      canvas.on("selection:updated", (e) => {
        handleObjectSelection(e.selected[0]);
      });
      canvas.on("selection:created", (e) => {
        handleObjectSelection(e.selected[0]);
      });
      canvas.on("selection:cleared", () => {
        setSelectedObject(null);
        clearSetting();
      });
      canvas.on("object:modified", (e) => {
        handleObjectSelection(e.target);
      });
      canvas.on("object:scaling", (e) => {
        handleObjectSelection(e.target);
      });
    }
  }, [canvas]);

  const handleObjectSelection = (object: any) => {
    if (!object) return;
    setSelectedObject(object);
    if (object) {
      console.log(object.type);
      if (object.type === "rect") {
        setWidth(Math.round(object.width * object.scaleX));
        setHeight(Math.round(object.height * object.scaleY));
        setColor(object.fill);
        setDiameter("");
      } else if (object.type === "circle") {
        setDiameter(Math.round(object.radius * 2 * object.scaleX));
        setColor(object.fill);
        setWidth("");
        setHeight("");
      } else if (object.type === "image") {
        setWidth(Math.round(object.width * object.scaleX));
        setHeight(Math.round(object.height * object.scaleY));
        setDiameter("");
        setColor("");
      } else if (object.type === "textbox") {
        setWidth(Math.round(object.width * object.scaleX));
        setHeight(Math.round(object.height * object.scaleY));
        setFontSize(Math.round(object.fontSize * object.scaleX));
        setDiameter("");
        setColor(object.fill);
      }
    }
  };

  const clearSetting = () => {
    setWidth("");
    setHeight("");
    setDiameter("");
    setColor("");
  };
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    const initValue = parseInt(value || "1", 10);
    setWidth(initValue);
    if (selectedObject && initValue > 0) {
      if (
        selectedObject.type === "rect" ||
        selectedObject.type === "image" ||
        selectedObject.type === "textbox"
      ) {
        selectedObject.set({
          width: initValue / selectedObject.scaleX,
        });
        canvas?.renderAll();
      }
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    const initValue = parseInt(value || "1", 10);
    setHeight(initValue);
    if (selectedObject && initValue > 0) {
      if (
        selectedObject.type === "rect" ||
        selectedObject.type === "image" ||
        selectedObject.type === "textbox"
      ) {
        selectedObject.set({
          height: initValue / selectedObject.scaleY,
        });
        canvas?.renderAll();
      }
    }
  };
  const handleDiameterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    const initValue = parseInt(value || "0", 10);
    setDiameter(initValue);
    if (selectedObject && selectedObject.type === "circle" && initValue > 0) {
      selectedObject.set({
        radius: initValue / 2 / selectedObject.scaleX,
      });
      canvas?.renderAll();
    }
  };
  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    const initValue = parseInt(value || "1", 10);
    setFontSize(initValue);
    if (selectedObject && selectedObject.type === "textbox" && initValue > 0) {
      selectedObject.set({
        fontSize: initValue / selectedObject.scaleX,
      });
      canvas?.renderAll();
    }
  };
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setColor(value);
    if (selectedObject) {
      selectedObject.set({
        fill: value,
      });
      canvas?.renderAll();
    }
  };
  return (
    selectedObject && (
      <div className="flex flex-col bg-[#fff] p-2 rounded-md shadow-md">
        {selectedObject &&
          (selectedObject.type === "rect" ||
            selectedObject.type === "textbox") && (
            <>
              <label className="label">Height</label>
              <Input value={width} onChange={handleWidthChange} />
              <label className="label">Width</label>
              <Input value={height} onChange={handleHeightChange} />
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <input
                  type="color"
                  value={color}
                  onChange={handleColorChange}
                  style={{
                    border: "none",
                    background: "none",
                    width: "40px",
                    height: "40px",
                    cursor: "pointer",
                  }}
                />
                <Input value={color} onChange={handleColorChange} />
              </Box>
            </>
          )}
        {selectedObject && selectedObject.type === "circle" && (
          <>
            <label className="label">Diameter</label>
            <Input value={diameter} onChange={handleDiameterChange} />
            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <input
                type="color"
                value={color}
                onChange={handleColorChange}
                style={{
                  border: "none",
                  background: "none",
                  width: "40px",
                  height: "40px",
                  cursor: "pointer",
                }}
              />
              <Input value={color} onChange={handleColorChange} />
            </Box>
          </>
        )}
        {selectedObject && selectedObject.type === "image" && (
          <>
            <label className="label">Height</label>
            <Input value={width} onChange={handleWidthChange} />
            <label className="label">Width</label>
            <Input value={height} onChange={handleHeightChange} />
          </>
        )}
        {selectedObject && selectedObject.type === "textbox" && (
          <>
            <label className="label">Font Size</label>
            <Input value={fontSize} onChange={handleFontSizeChange} />
          </>
        )}
      </div>
    )
  );
}
