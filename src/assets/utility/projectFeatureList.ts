import type { ProjectFeature } from '../types/projectFunctional.ts';

const projectFeatureList: ProjectFeature[] = [
  {
    featureId: 'FEAT-001',
    featureName: 'Project Management',
    featureDetail: 'Manage project information and status',
    projectId: 'DX-001',
    featureOwner: 'Manatsawin',
    featureStatus: 'In Progress',
    priority: 'High',
  },
  {
    featureId: 'FEAT-002',
    featureName: 'User Management',
    featureDetail: 'Manage system users and permissions',
    projectId: 'DX-001',
    featureOwner: 'Manatsawin',
    featureStatus: 'Not Started',
    priority: 'Medium',
  },
  {
    featureId: 'FEAT-003',
    featureName: 'Sprint Management',
    featureDetail: 'Plan and track development sprints',
    projectId: 'DX-002',
    featureOwner: 'Somchai',
    featureStatus: 'Not Started',
    priority: 'Medium',
  },
];

export default projectFeatureList;
