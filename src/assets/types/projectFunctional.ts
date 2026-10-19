export type WorkStatus =
  | 'Not Started'
  | 'In Progress'
  | 'Completed'
  | 'On Hold';

export type Priority =
  | 'Low'
  | 'Medium'
  | 'High'
  | 'Critical';

// Feature
export interface ProjectFeature {
  featureId: string;
  featureName: string;
  featureDetail: string;
  projectId: string;
  featureOwner: string;
  featureStatus: WorkStatus;
  priority: Priority;
}

// Function
export interface ProjectFunction {
  functionId: string;
  functionName: string;
  functionDetail: string;
  featureId: string;
  functionOwner: string;
  functionStatus: WorkStatus;
}

// Product Backlog Item
export interface ProjectPbi {
  pbiId: string;
  pbiTitle: string;
  pbiDetail: string;
  functionId: string;
  pbiOwner: string;
  pbiStatus: WorkStatus;
  priority: Priority;
  storyPoints: number;
  acceptanceCriteria: string[];
  sprintId: string | null;
}