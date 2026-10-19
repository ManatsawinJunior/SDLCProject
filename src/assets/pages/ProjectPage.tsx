import { useState } from 'react';
import ProjectCard from '../../components/ProjectCard.jsx';
import ProjectForm from '../../components/projectForm.jsx';
import type { ProjectList } from '../types/project.ts';
import type { ProjectStatus } from '../types/projectStatus.ts';

interface ProjectProps {
  projects: ProjectList[];
  setProjects: React.Dispatch<React.SetStateAction<ProjectList[]>>;
}

function ProjectPage({ projects, setProjects }: ProjectProps) {
  const [editingid, setEditingId] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [projectOwner, setProjectOwner] = useState('');
  const [errorHandle, setErrorHandle] = useState('');

  const addProject = (projectName: string, projectOwner: string) => {
    setProjects((prev) => {
      const newProj: ProjectList = {
        id: `DX-${String(prev.length + 1).padStart(3, '0')}`,
        name: projectName,
        status: 'Development',
        owner: projectOwner,
      };

      return [...prev, newProj];
    });
  };

  const updateStatus = (id: string, status: ProjectStatus) => {
    setProjects((prev) => {
      return prev.map((pr) => (pr.id === id ? { ...pr, status: status } : pr));
    });
  };

  const deleteItem = (id: string) => {
    setProjects((prev) => prev.filter((pj) => pj.id !== id));
  };

  const editing = (id: string) => {
    const selectedProj = projects.find((proj) => proj.id === id);

    if (!selectedProj) return;

    setProjectName(selectedProj.name);
    setProjectOwner(selectedProj.owner);
    setEditingId(id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (projectName.trim() === '' || projectOwner.trim() === '') {
      setErrorHandle('Please enter both Project Name and Project Owner.');

      return;
    }

    editingid === null
      ? addProject(projectName, projectOwner)
      : setProjects((prev) =>
          prev.map((proj) =>
            proj.id === editingid
              ? { ...proj, name: projectName, owner: projectOwner }
              : proj
          )
        );

    setEditingId(null);
    setProjectName('');
    setProjectOwner('');
    setErrorHandle('');
  };

  const handleReset = () => {
    setProjects(projects);
    setProjectName('');
    setProjectOwner('');
    setErrorHandle('');
    setEditingId(null);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 col-sm-6">
          <ProjectForm
            setProject={setProjects}
            handleSubmit={handleSubmit}
            projectOwner={projectOwner}
            projectName={projectName}
            setProjectName={setProjectName}
            setProjectOwner={setProjectOwner}
            errorHandle={errorHandle}
            onEditing={editing}
            editingid={editingid}
            handleReset={handleReset}
          ></ProjectForm>
        </div>
        <div className="col-md-9">
          <ProjectCard
            projectList={projects}
            onDelete={deleteItem}
            onUpdateStatus={updateStatus}
            onEditing={editing}
            editingid={editingid}
          />
        </div>
      </div>
    </div>
  );
}

export default ProjectPage;
