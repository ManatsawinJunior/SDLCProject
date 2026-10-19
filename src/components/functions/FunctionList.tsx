import { useEffect, useState } from 'react';
import FunctionCard from './FunctionCard';
import FunctionModal from './FunctionModal';
import type {
  ProjectFeature,
  ProjectFunction,
  WorkStatus,
} from '../../assets/types/projectFunctional';
import ProjectFunctionList from '../../assets/utility/projectFunctionList';

interface FunctionListProps {
  features: ProjectFeature[];
}

function FunctionList({ features }: FunctionListProps) {
  const [functions, setFunctions] = useState<ProjectFunction[]>(() => {
    const saved = localStorage.getItem('functions');

    if (saved !== null) {
      return JSON.parse(saved) as ProjectFunction[];
    }

    return ProjectFunctionList;
  });

  const [selectedFeatureId, setSelectedFeatureId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFunctionId, setEditingFunctionId] = useState<string | null>(
    null
  );

  const [functionName, setFunctionName] = useState('');
  const [functionDetail, setFunctionDetail] = useState('');
  const [functionOwner, setFunctionOwner] = useState('');
  const [functionStatus, setFunctionStatus] =
    useState<WorkStatus>('Not Started');

  useEffect(() => {
    localStorage.setItem('functions', JSON.stringify(functions));
  }, [functions]);

  const selectedFunctions = functions.filter(
    (fn) => fn.featureId === selectedFeatureId
  );

  const resetForm = () => {
    setFunctionName('');
    setFunctionDetail('');
    setFunctionOwner('');
    setFunctionStatus('Not Started');
    setEditingFunctionId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (fn: ProjectFunction) => {
    setEditingFunctionId(fn.functionId);
    setFunctionName(fn.functionName);
    setFunctionDetail(fn.functionDetail);
    setFunctionOwner(fn.functionOwner);
    setFunctionStatus(fn.functionStatus);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!functionName.trim()) {
      alert('Please enter Function Name');
      return;
    }

    if (!functionOwner) {
      alert('Please select Function Owner');
      return;
    }

    if (!selectedFeatureId) {
      alert('Please select a Feature');
      return;
    }

    if (editingFunctionId !== null) {
      setFunctions((previous) =>
        previous.map((fn) =>
          fn.functionId === editingFunctionId
            ? {
                ...fn,
                functionName: functionName.trim(),
                functionDetail: functionDetail.trim(),
                functionOwner,
                functionStatus,
                featureId: selectedFeatureId,
              }
            : fn
        )
      );
    } else {
      const newFunction: ProjectFunction = {
        functionId: `FUNC-${Date.now()}`,
        functionName: functionName.trim(),
        functionDetail: functionDetail.trim(),
        featureId: selectedFeatureId,
        functionOwner,
        functionStatus,
      };

      setFunctions((previous) => [...previous, newFunction]);
    }

    resetForm();
    setIsModalOpen(false);
  };

  const handleDelete = (functionId: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this Function?'
    );

    if (!confirmed) return;

    setFunctions((previous) =>
      previous.filter((fn) => fn.functionId !== functionId)
    );
  };

  return (
    <>
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
            <div>
              <h5 className="fw-bold mb-1">Function Management</h5>
              <p className="text-secondary small mb-0">
                Manage functions under each feature
              </p>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={!selectedFeatureId}
              onClick={handleOpenAdd}
            >
              + Add Function
            </button>
          </div>

          <div className="mb-4">
            <label className="form-label">Select Feature</label>
            <select
              className="form-select"
              value={selectedFeatureId}
              onChange={(e) => setSelectedFeatureId(e.target.value)}
            >
              <option value="">Select Feature</option>

              {features.map((ft) => (
                <option key={ft.featureId} value={ft.featureId}>
                  {ft.featureName}
                </option>
              ))}
            </select>
          </div>

          {selectedFeatureId && (
            <>
              <p className="text-secondary small">
                Total Functions: {selectedFunctions.length}
              </p>

              <div className="row g-3">
                {selectedFunctions.map((fn) => (
                  <FunctionCard
                    key={fn.functionId}
                    fn={fn}
                    onEdit={handleOpenEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>

              {selectedFunctions.length === 0 && (
                <p className="text-center text-secondary py-4 mb-0">
                  No functions found for this feature.
                </p>
              )}
            </>
          )}

          {!selectedFeatureId && (
            <p className="text-center text-secondary py-4 mb-0">
              Please select a feature to view its functions.
            </p>
          )}
        </div>
      </div>

      {isModalOpen && (
        <FunctionModal
          isOpen={isModalOpen}
          isEditing={editingFunctionId !== null}
          functionName={functionName}
          functionDetail={functionDetail}
          functionOwner={functionOwner}
          functionStatus={functionStatus}
          onNameChange={setFunctionName}
          onDetailChange={setFunctionDetail}
          onOwnerChange={setFunctionOwner}
          onStatusChange={setFunctionStatus}
          onSave={handleSave}
          onCancel={() => {
            resetForm();
            setIsModalOpen(false);
          }}
        />
      )}
    </>
  );
}

export default FunctionList;
