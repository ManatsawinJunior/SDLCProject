import type { ProjectList } from '../types/project';

interface DashboardProps {
  projects: ProjectList[];
}

function Dashboard({ projects }: DashboardProps) {
  const total = projects.length;
  const developmentCount = projects.filter(
    (proj) => proj.status === 'Development'
  ).length;
  const completedCount = projects.filter(
    (proj) => proj.status === 'Completed'
  ).length;
  const onHoldCount = projects.filter(
    (proj) => proj.status === 'On Hold'
  ).length;
  const notStartedCount = projects.filter(
    (proj) => proj.status === 'Not Started'
  ).length;

  return (
    <>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-5 g-4">
        <div className="col">
          <div className="card project-card">
            <div className="card-body">
              <p className="fw-bold">{total}</p>
              <p>Active Project</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card project-card">
            <div className="card-body">
              <p className="fw-bold">{developmentCount}</p>
              <p>Development Status</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card project-card">
            <div className="card-body">
              <p className="fw-bold">{completedCount}</p>
              <p>Completed Status</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card project-card">
            <div className="card-body">
              <p className="fw-bold">{onHoldCount}</p>
              <p>On Hold Status</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card project-card">
            <div className="card-body">
              <p className="fw-bold">{notStartedCount}</p>
              <p>Not Start Status</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
