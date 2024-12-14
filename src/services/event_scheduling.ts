import { AchoClient, ClientOptions, RequestOptions } from '../types';

interface EventTemplateVariable {
  description: string;
  name: string;
}

interface EventTemplate {
  id?: string;
  name: string;
  description: string;
  bodyTemplate: string;
  variables: EventTemplateVariable[];
  location?: string;
  zoomAccount?: string;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface AvailabilityDay {
  day: string;
  slots: TimeSlot[];
}

interface AvailabilityConfig {
  identifier: string;
  timezone: string;
  availability: AvailabilityDay[];
}

interface EventPlaceholders {
  [key: string]: string;
}

interface Event {
  id?: string;
  identifier: string;
  title: string;
  bodyTemplate: string;
  placeholders?: EventPlaceholders;
  startAt: string;
  endAt: string;
  location?: string;
  meetingType?: 'in_person' | 'virtual';
  meetingInfo?: any;
}

interface Vacation {
  name: string;
  startTime: string;
  endTime: string;
}

interface VacationConfig {
  identifier: string;
  timezone: string;
  vacation: Vacation[];
}

class EventSchedulingService {
  public achoClientOpt: ClientOptions;

  constructor(achoClientOpt?: ClientOptions) {
    this.achoClientOpt = {
      ...achoClientOpt,
      apiToken: achoClientOpt?.apiToken || process.env.ACHO_TOKEN
    };
  }

  /**
   * Add an event template.
   * @param params - The event template parameters.
   * @returns Promise<EventTemplate>
   * */
  async addEventTemplate(params: EventTemplate): Promise<EventTemplate> {
    const achoClient: AchoClient = new AchoClient(this.achoClientOpt);
    const reqOptions: RequestOptions = {
      method: 'post',
      path: '/service/event-scheduling/templates',
      headers: {},
      payload: params
    };

    const response = await achoClient.request(reqOptions);
    return response;
  }

  /**
   * List event templates.
   * @returns Promise<EventTemplate[]>
   * */
  async listEventTemplates(): Promise<EventTemplate[]> {
    const achoClient: AchoClient = new AchoClient(this.achoClientOpt);
    const reqOptions: RequestOptions = {
      method: 'post',
      path: '/service/event-scheduling/templates/list',
      headers: {}
    };

    const response = await achoClient.request(reqOptions);
    return response;
  }

  /**
   * Get an event template by identifier.
   * @param templateId - The event template identifier.
   * @returns Promise<EventTemplate>
   * */
  async updateEventTemplate(templateId: string, params: EventTemplate): Promise<EventTemplate> {
    const achoClient: AchoClient = new AchoClient(this.achoClientOpt);
    const reqOptions: RequestOptions = {
      method: 'put',
      path: `/service/event-scheduling/templates/${templateId}`,
      headers: {},
      payload: params
    };

    const response = await achoClient.request(reqOptions);
    return response;
  }

  /**
   * Delete an event template by identifier.
   * @param templateId - The event template identifier.
   * @returns Promise<void>
   * */
  async deleteEventTemplate(templateId: string): Promise<void> {
    const achoClient: AchoClient = new AchoClient(this.achoClientOpt);
    const reqOptions: RequestOptions = {
      method: 'delete',
      path: `/service/event-scheduling/templates/${templateId}`,
      headers: {}
    };

    const response = await achoClient.request(reqOptions);
    return response;
  }

  /**
   * Set availability config.
   * @param params - The availability config parameters.
   * @returns Promise<AvailabilityConfig>
   * */
  async setAvailabilityConfig(params: AvailabilityConfig): Promise<AvailabilityConfig> {
    const achoClient: AchoClient = new AchoClient(this.achoClientOpt);
    const reqOptions: RequestOptions = {
      method: 'post',
      path: '/service/event-scheduling/availability/configs',
      headers: {},
      payload: params
    };

    const response = await achoClient.request(reqOptions);
    return response;
  }

  /**
   * Get availability config.
   * @param identifier - The availability identifier.
   * @returns Promise<AvailabilityConfig>
   * */
  async getAvailabilityConfig(identifier: string): Promise<AvailabilityConfig> {
    const achoClient: AchoClient = new AchoClient(this.achoClientOpt);
    const reqOptions: RequestOptions = {
      method: 'get',
      path: `/service/event-scheduling/availability/configs/${identifier}`,
      headers: {}
    };

    const response = await achoClient.request(reqOptions);
    return response;
  }

  /**
   * Delete availability config.
   * @param identifier - The availability identifier.
   * @returns Promise<void>
   * */
  async deleteAvailabilityConfig(identifier: string): Promise<void> {
    const achoClient: AchoClient = new AchoClient(this.achoClientOpt);
    const reqOptions: RequestOptions = {
      method: 'delete',
      path: `/service/event-scheduling/availability/configs/${identifier}`,
      headers: {}
    };

    const response = await achoClient.request(reqOptions);
    return response;
  }

