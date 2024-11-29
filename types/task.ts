export enum TaskStatus {
  PENDING = 'pending',
  DONE = 'done'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export interface ITask {
  id: string;
  title: string;
  description: string;
  datetime: string | Date;
  status: TaskStatus
  priority: Priority
}