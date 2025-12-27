/**
 * Shared types from Prisma for consistency across the application
 * 
 * These types are re-exported from the generated Prisma client
 * to ensure type safety between frontend and backend.
 * 
 * Usage:
 * ```typescript
 * import type { 
 *   Organization,
 *   OrganizationCreateInput,
 *   OrganizationUpdateInput 
 * } from "~/types/prisma";
 * ```
 */

import type { Prisma } from "@/generated/prisma/client";

// ============================================================================
// MODEL TYPES
// ============================================================================

export type { 
  Organization,
  Workspace,
  User,
  Account,
  OrganizationUser,
  WorkspaceUser,
  Department,
  Staff,
  ShiftAssignment,
  Device,
  Attendance,
  LeaveRequest,
  Shift,
  Appraisal,
  ReportTemplate,
  Report,
  Project,
  ProjectMember,
  Milestone,
  Document,
  Task,
  TaskAssignee,
  TaskComment,
  TimeLog,
  TaskChecklist,
  TeamCalendar,
  Notification,
  Session,
  VerificationToken,
  OrganizationSettings,
  NotificationPreference,
  TwoFactorBackupCode,
  LoginAttempt,
  AuditLog,
  IPWhitelistEntry,
  UserInvitation,
  Permission,
  Role,
  RolePermission,
  UserRoleAssignment,
  Subscription,
  Plan,
  Invoice,
  PaymentMethod,
  BillingAddress,
  Integration,
  IntegrationSync,
} from "@/generated/prisma/client";

// ============================================================================
// ENUM TYPES
// ============================================================================

export type {
  OrganizationRole,
  WorkspaceRole,
  ProjectRole,
  ProjectStatus,
  ProjectPriority,
  MilestoneStatus,
  DocumentVisibility,
  CalendarType,
  EmploymentType,
  DeviceType,
  AttendanceStatus,
  LeaveType,
  LeaveStatus,
  AppraisalStatus,
  ReportStatus,
  TaskStatus,
  TaskPriority,
  NotificationType,
  SubscriptionStatus,
  BillingCycle,
  InvoiceStatus,
  PaymentProvider,
  IntegrationProvider,
  IntegrationStatus,
  LoginStatus,
  AuditAction,
  InvitationStatus,
} from "@/generated/prisma/client";

// ============================================================================
// ORGANIZATION INPUT TYPES
// ============================================================================

export type OrganizationCreateInput = Prisma.OrganizationCreateInput;
export type OrganizationUpdateInput = Prisma.OrganizationUpdateInput;
export type OrganizationWhereInput = Prisma.OrganizationWhereInput;
export type OrganizationWhereUniqueInput = Prisma.OrganizationWhereUniqueInput;
export type OrganizationInclude = Prisma.OrganizationInclude;
export type OrganizationOrderByWithRelationInput = Prisma.OrganizationOrderByWithRelationInput;

// ============================================================================
// WORKSPACE INPUT TYPES
// ============================================================================

export type WorkspaceCreateInput = Prisma.WorkspaceCreateInput;
export type WorkspaceUpdateInput = Prisma.WorkspaceUpdateInput;
export type WorkspaceWhereInput = Prisma.WorkspaceWhereInput;
export type WorkspaceWhereUniqueInput = Prisma.WorkspaceWhereUniqueInput;
export type WorkspaceInclude = Prisma.WorkspaceInclude;
export type WorkspaceOrderByWithRelationInput = Prisma.WorkspaceOrderByWithRelationInput;

// ============================================================================
// USER INPUT TYPES
// ============================================================================

export type UserCreateInput = Prisma.UserCreateInput;
export type UserUpdateInput = Prisma.UserUpdateInput;
export type UserWhereInput = Prisma.UserWhereInput;
export type UserWhereUniqueInput = Prisma.UserWhereUniqueInput;
export type UserInclude = Prisma.UserInclude;
export type UserOrderByWithRelationInput = Prisma.UserOrderByWithRelationInput;

// ============================================================================
// DEPARTMENT INPUT TYPES
// ============================================================================