  /**
   * Get monthly availability.
   * @param identifier - The availability identifier.
   * @param targetMonth - The target month.
   * @param timezone - The timezone.
   * @param minDurationInMinute - The minimum duration in minute.
   * @returns Promise<string[]>
   * */
  async getMonthlyAvailability(
    identifier: string,
    targetMonth: string,
    timezone: string,
    minDurationInMinute: number | null = null
  ): Promise<string[]> {
    const achoClient: AchoClient = new AchoClient(this.achoClientOpt);
    const reqOptions: RequestOptions = {
      method: 'get',
      path: `/service/event-scheduling/availability/${identifier}/monthly`,
      headers: {},
      params: {
        target_month: targetMonth,
        ...(minDurationInMinute && { min_duration_in_minute: minDurationInMinute }),
        timezone
      }
    };

    const response = await achoClient.request(reqOptions);
    return response;
  }

  /**
   * Get daily availability.
   * @param identifier - The availability identifier.
   * @param date - The date.
   * @param timezone - The timezone.
   * @param minDurationInMinute - The minimum duration in minute.
   * @returns Promise<string[]>
   * */
  async getDailyAvailability(
    identifier: string,
    date: string,
    timezone: string,
    minDurationInMinute: number | null = null
  ): Promise<string[]> {
    const achoClient: AchoClient = new AchoClient(this.achoClientOpt);
    const reqOptions: RequestOptions = {
      method: 'get',
      path: `/service/event-scheduling/availability/${identifier}/daily`,
      headers: {},
      params: {
        date,
        ...(minDurationInMinute && { min_duration_in_minute: minDurationInMinute }),
        timezone
      }
    };

    const response = await achoClient.request(reqOptions);
    return response;
  }

  /**
   * Add an event.
   * @param params - The event parameters.
   * @returns Promise<Event>
   */
  async addEvent(params: Event): Promise<Event> {
    const achoClient: AchoClient = new AchoClient(this.achoClientOpt);
    const reqOptions: RequestOptions = {
      method: 'post',
      path: '/service/event-scheduling/events',
      headers: {},
      payload: params
    };

    const response = await achoClient.request(reqOptions);
    return response;
  }

  /**
   * List events by identifier.
   * @param identifier - The event identifier.
   * @returns Promise<Event[]>
   */
  async listEvents(identifier: string): Promise<Event[]> {
    const achoClient: AchoClient = new AchoClient(this.achoClientOpt);
    const reqOptions: RequestOptions = {
      method: 'post',
      path: '/service/event-scheduling/events/list',
      headers: {},
      params: {
        filterOptions: {
          type: 'logical',
          operator: 'and',
          operands: [
            {
              type: 'comparison',
              operator: 'stringEqualTo',
              leftOperand: 'identifier',
              rightOperand: identifier
            }
          ]
        },
        sortOptions: []
      }
    };

    const response = await achoClient.request(reqOptions);
    return response;
  }

  /**
   * Delete an event by identifier.
   * @param eventId - The event identifier.
   * @returns Promise<void>
   */
  async deleteEvent(eventId: string): Promise<void> {
    const achoClient: AchoClient = new AchoClient(this.achoClientOpt);
    const reqOptions: RequestOptions = {
      method: 'delete',
      path: `/service/event-scheduling/events/${eventId}`,
      headers: {}
    };

    const response = await achoClient.request(reqOptions);
    return response;
  }

  /**
   * Set vacation config.
   * @param params - The vacation config parameters.
   * @returns Promise<VacationConfig>
   */
  async setVacationConfig(params: VacationConfig): Promise<VacationConfig> {
    const achoClient: AchoClient = new AchoClient(this.achoClientOpt);
    const reqOptions: RequestOptions = {
      method: 'post',
      path: '/service/event-scheduling/vacation/configs',
      headers: {},
      payload: params
    };

    const response = await achoClient.request(reqOptions);
    return response;
  }

  /**
   * Get vacation config by identifier.
   * @param identifier - The vacation config identifier.
   * @returns Promise<VacationConfig>
   */
  async getVacationConfig(identifier: string): Promise<VacationConfig> {
    const achoClient: AchoClient = new AchoClient(this.achoClientOpt);
    const reqOptions: RequestOptions = {
      method: 'get',
      path: `/service/event-scheduling/vacation/configs/${identifier}`,
      headers: {}
    };

    const response = await achoClient.request(reqOptions);
    return response;
  }

  /**
   * Delete vacation config by identifier.
   * @param identifier - The vacation config identifier.
   * @returns Promise<void>
   */
  async deleteVacationConfig(identifier: string): Promise<void> {
    const achoClient: AchoClient = new AchoClient(this.achoClientOpt);
    const reqOptions: RequestOptions = {
      method: 'delete',
      path: `/service/event-scheduling/vacation/configs/${identifier}`,
      headers: {}
    };

    const response = await achoClient.request(reqOptions);
    return response;
  }
}

export {
  EventSchedulingService,
  EventTemplate,
  TimeSlot,
  AvailabilityDay,
  AvailabilityConfig,
  EventPlaceholders,
  Event,
  Vacation,
  VacationConfig
};
