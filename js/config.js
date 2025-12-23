// ===== ADMIN & ROLE CONFIG =====

export const OWNER = "DARKVENOM";

export const ADMINS = [
  {
    user: "DARKVENOM",
    pass: "DARKVENOM-AGENT042",
    role: "OWNER"
  },
  {
    user: "PLAYBOYRSA",
    pass: "RSA123",
    role: "VIP"
  }
];

// Role permissions
export const ROLE_PERMS = {
  OWNER: {
    canToggleApp: true,
    canManageAdmins: true,
    canManageMembers: true
  },
  VIP: {
    canToggleApp: true,
    canManageAdmins: false,
    canManageMembers: true
  }
};
