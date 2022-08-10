export interface Project {
  type: string;
  datasetId: string;
  views: View[];
}

export interface View {
  type: string;
  tableId: string;
}

export interface ProjectHelperInfo {}
