import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Folder,
  Trash,
  ListClock,
  SquarePen,
  Layers,
  GitBranch,
  ClipboardCheck,
} from 'lucide-react';

const ProjectCard = ({
  projectList,
  editingid,
  onDelete,
  onUpdateStatus,
  onEditing,
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const filteredProjects = projectList.filter((proj) => {
    const matchesSearch =
      proj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'All Status' || proj.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleProjects = filteredProjects.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getStatusClass = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-success-subtle text-success';
      case 'Development':
        return 'bg-primary-subtle text-primary';
      case 'On Hold':
        return 'bg-danger-subtle text-danger';
      case 'Not Started':
        return 'bg-warning-subtle text-dark';
      default:
        return 'bg-secondary-subtle text-secondary';
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-end gap-2 mb-3">
            <input
              type="search"
              className="form-control"
              style={{ maxWidth: '220px' }}
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setCurrentPage(1);
              }}
            />

            <select
              className="form-select"
              style={{ maxWidth: '130px' }}
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All Status">All Status</option>
              <option value="Development">Development</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
              <option value="Not Started">Not Started</option>
            </select>
          </div>
          <div className="row g-3">
            {visibleProjects.map((proj) => (
              <div className="col-md-4" key={proj.id}>
                <div
                  className="card h-100 shadow-sm border-0"
                  role="link"
                  tabIndex={0}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/project/${proj.id}`)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      navigate(`/projects/${proj.id}`);
                    }
                  }}
                >
                  <div className="card-body p-3">
                    {/* Project name and status */}
                    <div className="d-flex align-items-start gap-3">
                      <div className="rounded-3 p-3 bg-primary-subtle text-primary">
                        <Folder size={28} />
                      </div>

                      <div className="flex-grow-1">
                        <h5 className="fw-bold mb-1">{proj.name}</h5>
                        <div className="text-secondary small">{proj.id}</div>
                        <div className="text-secondary small mt-2">
                          {proj.description || 'Project description'}
                        </div>
                      </div>

                      <span
                        className={`badge rounded-pill px-3 py-2 ${getStatusClass(
                          proj.status
                        )}`}
                      >
                        {proj.status}
                      </span>
                    </div>

                    {/* Feature, Function and PBI counts */}
                    <div className="row mt-3 g-2">
                      <div className="col-4">
                        <div className="d-flex align-items-center gap-2">
                          <Layers size={17} className="text-secondary" />
                          <div>
                            <div className="fw-bold small">0</div>
                            <div className="text-secondary small">Features</div>
                          </div>
                        </div>
                      </div>

                      <div className="col-4">
                        <div className="d-flex align-items-center gap-2">
                          <GitBranch size={17} className="text-secondary" />
                          <div>
                            <div className="fw-bold small">0</div>
                            <div className="text-secondary small">
                              Functions
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-4">
                        <div className="d-flex align-items-center gap-2">
                          <ClipboardCheck
                            size={17}
                            className="text-secondary"
                          />
                          <div>
                            <div className="fw-bold small">0</div>
                            <div className="text-secondary small">PBIs</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="d-flex align-items-center gap-2 mt-3">
                      <div
                        className="progress flex-grow-1"
                        style={{ height: '20px' }}
                      >
                        <div
                          className="progress-bar"
                          style={{
                            width: proj.status === 'Completed' ? '100%' : '0%',
                          }}
                        />
                      </div>
                      <span className="small fw-bold">
                        {proj.status === 'Completed' ? '100%' : '0%'}
                      </span>
                    </div>

                    {/* Operation buttons */}
                    <div
                      className="d-flex justify-content-end gap-2 mt-3 pt-2 border-top"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        title="Delete project"
                        onClick={() => onDelete(proj.id)}
                      >
                        <Trash size={16} />
                      </button>

                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        title="Update status"
                        onClick={() => onUpdateStatus(proj.id, 'Completed')}
                      >
                        <ListClock size={16} />
                      </button>

                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        title="Edit project"
                        onClick={() => onEditing(proj.id)}
                      >
                        <SquarePen size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <p>
              {filteredProjects.length === 0
                ? 'There are not your project'
                : ''}
            </p>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-3">
        <span className="text-secondary small">
          Showing {projectList.length === 0 ? 0 : startIndex + 1}
          {'–'}
          {Math.min(startIndex + itemsPerPage, projectList.length)}
          {' of '}
          {projectList.length} projects
        </span>

        <nav aria-label="Project pagination">
          <ul className="pagination pagination-sm mb-0">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                type="button"
                className="page-link"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, index) => (
              <li
                key={index + 1}
                className={`page-item ${
                  currentPage === index + 1 ? 'active' : ''
                }`}
              >
                <button
                  type="button"
                  className="page-link"
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${
                currentPage === totalPages || totalPages === 0 ? 'disabled' : ''
              }`}
            >
              <button
                type="button"
                className="page-link"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default ProjectCard;
