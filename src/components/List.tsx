import  { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import api from "../utils/axios";
interface Project {
  _id?: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function List() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);

  const [open, setOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  useEffect(() => {
    api
      .get("/projects/projects")
      .then((res) => {
        setProjects(res.data.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch projects:", err);
      });
  }, []);
  const handleCreateNew = () => {
    if (!newProjectName.trim()) return;
    api
      .post("/projects", { name: newProjectName })
      .then((res) => {
        console.log(res);
        setProjects([...projects, res.data.data]);
        setNewProjectName("");
        setOpen(false);
      })
      .catch((err) => {
        console.error("Failed to create project:", err);
      });
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // 24-hour format
    })
      .format(date)
      .replace(/\//g, "-");
  };
  const handleView = (id: string) => {
    navigate(`/project/${id}`);
  };

  return (
    <>
      <Header />
      <div className="p-6">
        {/* Top - Create New Button */}
        <div className="flex justify-end mb-4">
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(true)}
            className="rounded-lg"
          >
            Create New
          </Button>
        </div>

        {/* Table */}
        <TableContainer component={Paper} className="shadow-md">
          <Table>
            <TableHead>
              <TableRow className="bg-gray-100">
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Created On</TableCell>
                <TableCell>Updated On</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project) => (
                <TableRow
                  key={project._id}
                  hover
                  className="cursor-pointer"
                  onClick={() => handleView(project?._id!)}
                >
                  <TableCell>{project._id}</TableCell>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{formatDate(project?.createdAt!)}</TableCell>
                  <TableCell>{formatDate(project?.updatedAt!)} </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(project?._id!);
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Create Project Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Project Name"
              type="text"
              fullWidth
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateNew} variant="contained">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