export type DepartmentCreateInput = Prisma.DepartmentCreateInput;
export type DepartmentUpdateInput = Prisma.DepartmentUpdateInput;
export type DepartmentWhereInput = Prisma.DepartmentWhereInput;
export type DepartmentWhereUniqueInput = Prisma.DepartmentWhereUniqueInput;
export type DepartmentInclude = Prisma.DepartmentInclude;
export type DepartmentOrderByWithRelationInput = Prisma.DepartmentOrderByWithRelationInput;

// ============================================================================
// STAFF INPUT TYPES
// ============================================================================

export type StaffCreateInput = Prisma.StaffCreateInput;
export type StaffUpdateInput = Prisma.StaffUpdateInput;
export type StaffWhereInput = Prisma.StaffWhereInput;
export type StaffWhereUniqueInput = Prisma.StaffWhereUniqueInput;
export type StaffInclude = Prisma.StaffInclude;
export type StaffOrderByWithRelationInput = Prisma.StaffOrderByWithRelationInput;

// ============================================================================
// ATTENDANCE INPUT TYPES
// ============================================================================

export type AttendanceCreateInput = Prisma.AttendanceCreateInput;
export type AttendanceUpdateInput = Prisma.AttendanceUpdateInput;
export type AttendanceWhereInput = Prisma.AttendanceWhereInput;
export type AttendanceWhereUniqueInput = Prisma.AttendanceWhereUniqueInput;
export type AttendanceInclude = Prisma.AttendanceInclude;
export type AttendanceOrderByWithRelationInput = Prisma.AttendanceOrderByWithRelationInput;

// ============================================================================
// LEAVE REQUEST INPUT TYPES
// ============================================================================

export type LeaveRequestCreateInput = Prisma.LeaveRequestCreateInput;
export type LeaveRequestUpdateInput = Prisma.LeaveRequestUpdateInput;
export type LeaveRequestWhereInput = Prisma.LeaveRequestWhereInput;
export type LeaveRequestWhereUniqueInput = Prisma.LeaveRequestWhereUniqueInput;
export type LeaveRequestInclude = Prisma.LeaveRequestInclude;
export type LeaveRequestOrderByWithRelationInput = Prisma.LeaveRequestOrderByWithRelationInput;

// ============================================================================
// PROJECT INPUT TYPES
// ============================================================================

export type ProjectCreateInput = Prisma.ProjectCreateInput;
export type ProjectUpdateInput = Prisma.ProjectUpdateInput;
export type ProjectWhereInput = Prisma.ProjectWhereInput;
export type ProjectWhereUniqueInput = Prisma.ProjectWhereUniqueInput;
export type ProjectInclude = Prisma.ProjectInclude;
export type ProjectOrderByWithRelationInput = Prisma.ProjectOrderByWithRelationInput;

// ============================================================================
// TASK INPUT TYPES
// ============================================================================

export type TaskCreateInput = Prisma.TaskCreateInput;
export type TaskUpdateInput = Prisma.TaskUpdateInput;
export type TaskWhereInput = Prisma.TaskWhereInput;
export type TaskWhereUniqueInput = Prisma.TaskWhereUniqueInput;
export type TaskInclude = Prisma.TaskInclude;
export type TaskOrderByWithRelationInput = Prisma.TaskOrderByWithRelationInput;

// ============================================================================
// DOCUMENT INPUT TYPES
// ============================================================================

export type DocumentCreateInput = Prisma.DocumentCreateInput;
export type DocumentUpdateInput = Prisma.DocumentUpdateInput;
export type DocumentWhereInput = Prisma.DocumentWhereInput;
export type DocumentWhereUniqueInput = Prisma.DocumentWhereUniqueInput;
export type DocumentInclude = Prisma.DocumentInclude;
export type DocumentOrderByWithRelationInput = Prisma.DocumentOrderByWithRelationInput;

// ============================================================================
// REPORT INPUT TYPES
// ============================================================================

export type ReportCreateInput = Prisma.ReportCreateInput;
export type ReportUpdateInput = Prisma.ReportUpdateInput;
export type ReportWhereInput = Prisma.ReportWhereInput;
export type ReportWhereUniqueInput = Prisma.ReportWhereUniqueInput;
export type ReportInclude = Prisma.ReportInclude;
export type ReportOrderByWithRelationInput = Prisma.ReportOrderByWithRelationInput;

