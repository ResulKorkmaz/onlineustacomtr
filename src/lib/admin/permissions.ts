// Admin Permission System
// Role-based access control (RBAC)

export type AdminRole = 'super_admin' | 'admin' | 'editor';

export interface AdminPermissions {
  // User Management
  canViewUsers: boolean;
  canEditUsers: boolean;
  canDeleteUsers: boolean;
  canBanUsers: boolean;
  
  // Job Management
  canViewJobs: boolean;
  canEditJobs: boolean;
  canDeleteJobs: boolean;
  canApproveJobs: boolean;
  
  // Bid Management
  canViewBids: boolean;
  canEditBids: boolean;
  canDeleteBids: boolean;
  
  // Admin Management
  canViewAdmins: boolean;
  canCreateAdmins: boolean;
  canEditAdmins: boolean;
  canDeleteAdmins: boolean;
  
  // Settings
  canViewSettings: boolean;
  canEditSettings: boolean;
  
  // Logs
  canViewLogs: boolean;
  canExportData: boolean;
}

// Permission matrix based on roles
export const rolePermissions: Record<AdminRole, AdminPermissions> = {
  super_admin: {
    // Super Admin: Full access to everything
    canViewUsers: true,
    canEditUsers: true,
    canDeleteUsers: true,
    canBanUsers: true,
    
    canViewJobs: true,
    canEditJobs: true,
    canDeleteJobs: true,
    canApproveJobs: true,
    
    canViewBids: true,
    canEditBids: true,
    canDeleteBids: true,
    
    canViewAdmins: true,
    canCreateAdmins: true, // Can create admins and editors
    canEditAdmins: true,
    canDeleteAdmins: true,
    
    canViewSettings: true,
    canEditSettings: true,
    
    canViewLogs: true,
    canExportData: true,
  },
  
  admin: {
    // Admin: Most access, cannot manage super admins
    canViewUsers: true,
    canEditUsers: true,
    canDeleteUsers: true,
    canBanUsers: true,
    
    canViewJobs: true,
    canEditJobs: true,
    canDeleteJobs: true,
    canApproveJobs: true,
    
    canViewBids: true,
    canEditBids: true,
    canDeleteBids: true,
    
    canViewAdmins: true,
    canCreateAdmins: true, // Can create editors only
    canEditAdmins: false, // Cannot edit other admins
    canDeleteAdmins: false, // Cannot delete other admins
    
    canViewSettings: true,
    canEditSettings: false, // Cannot edit platform settings
    
    canViewLogs: true,
    canExportData: true,
  },
  
  editor: {
    // Editor: Limited access, content moderation only
    canViewUsers: true,
    canEditUsers: false,
    canDeleteUsers: false,
    canBanUsers: false,
    
    canViewJobs: true,
    canEditJobs: true, // Can moderate job content
    canDeleteJobs: false,
    canApproveJobs: true, // Can approve/reject jobs
    
    canViewBids: true,
    canEditBids: false,
    canDeleteBids: false,
    
    canViewAdmins: false,
    canCreateAdmins: false,
    canEditAdmins: false,
    canDeleteAdmins: false,
    
    canViewSettings: false,
    canEditSettings: false,
    
    canViewLogs: false,
    canExportData: false,
  },
};

// Get permissions for a specific role
export function getPermissions(role: AdminRole | null): AdminPermissions {
  if (!role) {
    // No admin role = no permissions
    return Object.keys(rolePermissions.editor).reduce((acc, key) => {
      acc[key as keyof AdminPermissions] = false;
      return acc;
    }, {} as AdminPermissions);
  }
  
  return rolePermissions[role];
}

// Check if user has a specific permission
export function hasPermission(
  role: AdminRole | null,
  permission: keyof AdminPermissions
): boolean {
  if (!role) return false;
  return rolePermissions[role][permission];
}

// Check if user can access admin panel
export function canAccessAdminPanel(role: AdminRole | null): boolean {
  return role !== null;
}

// Role hierarchy check (is roleA >= roleB?)
export function isRoleHigherOrEqual(roleA: AdminRole, roleB: AdminRole): boolean {
  const hierarchy: Record<AdminRole, number> = {
    super_admin: 3,
    admin: 2,
    editor: 1,
  };
  
  return hierarchy[roleA] >= hierarchy[roleB];
}

// Can user manage another user based on their roles?
export function canManageUser(
  adminRole: AdminRole | null,
  targetRole: AdminRole | null,
  isSuperAdmin: boolean
): boolean {
  // Non-admins cannot manage anyone
  if (!adminRole) return false;
  
  // Super admins cannot be managed by anyone (except themselves)
  if (isSuperAdmin) return false;
  
  // Super admin can manage everyone
  if (adminRole === 'super_admin') return true;
  
  // Admin can manage editors and regular users (not other admins)
  if (adminRole === 'admin') {
    return !targetRole || targetRole === 'editor';
  }
  
  // Editors cannot manage anyone
  return false;
}

