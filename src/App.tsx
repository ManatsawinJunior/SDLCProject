import { useEffect, useState } from 'react';
import './App.css';
import {
  LayoutDashboard,
  CalendarCheck,
  SquareDashedKanban,
  Footprints,
  SunMoon,
} from 'lucide-react';

import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './assets/pages/Dashboard.tsx';
import ProjectPage from './assets/pages/ProjectPage.tsx';
import Task from './assets/pages/Task.tsx';
import Sprint from './assets/pages/Sprint.tsx';
import type { ProjectList } from './assets/types/project';
import projectList from './assets/utility/projectList';
import ProjectDetail from './assets/pages/ProjectDetail.tsx';

function App() {
  const [projects, setProjects] = useState<ProjectList[]>(() => {
    const saved = localStorage.getItem('projects');

    if (saved !== null) {
      return JSON.parse(saved) as ProjectList[];
    }

    return projectList;
  });

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  return (
    <>
      <div className="app-layout d-flex">
        <aside className="sidebar text-dark bg-offWrite">
          <div className="sidebar-band">
            <SunMoon size={18} />
            <h5>DX ProjectFlow</h5>
          </div>

          <nav className="sidebar-menu">
            <div className="sidebar-menu-main">
              <NavLink
                to="/dashboard"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </NavLink>
            </div>
            <div className="sidebar-menu-header">
              <small className="text-secondary fw-bold">Operation</small>
            </div>
            <div className="sidebar-menu-content">
              <div className="menu-content">
                <NavLink
                  to="/projects"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  <CalendarCheck size={18} />
                  Projects
                </NavLink>
                <NavLink
                  to="/task"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  <CalendarCheck size={18} />
                  Task
                </NavLink>
                <NavLink
                  to="/sprint"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  <Footprints size={18} />
                  Sprint
                </NavLink>
              </div>
            </div>

            <div className="sidebar-menu-header-sub">
              <small className="text-secondary fw-bold">Management</small>
            </div>

            <div className="sidebar-menu-content-sub">
              <div className="menu-content">
                <p>
                  <LayoutDashboard size={18} />
                  Setting
                </p>
                <p>
                  <SquareDashedKanban size={18} />
                  Permission
                </p>
                <p>
                  <CalendarCheck size={18} />
                  About
                </p>
              </div>
            </div>
          </nav>

          <div className="sidebar-footer">
            <p>Copy right DX Engineer</p>
            <p>Manatsawin S.</p>
          </div>
        </aside>

        <div className="app-main">
          <header className="app-header">
            <h3>Project Management</h3>
          </header>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              <Route
                path="/dashboard"
                element={<Dashboard projects={projects} />}
              />

              <Route
                path="/projects"
                element={
                  <ProjectPage projects={projects} setProjects={setProjects} />
                }
              />

              <Route path="/task" element={<Task />} />

              <Route path="/sprint" element={<Sprint />} />

              <Route
                path="/project/:projectId"
                element={<ProjectDetail projects={projects} />}
              />
            </Routes>
          </main>

          <footer className="app-footer">{/* Version และ Copyright */}</footer>
        </div>
      </div>
    </>
  );
}

export default App;
