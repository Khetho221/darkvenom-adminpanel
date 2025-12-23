// ===== ADMIN CONFIG =====

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

export const ROLE_PERMS = {
  OWNER: {
    toggleApp: true,
    manageMembers: true
  },
  VIP: {
    toggleApp: true,
    manageMembers: true
  }
};
