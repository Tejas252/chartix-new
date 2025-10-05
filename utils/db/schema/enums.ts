import { pgEnum } from 'drizzle-orm/pg-core';

// Role enum
export const roleEnum = pgEnum('role', ['OWNER', 'ADMIN', 'EDITOR', 'VIEWER']);

// InviteStatus enum
export const inviteStatusEnum = pgEnum('invite_status', ['PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED']);

// Visibility enum
export const visibilityEnum = pgEnum('visibility', ['PRIVATE', 'TEAM', 'PUBLIC', 'LINK']);

// MessageRole enum
export const messageRoleEnum = pgEnum('message_role', ['USER', 'ASSISTANT', 'SYSTEM', 'TOOL']);

// StepType enum
export const stepTypeEnum = pgEnum('step_type', [
  'UPLOAD',
  'PARSE',
  'PROFILING',
  'CLEANING',
  'COLUMN_DETECTION',
  'SUMMARIZATION',
  'CHART_RECOMMENDATION',
  'TRANSFORM_GENERATION',
  'CHART_CONFIG_GENERATION',
  'RENDERING',
  'ERROR'
]);

// StepStatus enum
export const stepStatusEnum = pgEnum('step_status', ['PENDING', 'RUNNING', 'SUCCEEDED', 'FAILED']);

// FileKind enum
export const fileKindEnum = pgEnum('file_kind', ['CSV', 'XLSX']);

// ChartLibrary enum
export const chartLibraryEnum = pgEnum('chart_library', ['ECHARTS', 'RECHARTS', 'CHARTJS', 'VEGA']);