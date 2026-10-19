const ProjectForm = ({
  handleSubmit,
  projectOwner,
  projectName,
  setProjectName,
  setProjectOwner,
  errorHandle,
  editingid,
  handleReset,
}) => {
  return (
    <>
      <form onSubmit={handleSubmit} action="">
        <div className="card">
          <div className="card-body">
            <div>
              <label htmlFor="projectName">Project Name : </label>
              <input
                type="text"
                id="projectName"
                className="form-control"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              ></input>
              <small className="text-secondary">
                {projectName === '' ? 'No review' : projectName}
              </small>
            </div>
            <div>
              <label htmlFor="projectOwner">Project Owner : </label>
              <input
                type="text"
                id="projectOwner"
                className="form-control"
                value={projectOwner}
                onChange={(e) => setProjectOwner(e.target.value)}
              ></input>
              <small className="text-secondary">
                {projectOwner === '' ? 'No review' : projectOwner}
              </small>
            </div>
            <small className="text-danger">
              {errorHandle === '' ? '' : errorHandle}
            </small>
          </div>

          <div className="card-footer d-flex justify-content-end gap-2">
            <button className="btn btn-sm btn-primary" type="submit">
              {editingid === null ? `+ Add Project` : `Edit Project`}
            </button>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={handleReset}
            >
              ! Reset
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default ProjectForm;
