import { AchoClient, ClientOptions, RequestOptions } from '../types';

interface SendEmailParams {
  subject: string;
  bodyTemplate: string;
  placeholders?: Record<string, string>;
  recipients: string[];
  scheduledTime?: string; // ISO 8601 format
}

interface EmailRecord {
  id: string;
  recipients: string[];
  subject: string;
  body: string;
  status: 'sent' | 'pending';
  scheduledTime?: string | null;
  sentTime?: string;
}

interface ListOptions {
  filterOptions?: Record<string, any>;
  pageOptions?: Record<string, any>;
  sortOptions?: Record<string, any>;
}

interface EmailTemplateParams {
  name: string;
  description?: string;
  subject?: string;
  bodyTemplate?: string;
  variables?: Record<string, any>;
}

interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  bodyTemplate: string;
  variables: Record<string, any>;
}

class EmailService {
  public achoClientOpt: ClientOptions;

  constructor(achoClientOpt?: ClientOptions) {
    this.achoClientOpt = {
      ...achoClientOpt,
      apiToken: achoClientOpt?.apiToken || process.env.ACHO_TOKEN
    };
  }

  /**
   * Send an email via the API.
   * @param params - The email parameters.
   * @returns Promise<EmailRecord>
   */
  async sendEmail(params: SendEmailParams): Promise<EmailRecord> {
    const achoClient: AchoClient = new AchoClient(this.achoClientOpt);
    const reqConfig: RequestOptions = {
      method: 'post',
      path: '/service/email/send',
      headers: {},
      payload: params
    };

    const response = await achoClient.request(reqConfig);
    return response;
  }

  /**
   * List sent and pending emails.
   * @param options - Filtering, paging, and sorting options.
   * @returns Promise<EmailRecord[]>
   */
  async listEmails(options: ListOptions): Promise<EmailRecord[]> {
    const achoClient: AchoClient = new AchoClient(this.achoClientOpt);
    const reqConfig: RequestOptions = {
      method: 'post',
      path: '/service/email/record/list',
      headers: {},
      payload: options
    };

    const response = await achoClient.request(reqConfig);
    return response;
  }

  /**
   * Update a pending email record.
   * @param recordId - The email record ID.
   * @param params - Parameters to update.
   * @returns Promise<EmailRecord>
   */
  async updateEmail(recordId: string, params: SendEmailParams): Promise<EmailRecord> {
    const achoClient: AchoClient = new AchoClient(this.achoClientOpt);
    const reqConfig: RequestOptions = {
      method: 'put',
      path: `/service/email/record/${recordId}`,
      headers: {},
      payload: params
    };

    const response = await achoClient.request(reqConfig);
    return response;
  }

  /**
   * Delete a pending email record.
   * @param recordId - The email record ID.
   * @returns Promise<void>
   */
  async deleteEmail(recordId: string): Promise<void> {
    const achoClient: AchoClient = new AchoClient(this.achoClientOpt);
    const reqConfig: RequestOptions = {
      method: 'delete',
      path: `/service/email/record/${recordId}`,
      headers: {}
    };

    const response = await achoClient.request(reqConfig);
    return response;
  }

  /**
   * Create a new email template.
   * @param params - The email template parameters.
   * @returns Promise<EmailTemplate>
   */
  async createTemplate(params: EmailTemplateParams): Promise<EmailTemplate> {
    const achoClient: AchoClient = new AchoClient(this.achoClientOpt);
    const reqConfig: RequestOptions = {
      method: 'post',
      path: '/service/email/template',
      headers: {},
      payload: params
    };

    const response = await achoClient.request(reqConfig);
    return response;
  }

  /**
   * List all email templates.
   * @param options - Filtering, paging, and sorting options.
   * @returns Promise<EmailTemplate[]>
   */
  async listTemplates(options: ListOptions): Promise<EmailTemplate[]> {
    const achoClient: AchoClient = new AchoClient(this.achoClientOpt);
    const reqConfig: RequestOptions = {
      method: 'post',
      path: '/service/email/template/list',
      headers: {},
      payload: options
    };

    const response = await achoClient.request(reqConfig);
    return response;
  }

  /**
   * Update an existing email template.
   * @param templateId - The template ID.
   * @param params - Updated template parameters.
   * @returns Promise<EmailTemplate>
   */
  async updateTemplate(templateId: string, params: Partial<EmailTemplateParams>): Promise<EmailTemplate> {
    const achoClient: AchoClient = new AchoClient(this.achoClientOpt);
    const reqConfig: RequestOptions = {
      method: 'put',
      path: `/service/email/template/${templateId}`,
      headers: {},
      payload: params
    };

    const response = await achoClient.request(reqConfig);
    return response;
  }

  /**
   * Delete an email template.
   * @param templateId - The template ID.
   * @returns Promise<void>
   */
  async deleteTemplate(templateId: string): Promise<void> {
    const achoClient: AchoClient = new AchoClient(this.achoClientOpt);
    const reqConfig: RequestOptions = {
      method: 'delete',
      path: `/service/email/template/${templateId}`,
      headers: {}
    };

    const response = await achoClient.request(reqConfig);
    return response;
  }
}

export { EmailService, SendEmailParams, EmailRecord, ListOptions, EmailTemplateParams, EmailTemplate };
