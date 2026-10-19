import { useEffect, useMemo, useState } from 'react';
import type {
  ProjectFeature,
  ProjectFunction,
  ProjectPbi,
  WorkStatus,
  Priority,
} from '../../assets/types/projectFunctional';
import ProjectFunctionList from '../../assets/utility/projectFunctionList';

interface PBIsListProps {
  features: ProjectFeature[];
}

const statuses: WorkStatus[] = [
  'Not Started',
  'In Progress',
  'Completed',
  'On Hold',
];

const priorities: Priority[] = ['Low', 'Medium', 'High', 'Critical'];

const emptyPbiForm = {
  pbiTitle: '',
  pbiDetail: '',
  pbiOwner: '',
  pbiStatus: 'Not Started' as WorkStatus,
  priority: 'Medium' as Priority,
  storyPoints: 1,
  acceptanceCriteriaText: '',
};

function PBIsList({ features }: PBIsListProps) {
  // FunctionList currently owns its own state and persists it to localStorage.
  // Read the same saved collection here so existing Function CRUD remains intact.
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

  const projectFeatureIds = useMemo(
    () => new Set(features.map((feature) => feature.featureId)),
    [features]
  );

  const projectFunctions = useMemo(
    () => functions.filter((fn) => projectFeatureIds.has(fn.featureId)),
    [functions, projectFeatureIds]
  );

  const [selectedFunctionId, setSelectedFunctionId] = useState('');
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPbiId, setEditingPbiId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyPbiForm);

  useEffect(() => {
    localStorage.setItem('pbis', JSON.stringify(pbis));
  }, [pbis]);

  // If the selected function is no longer available, clear the selection.
  useEffect(() => {
    if (
      selectedFunctionId &&
      !projectFunctions.some((fn) => fn.functionId === selectedFunctionId)
    ) {
      setSelectedFunctionId('');
    }
  }, [projectFunctions, selectedFunctionId]);

  const selectedFunction = projectFunctions.find(
    (fn) => fn.functionId === selectedFunctionId
  );

  const selectedPbis = pbis.filter(
    (pbi) => pbi.functionId === selectedFunctionId
  );

  const updateForm = <K extends keyof typeof emptyPbiForm>(
    key: K,
    value: (typeof emptyPbiForm)[K]
  ) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const resetForm = () => {
    setForm(emptyPbiForm);
    setEditingPbiId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pbi: ProjectPbi) => {
    setEditingPbiId(pbi.pbiId);
    setForm({
      pbiTitle: pbi.pbiTitle,
      pbiDetail: pbi.pbiDetail,
      pbiOwner: pbi.pbiOwner,
      pbiStatus: pbi.pbiStatus,
      priority: pbi.priority,
      storyPoints: pbi.storyPoints,
      acceptanceCriteriaText: pbi.acceptanceCriteria.join('\n'),
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!form.pbiTitle.trim()) {
      window.alert('Please enter PBI Title');
      return;
    }

    if (!form.pbiOwner.trim()) {
      window.alert('Please enter PBI Owner');
      return;
    }

    if (!selectedFunctionId) {
      window.alert('Please select a Function');
      return;
    }

    if (
      !Number.isInteger(Number(form.storyPoints)) ||
      Number(form.storyPoints) < 1
    ) {
      window.alert('Story Points must be a whole number greater than 0');
      return;
    }

    const acceptanceCriteria = form.acceptanceCriteriaText
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);

    if (editingPbiId !== null) {
      setPbis((previous) =>
        previous.map((pbi) =>
          pbi.pbiId === editingPbiId
            ? {
                ...pbi,
                pbiTitle: form.pbiTitle.trim(),
                pbiDetail: form.pbiDetail.trim(),
                functionId: selectedFunctionId,
                pbiOwner: form.pbiOwner.trim(),
                pbiStatus: form.pbiStatus,
                priority: form.priority,
                storyPoints: Number(form.storyPoints),
                acceptanceCriteria,
              }
            : pbi
        )
      );
    } else {
      const newPbi: ProjectPbi = {
        pbiId: `PBI-${Date.now()}`,
        pbiTitle: form.pbiTitle.trim(),
        pbiDetail: form.pbiDetail.trim(),
        functionId: selectedFunctionId,
        pbiOwner: form.pbiOwner.trim(),
        pbiStatus: form.pbiStatus,
        priority: form.priority,
        storyPoints: Number(form.storyPoints),
        acceptanceCriteria,
        sprintId: null,
      };

      setPbis((previous) => [...previous, newPbi]);
    }

    resetForm();
    setIsModalOpen(false);
  };

  const handleDelete = (pbiId: string) => {
    if (!window.confirm('Are you sure you want to delete this PBI?')) return;
    setPbis((previous) => previous.filter((pbi) => pbi.pbiId !== pbiId));
  };

  return (
    <div className="card border-0 shadow-sm rounded-4">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
          <div>
            <h5 className="fw-bold mb-1">Product Backlog Items (PBIs)</h5>
            <p className="text-secondary small mb-0">
              Manage backlog items under each Function
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
          <label className="form-label" htmlFor="pbi-function-select">
            Select Function
          </label>
          <select
            id="pbi-function-select"
            className="form-select"
            value={selectedFunctionId}
            onChange={(event) => setSelectedFunctionId(event.target.value)}
          >
            <option value="">Select Function</option>
            {projectFunctions.map((fn) => (
              <option key={fn.functionId} value={fn.functionId}>
                {fn.functionName}
              </option>
            ))}
          </select>
          {projectFunctions.length === 0 && (
            <div className="alert alert-warning mt-3 mb-0">
              No Functions found for this project. Create a Feature and Function
              first.
            </div>
          )}
        </div>

        {selectedFunctionId && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <div className="fw-semibold">
                  {selectedFunction?.functionName}
                </div>
                <div className="text-secondary small">
                  {selectedFunction?.functionId}
                </div>
              </div>
              <span className="badge bg-primary-subtle text-primary">
                Total PBIs: {selectedPbis.length}
              </span>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>PBI ID</th>
                    <th>Title</th>
                    <th>Owner</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Points</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPbis.map((pbi) => (
                    <tr key={pbi.pbiId}>
                      <td className="text-secondary small">{pbi.pbiId}</td>
                      <td>
                        <div className="fw-semibold">{pbi.pbiTitle}</div>
                        {pbi.pbiDetail && (
                          <div className="text-secondary small">
                            {pbi.pbiDetail}
                          </div>
                        )}
                        {pbi.acceptanceCriteria.length > 0 && (
                          <div className="text-secondary small mt-1">
                            {pbi.acceptanceCriteria.length} acceptance criteria
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
                              : pbi.priority === 'Medium'
                              ? 'bg-info text-dark'
                              : 'bg-secondary'
                          }`}
                        >
                          {pbi.priority}
                        </span>
                      </td>
                      <td>{pbi.storyPoints}</td>
                      <td>
                        <div className="d-flex justify-content-end gap-2">
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
                No PBIs found for this Function. Click “Add PBI” to create one.
              </p>
            )}
          </>
        )}

        {!selectedFunctionId && projectFunctions.length > 0 && (
          <p className="text-center text-secondary py-4 mb-0">
            Please select a Function to view its PBIs.
          </p>
        )}
      </div>

      {isModalOpen && (
        <div
          className="modal d-block"
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
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
                  <label className="form-label" htmlFor="pbi-title">
                    PBI Title *
                  </label>
                  <input
                    id="pbi-title"
                    className="form-control"
                    value={form.pbiTitle}
                    onChange={(event) =>
                      updateForm('pbiTitle', event.target.value)
                    }
                    placeholder="e.g. Create project form"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="pbi-detail">
                    Detail
                  </label>
                  <textarea
                    id="pbi-detail"
                    className="form-control"
                    rows={3}
                    value={form.pbiDetail}
                    onChange={(event) =>
                      updateForm('pbiDetail', event.target.value)
                    }
                    placeholder="Describe the expected work"
                  />
                </div>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="pbi-owner">
                      PBI Owner *
                    </label>
                    <input
                      id="pbi-owner"
                      className="form-control"
                      value={form.pbiOwner}
                      onChange={(event) =>
                        updateForm('pbiOwner', event.target.value)
                      }
                      placeholder="Enter owner"
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="pbi-story-points">
                      Story Points *
                    </label>
                    <input
                      id="pbi-story-points"
                      type="number"
                      min={1}
                      step={1}
                      className="form-control"
                      value={form.storyPoints}
                      onChange={(event) =>
                        updateForm('storyPoints', Number(event.target.value))
                      }
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="pbi-status">
                      Status
                    </label>
                    <select
                      id="pbi-status"
                      className="form-select"
                      value={form.pbiStatus}
                      onChange={(event) =>
                        updateForm(
                          'pbiStatus',
                          event.target.value as WorkStatus
                        )
                      }
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="pbi-priority">
                      Priority
                    </label>
                    <select
                      id="pbi-priority"
                      className="form-select"
                      value={form.priority}
                      onChange={(event) =>
                        updateForm('priority', event.target.value as Priority)
                      }
                    >
                      {priorities.map((priority) => (
                        <option key={priority} value={priority}>
                          {priority}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-3">
                  <label
                    className="form-label"
                    htmlFor="pbi-acceptance-criteria"
                  >
                    Acceptance Criteria
                  </label>
                  <textarea
                    id="pbi-acceptance-criteria"
                    className="form-control"
                    rows={4}
                    value={form.acceptanceCriteriaText}
                    onChange={(event) =>
                      updateForm('acceptanceCriteriaText', event.target.value)
                    }
                    placeholder={
                      'Enter one criterion per line\nExample: User can save a project'
                    }
                  />
                  <div className="form-text">
                    One acceptance criterion per line.
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
    </div>
  );
}

export default PBIsList;