// ============================================================================
// REPORT TEMPLATE INPUT TYPES
// ============================================================================

export type ReportTemplateCreateInput = Prisma.ReportTemplateCreateInput;
export type ReportTemplateUpdateInput = Prisma.ReportTemplateUpdateInput;
export type ReportTemplateWhereInput = Prisma.ReportTemplateWhereInput;
export type ReportTemplateWhereUniqueInput = Prisma.ReportTemplateWhereUniqueInput;
export type ReportTemplateInclude = Prisma.ReportTemplateInclude;
export type ReportTemplateOrderByWithRelationInput = Prisma.ReportTemplateOrderByWithRelationInput;

// ============================================================================
// NOTIFICATION INPUT TYPES
// ============================================================================

export type NotificationCreateInput = Prisma.NotificationCreateInput;
export type NotificationUpdateInput = Prisma.NotificationUpdateInput;
export type NotificationWhereInput = Prisma.NotificationWhereInput;
export type NotificationWhereUniqueInput = Prisma.NotificationWhereUniqueInput;
export type NotificationInclude = Prisma.NotificationInclude;
export type NotificationOrderByWithRelationInput = Prisma.NotificationOrderByWithRelationInput;

// ============================================================================
// ORGANIZATION SETTINGS INPUT TYPES
// ============================================================================

export type OrganizationSettingsCreateInput = Prisma.OrganizationSettingsCreateInput;
export type OrganizationSettingsUpdateInput = Prisma.OrganizationSettingsUpdateInput;
export type OrganizationSettingsWhereInput = Prisma.OrganizationSettingsWhereInput;
export type OrganizationSettingsWhereUniqueInput = Prisma.OrganizationSettingsWhereUniqueInput;
export type OrganizationSettingsInclude = Prisma.OrganizationSettingsInclude;
export type OrganizationSettingsOrderByWithRelationInput = Prisma.OrganizationSettingsOrderByWithRelationInput;

// ============================================================================
// USER INVITATION INPUT TYPES
// ============================================================================

export type UserInvitationCreateInput = Prisma.UserInvitationCreateInput;
export type UserInvitationUpdateInput = Prisma.UserInvitationUpdateInput;
export type UserInvitationWhereInput = Prisma.UserInvitationWhereInput;
export type UserInvitationWhereUniqueInput = Prisma.UserInvitationWhereUniqueInput;
export type UserInvitationInclude = Prisma.UserInvitationInclude;
export type UserInvitationOrderByWithRelationInput = Prisma.UserInvitationOrderByWithRelationInput;

// ============================================================================
// SHIFT INPUT TYPES
// ============================================================================

export type ShiftCreateInput = Prisma.ShiftCreateInput;
export type ShiftUpdateInput = Prisma.ShiftUpdateInput;
export type ShiftWhereInput = Prisma.ShiftWhereInput;
export type ShiftWhereUniqueInput = Prisma.ShiftWhereUniqueInput;
export type ShiftInclude = Prisma.ShiftInclude;
export type ShiftOrderByWithRelationInput = Prisma.ShiftOrderByWithRelationInput;

// ============================================================================
// DEVICE INPUT TYPES
// ============================================================================

export type DeviceCreateInput = Prisma.DeviceCreateInput;
export type DeviceUpdateInput = Prisma.DeviceUpdateInput;
export type DeviceWhereInput = Prisma.DeviceWhereInput;
export type DeviceWhereUniqueInput = Prisma.DeviceWhereUniqueInput;
export type DeviceInclude = Prisma.DeviceInclude;
export type DeviceOrderByWithRelationInput = Prisma.DeviceOrderByWithRelationInput;

// ============================================================================
// APPRAISAL INPUT TYPES
// ============================================================================

