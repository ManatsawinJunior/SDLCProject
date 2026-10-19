import type { ProjectFunction } from '../../assets/types/projectFunctional';

interface FunctionCardProps {
  fn: ProjectFunction;
  onEdit: (fn: ProjectFunction) => void;
  onDelete: (functionId: string) => void;
}

function FunctionCard({ fn, onEdit, onDelete }: FunctionCardProps) {
  return (
    <div className="col-12 col-md-6">
      <div className="card h-100 rounded-3">
        <div className="card-body">
          <div className="text-secondary small">{fn.functionId}</div>

          <h6 className="fw-bold mt-1">{fn.functionName}</h6>

          <p className="text-secondary small">{fn.functionDetail}</p>

          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <span className="badge bg-light text-dark border">
              {fn.functionStatus}
            </span>

            <span className="text-secondary small">
              Owner: {fn.functionOwner}
            </span>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-3">
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => onEdit(fn)}
            >
              Edit
            </button>

            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={() => onDelete(fn.functionId)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FunctionCard;
