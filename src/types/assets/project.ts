// TODO: Project type not in use, necessary?
export interface Project {
  type: string;
  datasetId: string;
  views: View[];
}

// TODO: View type not in use, necessary?
export interface View {
  type: string;
  tableId: string;
}

export interface ProjectHelperInfo {}

export interface ViewHelperInfo {
  view: Object;
}

export interface ProjectTableDataResp {
  data: Array<Object>;
  schema: ProjectTableSchemaResp;
  paging: {
    page: number;
    pageSize: number;
    pageTotal: number;
    pageToken?: string;
  };
  jobId?: string;
}

export interface ProjectTableSchemaResp {
  fields: Record<string, string>[];
}
