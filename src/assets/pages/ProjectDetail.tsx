import { useParams } from 'react-router-dom';
import type { ProjectList } from '../types/project';
import type {
  ProjectFeature,
  WorkStatus,
  Priority,
  ProjectFunction,
  ProjectPbi,
} from '../types/projectFunctional.ts';

import users from '../utility/user';

import processTab from '../utility/processTab';
import { Footprints } from 'lucide-react';
import ProjectFeatureList from '../utility/projectFeatureList';
import ProjectFunctionList from '../utility/projectFunctionList';
import FunctionList from '../../components/functions/FunctionList.tsx';
import PBIsList from '../../components/pbis/PBIsList';
import { useState, useEffect } from 'react';

interface ProjectDetailProps {
  projects: ProjectList[];
}

function readStoredArray<T>(key: string, fallback: T[] = []): T[] {
  try {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function ProjectDetail({ projects }: ProjectDetailProps) {
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isAddFeatureOpenState, setIsAddFeatureOpenState] = useState(false);

  const [featureName, setFeatureName] = useState('');
  const [featureDetail, setFeatureDetail] = useState('');
  const [featureOwner, setFeatureOwner] = useState('');
  const [featureStatus, setFeatureStatus] = useState<WorkStatus>('Not Started');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [editingFeatureId, setEditingFeatureId] = useState<string | null>(null);

  const [features, setFeatures] = useState<ProjectFeature[]>(() => {
    const saved = localStorage.getItem('feature');

    if (saved !== null) {
      return JSON.parse(saved) as ProjectFeature[];
    }

    return ProjectFeatureList;
  });

  const [functions, setFunctions] =
    useState<ProjectFunction[]>(ProjectFunctionList);

  const project = projects.find((item) => item.id === projectId);

  const handleAddFeature = () => {
    if (!featureName.trim()) {
      alert('Please enter Feature Name');
      return;
    }

    if (!featureOwner) {
      alert('Please select Feature Owner');
      return;
    }

    if (!projectId) return;

    if (editingFeatureId !== null) {
      // Edit existing Feature
      setFeatures((prevFeatures) =>
        prevFeatures.map((ft) =>
          ft.featureId === editingFeatureId
            ? {
                ...ft,
                featureName: featureName.trim(),
                featureDetail: featureDetail.trim(),
                featureOwner: featureOwner,
                featureStatus: featureStatus,
                priority: priority,
              }
            : ft
        )
      );
    } else {
      // Add new Feature
      const newFeature: ProjectFeature = {
        featureId: `FEAT-${Date.now()}`,
        featureName: featureName.trim(),
        featureDetail: featureDetail.trim(),
        projectId: projectId,
        featureOwner: featureOwner,
        featureStatus: featureStatus,
        priority: priority,
      };

      setFeatures((prevFeatures) => [...prevFeatures, newFeature]);
    }

    setFeatureName('');
    setFeatureDetail('');
    setFeatureOwner('');
    setFeatureStatus('Not Started');
    setPriority('Medium');
    setEditingFeatureId(null);
    setIsAddFeatureOpenState(false);
  };

  const handleEditFeature = (ft: ProjectFeature) => {
    setEditingFeatureId(ft.featureId);

    setFeatureName(ft.featureName);
    setFeatureDetail(ft.featureDetail);
    setFeatureOwner(ft.featureOwner);
    setFeatureStatus(ft.featureStatus);
    setPriority(ft.priority);

    setIsAddFeatureOpenState(true);
  };

  const handleDeleteFeature = (featureId: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this Feature?'
    );

    if (!confirmed) return;

    setFeatures((prevFeatures) =>
      prevFeatures.filter((ft) => ft.featureId !== featureId)
    );
  };

  const feature: ProjectFeature[] = features.filter(
    (ft) => ft.projectId === projectId
  );

  // Read the latest saved Function/PBI data for the Overview dashboard.
  const overviewFunctions = readStoredArray<ProjectFunction>(
    'functions',
    ProjectFunctionList
  ).filter((fn) => feature.some((ft) => ft.featureId === fn.featureId));

  const overviewPbis = readStoredArray<ProjectPbi>('pbis').filter((pbi) =>
    overviewFunctions.some((fn) => fn.functionId === pbi.functionId)
  );

  const overviewTeamOwners = Array.from(
    new Set(
      [
        project?.owner ?? '',
        ...feature.map((ft) => ft.featureOwner),
        ...overviewFunctions.map((fn) => fn.functionOwner),
        ...overviewPbis.map((pbi) => pbi.pbiOwner),
      ].filter(Boolean)
    )
  );

  useEffect(() => {
    localStorage.setItem('feature', JSON.stringify(features));
  }, [features]);

  if (!project) {
    return <h2>Project not found</h2>;
  }

  return (
    <div className="container-fluid p-3">
      {/* Project Hero Card */}
      <div
        className="card border-0 shadow-sm rounded-4 mb-3"
        style={{ background: 'linear-gradient(120deg, #faf8ff, #eee8ff)' }}
      >
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-primary-subtle text-primary rounded-3 p-3">
                <Footprints size={36} />
              </div>

              <div>
                <h3 className="fw-bold mb-1">{project.name}</h3>
                <div className="text-secondary small">
                  {project.id} · Project Management
                </div>
                <div className="text-secondary small mt-1">
                  Owner: {project.owner}
                </div>
              </div>
            </div>

            <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2">
              {project.status}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-underline gap-3 mb-3">
        {processTab.map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              type="button"
              className={`nav-link ${
                activeTab === tab ? 'active fw-semibold' : 'text-secondary'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          </li>
        ))}
      </ul>

      {/* Main Content */}
      {activeTab === 'Overview' && (
        <div className="row g-3">
          <div className="col-12 col-lg-8">
            {/* Project summary */}
            <div className="card border-0 shadow-sm rounded-4 mb-3">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                  <div>
                    <h6 className="fw-bold mb-1">Project Summary</h6>
                    <p className="text-secondary small mb-0">
                      Overview of Features, Functions and Product Backlog Items.
                    </p>
                  </div>
                  <span className="badge bg-primary-subtle text-primary rounded-pill">
                    {project.status}
                  </span>
                </div>
                <p className="small mb-0">
                  {project.name} — track the scope, breakdown and assigned
                  owners of work in this project.
                </p>
              </div>
            </div>

            {/* Live counts */}
            <div className="row g-3 mb-3">
              <div className="col-12 col-md-4">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-secondary small">Features</span>
                      <span className="rounded-3 bg-primary-subtle text-primary p-2">
                        <i className="bi bi-layers" />
                      </span>
                    </div>
                    <h3 className="fw-bold mb-1">{feature.length}</h3>
                    <div className="text-secondary small">In this project</div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-secondary small">Functions</span>
                      <span className="rounded-3 bg-success-subtle text-success p-2">
                        <i className="bi bi-diagram-3" />
                      </span>
                    </div>
                    <h3 className="fw-bold mb-1">{overviewFunctions.length}</h3>
                    <div className="text-secondary small">
                      Under project Features
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-secondary small">PBIs</span>
                      <span className="rounded-3 bg-warning-subtle text-warning-emphasis p-2">
                        <i className="bi bi-card-checklist" />
                      </span>
                    </div>
                    <h3 className="fw-bold mb-1">{overviewPbis.length}</h3>
                    <div className="text-secondary small">
                      Under project Functions
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature breakdown */}
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h6 className="fw-bold mb-1">Feature Breakdown</h6>
                    <p className="text-secondary small mb-0">
                      Functions and PBIs grouped by Feature
                    </p>
                  </div>
                  <span className="badge bg-light text-dark border">
                    {feature.length} total
                  </span>
                </div>

                {feature.map((ft) => {
                  const featureFunctions = overviewFunctions.filter(
                    (fn) => fn.featureId === ft.featureId
                  );
                  const functionIds = featureFunctions.map(
                    (fn) => fn.functionId
                  );
                  const featurePbis = overviewPbis.filter((pbi) =>
                    functionIds.includes(pbi.functionId)
                  );

                  return (
                    <div
                      className="border rounded-3 p-3 mb-3"
                      key={ft.featureId}
                    >
                      <div className="d-flex justify-content-between align-items-start gap-2">
                        <div>
                          <div className="text-secondary small">
                            {ft.featureId}
                          </div>
                          <h6 className="fw-bold mb-1 mt-1">
                            {ft.featureName}
                          </h6>
                          <div className="text-secondary small">
                            Owner: {ft.featureOwner}
                          </div>
                        </div>
                        <span className="badge bg-light text-dark border">
                          {ft.featureStatus}
                        </span>
                      </div>

                      <div className="row g-2 mt-2 mb-3">
                        <div className="col-6">
                          <div className="bg-light rounded-3 p-2">
                            <div className="small text-secondary">
                              Functions
                            </div>
                            <div className="fw-bold">
                              {featureFunctions.length}
                            </div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="bg-light rounded-3 p-2">
                            <div className="small text-secondary">PBIs</div>
                            <div className="fw-bold">{featurePbis.length}</div>
                          </div>
                        </div>
                      </div>

                      {featureFunctions.length > 0 ? (
                        <div className="d-flex flex-column gap-2">
                          {featureFunctions.map((fn) => {
                            const functionPbis = featurePbis.filter(
                              (pbi) => pbi.functionId === fn.functionId
                            );
                            return (
                              <div
                                className="border-top pt-2"
                                key={fn.functionId}
                              >
                                <div className="d-flex justify-content-between align-items-start gap-2">
                                  <div>
                                    <div className="small fw-semibold">
                                      {fn.functionName}
                                    </div>
                                    <div className="text-secondary small">
                                      {fn.functionId} · Owner:{' '}
                                      {fn.functionOwner}
                                    </div>
                                  </div>
                                  <span className="badge bg-primary-subtle text-primary">
                                    {functionPbis.length} PBIs
                                  </span>
                                </div>
                                {functionPbis.length > 0 && (
                                  <ul className="small text-secondary mt-2 mb-0 ps-4">
                                    {functionPbis.map((pbi) => (
                                      <li key={pbi.pbiId} className="mb-1">
                                        {pbi.pbiTitle} ({pbi.pbiStatus})
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-secondary small">
                          No Functions have been added to this Feature yet.
                        </div>
                      )}
                    </div>
                  );
                })}

                {feature.length === 0 && (
                  <p className="text-center text-secondary py-4 mb-0">
                    No Features found for this project.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 mb-3">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h6 className="fw-bold mb-1">Project Team</h6>
                    <p className="text-secondary small mb-0">
                      {overviewTeamOwners.length} assigned owners
                    </p>
                  </div>
                  <span className="rounded-3 bg-light p-2">
                    <i className="bi bi-people" />
                  </span>
                </div>

                {overviewTeamOwners.map((owner) => {
                  const user = users.find(
                    (item) =>
                      item.username === owner ||
                      `${item.profile.first_name} ${item.profile.last_name}` ===
                        owner
                  );
                  const displayName = user
                    ? `${user.profile.first_name} ${user.profile.last_name}`.trim()
                    : owner;
                  const initials = displayName
                    .split(/\s+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0].toUpperCase())
                    .join('');

                  const ownedFeatures = feature.filter(
                    (ft) => ft.featureOwner === owner
                  ).length;
                  const ownedFunctions = overviewFunctions.filter(
                    (fn) => fn.functionOwner === owner
                  ).length;
                  const ownedPbis = overviewPbis.filter(
                    (pbi) => pbi.pbiOwner === owner
                  ).length;

                  return (
                    <div
                      className="d-flex align-items-start gap-2 py-3 border-top"
                      key={owner}
                    >
                      <div
                        className="rounded-circle bg-light d-flex align-items-center justify-content-center fw-semibold text-primary flex-shrink-0"
                        style={{ width: 38, height: 38 }}
                      >
                        {initials || '?'}
                      </div>
                      <div className="flex-grow-1 min-w-0">
                        <div className="small fw-semibold text-break">
                          {displayName}
                        </div>
                        <div
                          className="text-secondary"
                          style={{ fontSize: 11 }}
                        >
                          {owner === project.owner
                            ? 'Project Owner'
                            : 'Assigned to project work'}
                        </div>
                        <div className="text-secondary small mt-1">
                          {ownedFeatures} Features · {ownedFunctions} Functions
                          · {ownedPbis} PBIs
                        </div>
                      </div>
                    </div>
                  );
                })}

                {overviewTeamOwners.length === 0 && (
                  <p className="text-secondary small mb-0">
                    No assigned owners yet.
                  </p>
                )}
              </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3">Project Info</h6>
                {[
                  { label: 'Project ID', value: project.id },
                  { label: 'Owner', value: project.owner },
                  { label: 'Status', value: project.status },
                  { label: 'Type', value: 'Software Development' },
                ].map((info) => (
                  <div
                    className="d-flex justify-content-between align-items-start gap-2 border-bottom py-2"
                    key={info.label}
                  >
                    <span className="text-secondary small">{info.label}</span>
                    <span className="small fw-medium text-end">
                      {info.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Features' && (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="fw-bold mb-1">Project Features</h5>
                <p className="text-secondary small mb-0">
                  Manage features for {project.name}
                </p>
              </div>
              <h3>{isAddFeatureOpenState}</h3>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setIsAddFeatureOpenState(true)}
              >
                + Add Feature
              </button>
            </div>

            <p className="text-secondary small">
              Total Features: {feature.length}
            </p>

            <div className="row g-3">
              {feature.map((ft) => (
                <div className="col-12 col-md-6" key={ft.featureId}>
                  <div className="card h-100 rounded-3">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start gap-2">
                        <div>
                          <div className="text-secondary small">
                            {ft.featureId}
                          </div>
                          <h6 className="fw-bold mt-1">{ft.featureName}</h6>
                        </div>

                        <span className="badge bg-primary-subtle text-primary">
                          {ft.priority}
                        </span>
                      </div>

                      <p className="text-secondary small mt-2">
                        {ft.featureDetail}
                      </p>

                      <div className="d-flex justify-content-between align-items-center gap-2">
                        <span className="badge bg-light text-dark border">
                          {ft.featureStatus}
                        </span>
                        <span className="text-secondary small">
                          Owner: {ft.featureOwner}
                        </span>
                        <div className="d-flex justify-content-end mt-3">
                          <div className="d-flex justify-content-end gap-2 mt-3">
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => handleEditFeature(ft)}
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDeleteFeature(ft.featureId)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {feature.length === 0 && (
              <p className="text-center text-secondary py-4 mb-0">
                No features found for this project.
              </p>
            )}
          </div>
        </div>
      )}
      {isAddFeatureOpenState && (
        <div
          className="modal d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingFeatureId !== null ? 'Edit Feature' : 'Add Feature'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setIsAddFeatureOpenState(false)}
                />
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Feature Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter feature name"
                    value={featureName}
                    onChange={(e) => setFeatureName(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Feature Detail</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Enter feature detail"
                    value={featureDetail}
                    onChange={(e) => setFeatureDetail(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <select
                    className="form-select"
                    value={featureOwner}
                    onChange={(e) => setFeatureOwner(e.target.value)}
                  >
                    <option value="">Select Feature Owner</option>

                    {users
                      .filter((user) => user.status === 'active')
                      .map((user) => (
                        <option key={user.id} value={user.username}>
                          {user.profile.first_name} {user.profile.last_name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={featureStatus}
                    onChange={(e) =>
                      setFeatureStatus(e.target.value as WorkStatus)
                    }
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer d-flex justify-content-between align-items-center">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsAddFeatureOpenState(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleAddFeature}
                >
                  {editingFeatureId !== null ? 'Save Changes' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Functions' && (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4">
            <FunctionList features={feature} />
          </div>
        </div>
      )}

      {activeTab === 'PBIs' && (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4">
            <PBIsList features={feature} />
          </div>
        </div>
      )}

      {activeTab === 'Sprints' && (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4">
            <h5 className="fw-bold">Project Sprints</h5>
            <p className="text-secondary mb-0">
              Plan and track development sprints.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectDetail;