export type AppraisalCreateInput = Prisma.AppraisalCreateInput;
export type AppraisalUpdateInput = Prisma.AppraisalUpdateInput;
export type AppraisalWhereInput = Prisma.AppraisalWhereInput;
export type AppraisalWhereUniqueInput = Prisma.AppraisalWhereUniqueInput;
export type AppraisalInclude = Prisma.AppraisalInclude;
export type AppraisalOrderByWithRelationInput = Prisma.AppraisalOrderByWithRelationInput;

// ============================================================================
// TEAM CALENDAR INPUT TYPES
// ============================================================================

export type TeamCalendarCreateInput = Prisma.TeamCalendarCreateInput;
export type TeamCalendarUpdateInput = Prisma.TeamCalendarUpdateInput;
export type TeamCalendarWhereInput = Prisma.TeamCalendarWhereInput;
export type TeamCalendarWhereUniqueInput = Prisma.TeamCalendarWhereUniqueInput;
export type TeamCalendarInclude = Prisma.TeamCalendarInclude;
export type TeamCalendarOrderByWithRelationInput = Prisma.TeamCalendarOrderByWithRelationInput;

// ============================================================================
// MILESTONE INPUT TYPES
// ============================================================================

export type MilestoneCreateInput = Prisma.MilestoneCreateInput;
export type MilestoneUpdateInput = Prisma.MilestoneUpdateInput;
export type MilestoneWhereInput = Prisma.MilestoneWhereInput;
export type MilestoneWhereUniqueInput = Prisma.MilestoneWhereUniqueInput;
export type MilestoneInclude = Prisma.MilestoneInclude;
export type MilestoneOrderByWithRelationInput = Prisma.MilestoneOrderByWithRelationInput;

// ============================================================================
// TIME LOG INPUT TYPES
// ============================================================================

export type TimeLogCreateInput = Prisma.TimeLogCreateInput;
export type TimeLogUpdateInput = Prisma.TimeLogUpdateInput;
export type TimeLogWhereInput = Prisma.TimeLogWhereInput;
export type TimeLogWhereUniqueInput = Prisma.TimeLogWhereUniqueInput;
export type TimeLogInclude = Prisma.TimeLogInclude;
export type TimeLogOrderByWithRelationInput = Prisma.TimeLogOrderByWithRelationInput;

// ============================================================================
// TASK COMMENT INPUT TYPES
// ============================================================================

export type TaskCommentCreateInput = Prisma.TaskCommentCreateInput;
export type TaskCommentUpdateInput = Prisma.TaskCommentUpdateInput;
export type TaskCommentWhereInput = Prisma.TaskCommentWhereInput;
export type TaskCommentWhereUniqueInput = Prisma.TaskCommentWhereUniqueInput;
export type TaskCommentInclude = Prisma.TaskCommentInclude;
export type TaskCommentOrderByWithRelationInput = Prisma.TaskCommentOrderByWithRelationInput;

// ============================================================================
// TASK CHECKLIST INPUT TYPES
// ============================================================================

export type TaskChecklistCreateInput = Prisma.TaskChecklistCreateInput;
export type TaskChecklistUpdateInput = Prisma.TaskChecklistUpdateInput;
export type TaskChecklistWhereInput = Prisma.TaskChecklistWhereInput;
export type TaskChecklistWhereUniqueInput = Prisma.TaskChecklistWhereUniqueInput;
export type TaskChecklistInclude = Prisma.TaskChecklistInclude;
export type TaskChecklistOrderByWithRelationInput = Prisma.TaskChecklistOrderByWithRelationInput;

// ============================================================================
// PROJECT MEMBER INPUT TYPES
// ============================================================================

export type ProjectMemberCreateInput = Prisma.ProjectMemberCreateInput;
export type ProjectMemberUpdateInput = Prisma.ProjectMemberUpdateInput;
export type ProjectMemberWhereInput = Prisma.ProjectMemberWhereInput;
export type ProjectMemberWhereUniqueInput = Prisma.ProjectMemberWhereUniqueInput;
export type ProjectMemberInclude = Prisma.ProjectMemberInclude;
export type ProjectMemberOrderByWithRelationInput = Prisma.ProjectMemberOrderByWithRelationInput;

// ============================================================================
// TASK ASSIGNEE INPUT TYPES
// ============================================================================

