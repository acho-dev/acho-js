export interface Resource {
  type: string;
  datasetId: string;
  tableId: string[];
  selection: string;
}

export interface ResourceHelperInfo {
  resource: Object;
  resourceTable: string;
}

export interface ResourceTableDataResp {
  data: Array<Object>;
  schema: {
    fields: Record<string, string>[];
  };
  paging: {
    page: number;
    pageSize: number;
    pageTotal: number;
    pageToken?: string;
  };
  jobId?: string;
}
