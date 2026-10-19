import type { ProjectStatus } from './projectStatus';

export interface ProjectList {
  id: string;
  name: string;
  status: ProjectStatus;
  owner: string;
}
