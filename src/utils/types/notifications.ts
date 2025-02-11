export enum NotificationSeverity {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}

export interface NotificationMessage {
  text: string;
  severity: NotificationSeverity;
  copyValue?: string;
  duration?: number; // u milisekundama
}

export interface GroupedNotification extends NotificationMessage {
  count: number;
}
