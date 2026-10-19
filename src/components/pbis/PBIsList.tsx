import { useEffect, useState } from 'react';
import type {
  ProjectFeature,
  ProjectFunction,
  ProjectPbi,
  WorkStatus,
  Priority,
} from '../../assets/types/projectFunctional';
import ProjectFunctionList from '../../assets/utility/projectFunctionList';

interface PBIListProps {
  features: ProjectFeature[];
}
const PBI_STATUSES: WorkStatus[] = [
  'Not Started',
  'In Progress',
  'Completed',
  'On Hold',
];

const PBI_PRIORITIES: Priority[] = ['Low', 'Medium', 'High', 'Critical'];

function PBIsList({ features }: PBIListProps) {
  const [functions] = useState<ProjectFunction[]>(() => {
    const saved = localStorage.getItem('functions');

    if (saved !== null) {
      try {
        return JSON.parse(saved) as ProjectFunction[];
      } catch {
        return ProjectFunctionList;
      }
    }

    return ProjectFunctionList;
  });

  const projectFeatureIds = new Set(
    features.map((feature) => feature.featureId)
  );

  const projectFunctions = functions.filter((fn) =>
    projectFeatureIds.has(fn.featureId)
  );

  const [pbis, setPbis] = useState<ProjectPbi[]>(() => {
    const saved = localStorage.getItem('pbis');

    if (saved !== null) {
      try {
        return JSON.parse(saved) as ProjectPbi[];
      } catch {
        return [];
      }
    }

    return [];
  });

  const [selectedFunctionId, setSelectedFunctionId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPbiId, setEditingPbiId] = useState<string | null>(null);

  const [pbiTitle, setPbiTitle] = useState('');
  const [pbiDetail, setPbiDetail] = useState('');
  const [pbiOwner, setPbiOwner] = useState('');
  const [pbiStatus, setPbiStatus] = useState<WorkStatus>('Not Started');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [storyPoints, setStoryPoints] = useState(1);
  const [acceptanceCriteriaText, setAcceptanceCriteriaText] = useState('');

  useEffect(() => {
    localStorage.setItem('pbis', JSON.stringify(pbis));
  }, [pbis]);

  const selectedFunction = functions.find(
    (fn) => fn.functionId === selectedFunctionId
  );

  const selectedPbis = pbis.filter(
    (pbi) => pbi.functionId === selectedFunctionId
  );

  const resetForm = () => {
    setPbiTitle('');
    setPbiDetail('');
    setPbiOwner('');
    setPbiStatus('Not Started');
    setPriority('Medium');
    setStoryPoints(1);
    setAcceptanceCriteriaText('');
    setEditingPbiId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pbi: ProjectPbi) => {
    setEditingPbiId(pbi.pbiId);
    setSelectedFunctionId(pbi.functionId);
    setPbiTitle(pbi.pbiTitle);
    setPbiDetail(pbi.pbiDetail);
    setPbiOwner(pbi.pbiOwner);
    setPbiStatus(pbi.pbiStatus);
    setPriority(pbi.priority);
    setStoryPoints(pbi.storyPoints);
    setAcceptanceCriteriaText(pbi.acceptanceCriteria.join('\n'));
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!pbiTitle.trim()) {
      alert('Please enter PBI Title');
      return;
    }

    if (!pbiOwner.trim()) {
      alert('Please enter PBI Owner');
      return;
    }

    if (!selectedFunctionId) {
      alert('Please select a Function');
      return;
    }

    if (!Number.isInteger(storyPoints) || storyPoints < 1) {
      alert('Story Points must be a positive whole number');
      return;
    }

    const acceptanceCriteria = acceptanceCriteriaText
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);

    if (editingPbiId !== null) {
      setPbis((previous) =>
        previous.map((pbi) =>
          pbi.pbiId === editingPbiId
            ? {
                ...pbi,
                pbiTitle: pbiTitle.trim(),
                pbiDetail: pbiDetail.trim(),
                functionId: selectedFunctionId,
                pbiOwner: pbiOwner.trim(),
                pbiStatus,
                priority,
                storyPoints,
                acceptanceCriteria,
              }
            : pbi
        )
      );
    } else {
      const newPbi: ProjectPbi = {
        pbiId: `PBI-${Date.now()}`,
        pbiTitle: pbiTitle.trim(),
        pbiDetail: pbiDetail.trim(),
        functionId: selectedFunctionId,
        pbiOwner: pbiOwner.trim(),
        pbiStatus,
        priority,
        storyPoints,
        acceptanceCriteria,
        sprintId: null,
      };

      setPbis((previous) => [...previous, newPbi]);
    }

    resetForm();
    setIsModalOpen(false);
  };

  const handleDelete = (pbiId: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this PBI?'
    );

    if (!confirmed) return;

    setPbis((previous) => previous.filter((pbi) => pbi.pbiId !== pbiId));
  };

  return (
    <>
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
            <div>
              <h5 className="fw-bold mb-1">Product Backlog Items</h5>
              <p className="text-secondary small mb-0">
                Manage PBIs under each Function
              </p>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={!selectedFunctionId}
              onClick={handleOpenAdd}
            >
              + Add PBI
            </button>
          </div>

          <div className="mb-4">
            <label className="form-label">Select Function</label>
            <select
              className="form-select"
              value={selectedFunctionId}
              onChange={(e) => setSelectedFunctionId(e.target.value)}
            >
              <option value="">Select Function</option>

              {functions.map((fn) => (
                <option key={fn.functionId} value={fn.functionId}>
                  {fn.functionName} ({fn.functionId})
                </option>
              ))}
            </select>
          </div>

          {selectedFunctionId && (
            <>
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                <div>
                  <h6 className="fw-bold mb-1">
                    {selectedFunction?.functionName}
                  </h6>
                  <p className="text-secondary small mb-0">
                    Total PBIs: {selectedPbis.length}
                  </p>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>PBI</th>
                      <th>Owner</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Points</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {selectedPbis.map((pbi) => (
                      <tr key={pbi.pbiId}>
                        <td>
                          <div className="fw-semibold">{pbi.pbiTitle}</div>
                          <div className="text-secondary small">
                            {pbi.pbiId}
                          </div>
                          {pbi.pbiDetail && (
                            <div className="text-secondary small mt-1">
                              {pbi.pbiDetail}
                            </div>
                          )}
                        </td>

                        <td>{pbi.pbiOwner}</td>

                        <td>
                          <span className="badge bg-light text-dark border">
                            {pbi.pbiStatus}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`badge ${
                              pbi.priority === 'Critical'
                                ? 'bg-danger'
                                : pbi.priority === 'High'
                                ? 'bg-warning text-dark'
                                : 'bg-secondary'
                            }`}
                          >
                            {pbi.priority}
                          </span>
                        </td>

                        <td>{pbi.storyPoints}</td>

                        <td>
                          <div className="d-flex gap-2">
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => handleOpenEdit(pbi)}
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDelete(pbi.pbiId)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {selectedPbis.length === 0 && (
                <p className="text-center text-secondary py-4 mb-0">
                  No PBIs found for this Function.
                </p>
              )}
            </>
          )}

          {!selectedFunctionId && (
            <p className="text-center text-secondary py-4 mb-0">
              Please select a Function to view its PBIs.
            </p>
          )}

          {functions.length === 0 && (
            <div className="alert alert-info mt-3 mb-0">
              Create a Function first before adding PBIs.
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div
          className="modal d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        >
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingPbiId !== null ? 'Edit PBI' : 'Add PBI'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => {
                    resetForm();
                    setIsModalOpen(false);
                  }}
                />
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Function</label>
                  <select
                    className="form-select"
                    value={selectedFunctionId}
                    onChange={(e) => setSelectedFunctionId(e.target.value)}
                  >
                    <option value="">Select Function</option>
                    {functions.map((fn) => (
                      <option key={fn.functionId} value={fn.functionId}>
                        {fn.functionName} ({fn.functionId})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">PBI Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Create Project API"
                    value={pbiTitle}
                    onChange={(e) => setPbiTitle(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">PBI Detail</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Describe the work to be done"
                    value={pbiDetail}
                    onChange={(e) => setPbiDetail(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">PBI Owner</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter owner name"
                    value={pbiOwner}
                    onChange={(e) => setPbiOwner(e.target.value)}
                  />
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={pbiStatus}
                      onChange={(e) =>
                        setPbiStatus(e.target.value as WorkStatus)
                      }
                    >
                      {PBI_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Priority</label>
                    <select
                      className="form-select"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as Priority)}
                    >
                      {PBI_PRIORITIES.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Story Points</label>
                    <input
                      type="number"
                      min={1}
                      step={1}
                      className="form-control"
                      value={storyPoints}
                      onChange={(e) => setStoryPoints(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="form-label">Acceptance Criteria</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder={
                      'Enter one criterion per line\nExample:\nAPI returns project data\nInvalid input returns an error'
                    }
                    value={acceptanceCriteriaText}
                    onChange={(e) => setAcceptanceCriteriaText(e.target.value)}
                  />
                  <div className="form-text">
                    Enter one acceptance criterion per line.
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    resetForm();
                    setIsModalOpen(false);
                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleSave}
                >
                  {editingPbiId !== null ? 'Save Changes' : 'Create PBI'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PBIsList;