export type TaskAssigneeCreateInput = Prisma.TaskAssigneeCreateInput;
export type TaskAssigneeUpdateInput = Prisma.TaskAssigneeUpdateInput;
export type TaskAssigneeWhereInput = Prisma.TaskAssigneeWhereInput;
export type TaskAssigneeWhereUniqueInput = Prisma.TaskAssigneeWhereUniqueInput;
export type TaskAssigneeInclude = Prisma.TaskAssigneeInclude;
export type TaskAssigneeOrderByWithRelationInput = Prisma.TaskAssigneeOrderByWithRelationInput;

// ============================================================================
// SHIFT ASSIGNMENT INPUT TYPES
// ============================================================================

export type ShiftAssignmentCreateInput = Prisma.ShiftAssignmentCreateInput;
export type ShiftAssignmentUpdateInput = Prisma.ShiftAssignmentUpdateInput;
export type ShiftAssignmentWhereInput = Prisma.ShiftAssignmentWhereInput;
export type ShiftAssignmentWhereUniqueInput = Prisma.ShiftAssignmentWhereUniqueInput;
export type ShiftAssignmentInclude = Prisma.ShiftAssignmentInclude;
export type ShiftAssignmentOrderByWithRelationInput = Prisma.ShiftAssignmentOrderByWithRelationInput;

// ============================================================================
// SUBSCRIPTION INPUT TYPES
// ============================================================================

export type SubscriptionCreateInput = Prisma.SubscriptionCreateInput;
export type SubscriptionUpdateInput = Prisma.SubscriptionUpdateInput;
export type SubscriptionWhereInput = Prisma.SubscriptionWhereInput;
export type SubscriptionWhereUniqueInput = Prisma.SubscriptionWhereUniqueInput;
export type SubscriptionInclude = Prisma.SubscriptionInclude;
export type SubscriptionOrderByWithRelationInput = Prisma.SubscriptionOrderByWithRelationInput;

// ============================================================================
// PLAN INPUT TYPES
// ============================================================================

export type PlanCreateInput = Prisma.PlanCreateInput;
export type PlanUpdateInput = Prisma.PlanUpdateInput;
export type PlanWhereInput = Prisma.PlanWhereInput;
export type PlanWhereUniqueInput = Prisma.PlanWhereUniqueInput;
export type PlanInclude = Prisma.PlanInclude;
export type PlanOrderByWithRelationInput = Prisma.PlanOrderByWithRelationInput;

// ============================================================================
// INVOICE INPUT TYPES
// ============================================================================

export type InvoiceCreateInput = Prisma.InvoiceCreateInput;
export type InvoiceUpdateInput = Prisma.InvoiceUpdateInput;
export type InvoiceWhereInput = Prisma.InvoiceWhereInput;
export type InvoiceWhereUniqueInput = Prisma.InvoiceWhereUniqueInput;
export type InvoiceInclude = Prisma.InvoiceInclude;
export type InvoiceOrderByWithRelationInput = Prisma.InvoiceOrderByWithRelationInput;

// ============================================================================
// PAYMENT METHOD INPUT TYPES
// ============================================================================

export type PaymentMethodCreateInput = Prisma.PaymentMethodCreateInput;
export type PaymentMethodUpdateInput = Prisma.PaymentMethodUpdateInput;
export type PaymentMethodWhereInput = Prisma.PaymentMethodWhereInput;
export type PaymentMethodWhereUniqueInput = Prisma.PaymentMethodWhereUniqueInput;
export type PaymentMethodInclude = Prisma.PaymentMethodInclude;
export type PaymentMethodOrderByWithRelationInput = Prisma.PaymentMethodOrderByWithRelationInput;

// ============================================================================
// BILLING ADDRESS INPUT TYPES
// ============================================================================

export type BillingAddressCreateInput = Prisma.BillingAddressCreateInput;
export type BillingAddressUpdateInput = Prisma.BillingAddressUpdateInput;
export type BillingAddressWhereInput = Prisma.BillingAddressWhereInput;
export type BillingAddressWhereUniqueInput = Prisma.BillingAddressWhereUniqueInput;
export type BillingAddressInclude = Prisma.BillingAddressInclude;
export type BillingAddressOrderByWithRelationInput = Prisma.BillingAddressOrderByWithRelationInput;

