import { ActivityListDto } from '../abp-http/ut-api-js-services/model/ActivityListDto';
import { CalendarEvent } from 'angular-calendar/dist/esm/src';

export interface ActivityEvent extends CalendarEvent {
  id: string;

  activity: ActivityListDto;
}
