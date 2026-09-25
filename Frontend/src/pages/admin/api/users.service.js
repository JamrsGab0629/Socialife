// users.service.js — mocked network layer for the Users view.
const MOCK_USERS = [
  { id: 1, name: "Maria Santos", handle: "@mariasantos", email: "maria.santos@gmail.com", joined: "May 29, 2025", status: "active" },
  { id: 2, name: "John Dela Cruz", handle: "@johndelacruz", email: "john.d@gmail.com", joined: "May 29, 2025", status: "active" },
  { id: 3, name: "Alexa Rivera", handle: "@alexarivera", email: "alexa.rivera@gmail.com", joined: "May 29, 2025", status: "active" },
  { id: 4, name: "Mark Reyes", handle: "@markreyes", email: "mark.reyes@gmail.com", joined: "May 28, 2025", status: "banned" },
  { id: 5, name: "Diane Lopez", handle: "@dianelopez", email: "diane.lopez@gmail.com", joined: "May 27, 2025", status: "active" },
  { id: 6, name: "Carlo Villanueva", handle: "@carlov", email: "carlo.v@gmail.com", joined: "May 26, 2025", status: "active" },
  { id: 7, name: "Bea Fernandez", handle: "@beaf", email: "bea.fernandez@gmail.com", joined: "May 25, 2025", status: "banned" },
  { id: 8, name: "Kevin Ramos", handle: "@kevinr", email: "kevin.ramos@gmail.com", joined: "May 24, 2025", status: "active" },
  { id: 9, name: "Nicole Cruz", handle: "@nicolecruz", email: "nicole.cruz@gmail.com", joined: "May 23, 2025", status: "active" },
  { id: 10, name: "Paolo Gutierrez", handle: "@paologutierrez", email: "paolo.gutierrez@gmail.com", joined: "May 22, 2025", status: "active" },
];

export function fetch_users() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(MOCK_USERS)), 400);
  });
}

export function set_user_status(id, status) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = MOCK_USERS.find((u) => u.id === id);
      if (!user) return reject(new Error("User not found"));
      user.status = status;
      resolve(structuredClone(user));
    }, 300);
  });
}