// ============================================================================
// INTEGRATION INPUT TYPES
// ============================================================================

export type IntegrationCreateInput = Prisma.IntegrationCreateInput;
export type IntegrationUpdateInput = Prisma.IntegrationUpdateInput;
export type IntegrationWhereInput = Prisma.IntegrationWhereInput;
export type IntegrationWhereUniqueInput = Prisma.IntegrationWhereUniqueInput;
export type IntegrationInclude = Prisma.IntegrationInclude;
export type IntegrationOrderByWithRelationInput = Prisma.IntegrationOrderByWithRelationInput;

// ============================================================================
// INTEGRATION SYNC INPUT TYPES
// ============================================================================

export type IntegrationSyncCreateInput = Prisma.IntegrationSyncCreateInput;
export type IntegrationSyncUpdateInput = Prisma.IntegrationSyncUpdateInput;
export type IntegrationSyncWhereInput = Prisma.IntegrationSyncWhereInput;
export type IntegrationSyncWhereUniqueInput = Prisma.IntegrationSyncWhereUniqueInput;
export type IntegrationSyncInclude = Prisma.IntegrationSyncInclude;
export type IntegrationSyncOrderByWithRelationInput = Prisma.IntegrationSyncOrderByWithRelationInput;

// ============================================================================
// ORGANIZATION USER INPUT TYPES
// ============================================================================

export type OrganizationUserCreateInput = Prisma.OrganizationUserCreateInput;
export type OrganizationUserUpdateInput = Prisma.OrganizationUserUpdateInput;
export type OrganizationUserWhereInput = Prisma.OrganizationUserWhereInput;
export type OrganizationUserWhereUniqueInput = Prisma.OrganizationUserWhereUniqueInput;
export type OrganizationUserInclude = Prisma.OrganizationUserInclude;
export type OrganizationUserOrderByWithRelationInput = Prisma.OrganizationUserOrderByWithRelationInput;

// ============================================================================
// WORKSPACE USER INPUT TYPES
// ============================================================================

export type WorkspaceUserCreateInput = Prisma.WorkspaceUserCreateInput;
export type WorkspaceUserUpdateInput = Prisma.WorkspaceUserUpdateInput;
export type WorkspaceUserWhereInput = Prisma.WorkspaceUserWhereInput;
export type WorkspaceUserWhereUniqueInput = Prisma.WorkspaceUserWhereUniqueInput;
export type WorkspaceUserInclude = Prisma.WorkspaceUserInclude;
export type WorkspaceUserOrderByWithRelationInput = Prisma.WorkspaceUserOrderByWithRelationInput;

// ============================================================================
// NOTIFICATION PREFERENCE INPUT TYPES
// ============================================================================

export type NotificationPreferenceCreateInput = Prisma.NotificationPreferenceCreateInput;
export type NotificationPreferenceUpdateInput = Prisma.NotificationPreferenceUpdateInput;
export type NotificationPreferenceWhereInput = Prisma.NotificationPreferenceWhereInput;
export type NotificationPreferenceWhereUniqueInput = Prisma.NotificationPreferenceWhereUniqueInput;
export type NotificationPreferenceInclude = Prisma.NotificationPreferenceInclude;
export type NotificationPreferenceOrderByWithRelationInput = Prisma.NotificationPreferenceOrderByWithRelationInput;

// ============================================================================
// ROLE & PERMISSION INPUT TYPES
// ============================================================================

export type RoleCreateInput = Prisma.RoleCreateInput;
export type RoleUpdateInput = Prisma.RoleUpdateInput;
export type RoleWhereInput = Prisma.RoleWhereInput;
export type RoleWhereUniqueInput = Prisma.RoleWhereUniqueInput;
export type RoleInclude = Prisma.RoleInclude;
export type RoleOrderByWithRelationInput = Prisma.RoleOrderByWithRelationInput;

