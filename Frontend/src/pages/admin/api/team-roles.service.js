// team-roles.service.js — mocked network layer for the Team Roles view.
const MOCK_ADMINS = [
  { id: 1, name: "James Gabriel", email: "james.gabriel@socialife.app", role: "Super Admin", permissions: "Full access to all modules" },
  { id: 2, name: "Renee Ocampo", email: "renee.ocampo@socialife.app", role: "Content Moderator", permissions: "Posts, Reports" },
  { id: 3, name: "Miguel Torres", email: "miguel.torres@socialife.app", role: "User Support", permissions: "Users, Reports (view only)" },
  { id: 4, name: "Sofia Ramirez", email: "sofia.ramirez@socialife.app", role: "Analyst", permissions: "Analytics (view only)" },
];

export function fetch_admins() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(MOCK_ADMINS)), 400);
  });
}

export function add_admin(admin) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const record = { id: MOCK_ADMINS.length + 1, ...admin };
      MOCK_ADMINS.push(record);
      resolve(structuredClone(record));
    }, 300);
  });
}
