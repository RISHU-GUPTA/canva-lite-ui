import React, {  useEffect, useState } from "react";
import * as fabric from "fabric";
import { Canvas } from "fabric";
import { IconButton } from "@mui/material";
import type { SettingProps } from "../interface/common.interface";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import { DeleteOutlined } from "@mui/icons-material";
declare module "fabric" {
  interface Canvas {
    updateZIndices(): void;
  }
}
type Layer = {
  id?: string;
  type: string;
  zIndex: number;
  object: fabric.Object;
};
export default function LayersList({ canvas }: SettingProps) {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedLayer, setSelectedLayer] = useState(null);

  const addIdToObject = (object: fabric.Object & { id?: string }) => {
    if (!object.id) {
      const timestamp = new Date().getTime();
      object.id = `${object.type}_${timestamp}`;
    }
  };
  Canvas.prototype.updateZIndices = function () {
    const objects = this.getObjects();
    objects.forEach((obj, index) => {
      addIdToObject(obj as fabric.Object & { id?: string });
      obj.set("zIndex", index);
    });
  };
  const updateLayers = () => {
    if (canvas) {
      canvas.updateZIndices();
      const objs = canvas.getObjects().map((obj) => ({
        id: (obj as fabric.Object & { id?: string }).id,
        type: obj.type,
        zIndex: obj.get("zIndex"),
        object: obj,
      }));
      setLayers([...objs].reverse());
    }
  };
  const handleObjectSelected = (e: any) => {
    const selectedObj = e.selected ? e.selected[0] : null;
    if (selectedObj) {
      setSelectedLayer(selectedObj.id);
    } else {
      setSelectedLayer(null);
    }
  };
  const selectLayerInCanvas = (layerId: string | undefined) => {
    if (!canvas) return;
    const obj = canvas
      .getObjects()
      .find((o) => (o as fabric.Object & { id?: string }).id === layerId);
    if (obj) {
      canvas.setActiveObject(obj);
      canvas.renderAll();
    }
  };

  const deleteLayer = (layerId?: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!canvas || !layerId) return;
    const obj = canvas
      .getObjects()
      .find((o) => (o as fabric.Object & { id?: string }).id === layerId);
    if (obj) {
      canvas.remove(obj);
      canvas.discardActiveObject();
      canvas.renderAll();
      setSelectedLayer(null);
      updateLayers();
    }
  };
  const moveSelectedLayer = (direction: "up" | "down") => {
    if (!selectedLayer) return;
    const objects = canvas?.getObjects();
    const object = objects?.find(
      (o) => (o as fabric.Object & { id?: string }).id === selectedLayer
    );
    if (object) {
      const index = objects!.indexOf(object);
      if (direction === "up" && index < objects!.length - 1) {
        const temp = objects![index];
        objects![index] = objects![index + 1];
        objects![index + 1] = temp;
      } else if (direction === "down" && index > 0) {
        const temp = objects![index];
        objects![index] = objects![index - 1];
        objects![index - 1] = temp;
      }
      const backgroundColor = canvas?.backgroundColor;
      canvas?.clear();
      objects?.forEach((obj) => {
        canvas?.add(obj);
      });
      canvas!.backgroundColor = backgroundColor!;

      objects?.forEach((obj, i) => {
        obj.set("zIndex", i);
      });
      canvas?.setActiveObject(object);
      canvas?.renderAll();
      updateLayers();
    }
  };
  useEffect(() => {
    if (canvas) {
      canvas.on("object:added", updateLayers);
      canvas.on("object:removed", updateLayers);
      canvas.on("object:modified", updateLayers);
      canvas.on("selection:created", handleObjectSelected);
      canvas.on("selection:updated", handleObjectSelected);
      canvas.on("selection:cleared", handleObjectSelected);
      updateLayers();
      return () => {
        canvas.off("object:added", updateLayers);
        canvas.off("object:removed", updateLayers);
        canvas.off("object:modified", updateLayers);
        canvas.on("selection:created", handleObjectSelected);
        canvas.on("selection:updated", handleObjectSelected);
        canvas.on("selection:cleared", handleObjectSelected);
      };
    }
  }, [canvas]);
  return (
    layers &&
    layers.length > 0 && (
      <div className="flex flex-col bg-[#fff] p-2 rounded-md shadow-md">
        <div className="flex justify-between">
          <IconButton
            onClick={() => moveSelectedLayer("up")}
            disabled={!selectedLayer || layers[0]?.id === selectedLayer}
          >
            <ArrowUpwardOutlinedIcon />
          </IconButton>
          <IconButton
            onClick={() => moveSelectedLayer("down")}
            disabled={
              !selectedLayer || layers[layers.length - 1]?.id === selectedLayer
            }
          >
            <ArrowUpwardOutlinedIcon style={{ transform: "rotate(180deg)" }} />
          </IconButton>
        </div>
        <ul>
          {layers.map((layer) => (
            <li
              key={layer.id}
              className={`p-2 border-b cursor-pointer flex justify-between items-center ${
                selectedLayer === layer.id ? "bg-blue-200" : ""
              }`}
              onClick={() => selectLayerInCanvas(layer.id)}
            >
              <div>
                <span className="font-bold">{layer.type}</span> -{" "}
                <span className="text-sm text-gray-600">
                  Z-Index: {layer.zIndex}
                </span>
              </div>
              <IconButton onClick={(e) => deleteLayer(layer.id, e)}>
                <DeleteOutlined fontSize="small" color="error" />
              </IconButton>
            </li>
          ))}
        </ul>
      </div>
    )
  );
}
