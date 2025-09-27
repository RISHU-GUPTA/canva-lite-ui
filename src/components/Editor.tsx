import { useEffect, useRef, useState } from "react";
import { IconButton, Input } from "@mui/material";
import { Canvas, Rect, Circle, Textbox } from "fabric";
import FiberManualRecordOutlinedIcon from "@mui/icons-material/FiberManualRecordOutlined";
import SquareOutlinedIcon from "@mui/icons-material/SquareOutlined";
import TitleOutlinedIcon from "@mui/icons-material/TitleOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import Setting from "./Setting.tsx";
import Tooltip from "@mui/material/Tooltip";
import Image from "./Image.tsx";
import EditorSetting from "./EditorSetting.tsx";
import "./../App.css";
import LayersList from "./LayersList.tsx";
import { useAlert } from "./Alert";
import Header from "./Header.tsx";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/axios.ts";
export default function Editor() {
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const canvasRef = useRef(null);
  const [project, setProject] = useState<any>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  useEffect(() => {
    if (!id) {
      navigate("/dashboard");
    }
    api
      .get(`/projects/${id}`)
      .then((res) => {
        console.log(res);
        setProject(res.data.data);
      })
      .catch((err) => {
        console.error("Failed to fetch project:", err);
        navigate("/dashboard");
      });
  }, [id, navigate]);

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new Canvas(canvasRef.current, {
        height: 500,
        width: 500,
        backgroundColor: "#fff",
      });
      initCanvas.renderAll();
      setCanvas(initCanvas);
      return () => {
        initCanvas.dispose();
      };
    }
  }, []);
  useEffect(() => {
    if (canvas && project?.jsonData) {
      canvas.clear();
      canvas.loadFromJSON(project.jsonData, () => {
        canvas.renderAll();
        setTimeout(() => {
          canvas.renderAll();
        }, 100);
      });
    }
  }, [canvas, project]);
  const addReactangle = () => {
    if (canvas) {
      const rect = new Rect({
        top: 100,
        left: 50,
        width: 100,
        height: 60,
        fill: "#FF1245",
      });
      canvas.add(rect);
    }
  };
  const addText = () => {
    if (canvas) {
      const text = new Textbox("Double Click to Edit", {
        top: 200,
        left: 100,
        width: 150,
        fontSize: 20,
        fill: "#000000",
        fontFamily: "Arial",
      });
      canvas.add(text);
      canvas.setActiveObject(text);
    }
  };
  const addCircle = () => {
    if (canvas) {
      const circle = new Circle({
        top: 150,
        left: 150,
        radius: 50,
        fill: "#2e8bc0",
      });
      canvas.add(circle);
    }
  };
  const downloadImage = () => {
    if (!canvas) return;
    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 1,
    });
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "canvas-image.png";
    link.click();
  };
  const saveProject = () => {
    if (!canvas || !project) return;
    const json = canvas.toJSON();
    api
      .put(`/projects/${project._id}`, { name: project.name, jsonData: json })
      .then((res) => {
        console.log(res);
        setProject(res.data.data);
        showAlert("Project saved successfully", "success");
      })
      .catch((err) => {
        console.error("Failed to save project:", err);
        showAlert("Failed to save project", "error");
      });
  };
  return (
    <>
      <Header />
      <div className="App">
        <div className="toolbar darkmode">
          <Tooltip title="Add Rectangle">
            <IconButton onClick={addReactangle}>
              <SquareOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add Circle">
            <IconButton onClick={addCircle}>
              <FiberManualRecordOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add Text">
            <IconButton onClick={addText}>
              <TitleOutlinedIcon />
            </IconButton>
          </Tooltip>

          <Image canvas={canvas} />
          <Tooltip title="Download">
            <IconButton onClick={downloadImage}>
              <FileDownloadOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Save">
            <IconButton onClick={saveProject}>
              <SaveOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Input value={project?.name} />
        </div>
        <canvas ref={canvasRef}></canvas>
        <div className="styleSetting">
          <Setting canvas={canvas} />
        </div>
        <div className="setting">
          <EditorSetting canvas={canvas} />
          <LayersList canvas={canvas} />
        </div>
      </div>
    </>
  );
}