export type PermissionCreateInput = Prisma.PermissionCreateInput;
export type PermissionUpdateInput = Prisma.PermissionUpdateInput;
export type PermissionWhereInput = Prisma.PermissionWhereInput;
export type PermissionWhereUniqueInput = Prisma.PermissionWhereUniqueInput;
export type PermissionInclude = Prisma.PermissionInclude;
export type PermissionOrderByWithRelationInput = Prisma.PermissionOrderByWithRelationInput;

export type RolePermissionCreateInput = Prisma.RolePermissionCreateInput;
export type RolePermissionUpdateInput = Prisma.RolePermissionUpdateInput;
export type RolePermissionWhereInput = Prisma.RolePermissionWhereInput;
export type RolePermissionWhereUniqueInput = Prisma.RolePermissionWhereUniqueInput;
export type RolePermissionInclude = Prisma.RolePermissionInclude;
export type RolePermissionOrderByWithRelationInput = Prisma.RolePermissionOrderByWithRelationInput;

export type UserRoleAssignmentCreateInput = Prisma.UserRoleAssignmentCreateInput;
export type UserRoleAssignmentUpdateInput = Prisma.UserRoleAssignmentUpdateInput;
export type UserRoleAssignmentWhereInput = Prisma.UserRoleAssignmentWhereInput;
export type UserRoleAssignmentWhereUniqueInput = Prisma.UserRoleAssignmentWhereUniqueInput;
export type UserRoleAssignmentInclude = Prisma.UserRoleAssignmentInclude;
export type UserRoleAssignmentOrderByWithRelationInput = Prisma.UserRoleAssignmentOrderByWithRelationInput;

// ============================================================================
// AUDIT & SECURITY INPUT TYPES
// ============================================================================

export type AuditLogCreateInput = Prisma.AuditLogCreateInput;
export type AuditLogUpdateInput = Prisma.AuditLogUpdateInput;
export type AuditLogWhereInput = Prisma.AuditLogWhereInput;
export type AuditLogWhereUniqueInput = Prisma.AuditLogWhereUniqueInput;
export type AuditLogInclude = Prisma.AuditLogInclude;
export type AuditLogOrderByWithRelationInput = Prisma.AuditLogOrderByWithRelationInput;

export type LoginAttemptCreateInput = Prisma.LoginAttemptCreateInput;
export type LoginAttemptUpdateInput = Prisma.LoginAttemptUpdateInput;
export type LoginAttemptWhereInput = Prisma.LoginAttemptWhereInput;
export type LoginAttemptWhereUniqueInput = Prisma.LoginAttemptWhereUniqueInput;
export type LoginAttemptInclude = Prisma.LoginAttemptInclude;
export type LoginAttemptOrderByWithRelationInput = Prisma.LoginAttemptOrderByWithRelationInput;

export type IPWhitelistEntryCreateInput = Prisma.IPWhitelistEntryCreateInput;
export type IPWhitelistEntryUpdateInput = Prisma.IPWhitelistEntryUpdateInput;
export type IPWhitelistEntryWhereInput = Prisma.IPWhitelistEntryWhereInput;
export type IPWhitelistEntryWhereUniqueInput = Prisma.IPWhitelistEntryWhereUniqueInput;
export type IPWhitelistEntryInclude = Prisma.IPWhitelistEntryInclude;
export type IPWhitelistEntryOrderByWithRelationInput = Prisma.IPWhitelistEntryOrderByWithRelationInput;

export type TwoFactorBackupCodeCreateInput = Prisma.TwoFactorBackupCodeCreateInput;
export type TwoFactorBackupCodeUpdateInput = Prisma.TwoFactorBackupCodeUpdateInput;
export type TwoFactorBackupCodeWhereInput = Prisma.TwoFactorBackupCodeWhereInput;
export type TwoFactorBackupCodeWhereUniqueInput = Prisma.TwoFactorBackupCodeWhereUniqueInput;
export type TwoFactorBackupCodeInclude = Prisma.TwoFactorBackupCodeInclude;
export type TwoFactorBackupCodeOrderByWithRelationInput = Prisma.TwoFactorBackupCodeOrderByWithRelationInput;
