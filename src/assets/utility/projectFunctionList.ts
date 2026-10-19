import type { ProjectFunction } from '../types/projectFunctional.ts';

const projectFunctionList: ProjectFunction[] = [
  {
    functionId: 'FUNC-001',
    functionName: 'Create Project',
    functionDetail: 'Allow users to create a new project',
    featureId: 'FEAT-001',
    functionOwner: 'manatsawin',
    functionStatus: 'In Progress',
  },
  {
    functionId: 'FUNC-002',
    functionName: 'Edit Project',
    functionDetail: 'Allow users to update project information',
    featureId: 'FEAT-001',
    functionOwner: 'manatsawin',
    functionStatus: 'Not Started',
  },
  {
    functionId: 'FUNC-003',
    functionName: 'User Login',
    functionDetail: 'Allow users to log in to the system',
    featureId: 'FEAT-002',
    functionOwner: 'phui_colleague',
    functionStatus: 'Not Started',
  },
];

export default projectFunctionList;
