import type { WorkStatus } from '../../assets/types/projectFunctional';
import users from '../../assets/utility/user';

interface FunctionModalProps {
  isOpen: boolean;
  isEditing: boolean;
  functionName: string;
  functionDetail: string;
  functionOwner: string;
  functionStatus: WorkStatus;
  onNameChange: (value: string) => void;
  onDetailChange: (value: string) => void;
  onOwnerChange: (value: string) => void;
  onStatusChange: (value: WorkStatus) => void;
  onSave: () => void;
  onCancel: () => void;
}

function FunctionModal({
  isOpen,
  isEditing,
  functionName,
  functionDetail,
  functionOwner,
  functionStatus,
  onNameChange,
  onDetailChange,
  onOwnerChange,
  onStatusChange,
  onSave,
  onCancel,
}: FunctionModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="modal d-block"
      tabIndex={-1}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {isEditing ? 'Edit Function' : 'Add Function'}
            </h5>

            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onCancel}
            />
          </div>

          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Function Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter function name"
                value={functionName}
                onChange={(e) => onNameChange(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Function Detail</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Enter function detail"
                value={functionDetail}
                onChange={(e) => onDetailChange(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Function Owner</label>
              <select
                className="form-select"
                value={functionOwner}
                onChange={(e) => onOwnerChange(e.target.value)}
              >
                <option value="">Select Function Owner</option>

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
                value={functionStatus}
                onChange={(e) => onStatusChange(e.target.value as WorkStatus)}
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>

            <button type="button" className="btn btn-success" onClick={onSave}>
              {isEditing ? 'Save Changes' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FunctionModal;
