// analytics.service.js — mocked network layer for the Analytics view.
const MOCK_USER_GROWTH = [
  { label: "May 1", value: 1200 },
  { label: "May 8", value: 1850 },
  { label: "May 15", value: 2100 },
  { label: "May 22", value: 2600 },
  { label: "May 29", value: 3400 },
];

const MOCK_ACTIVE_USERS = [
  { label: "Mon", value: 420 },
  { label: "Tue", value: 610 },
  { label: "Wed", value: 690 },
  { label: "Thu", value: 540 },
  { label: "Fri", value: 500 },
  { label: "Sat", value: 320 },
  { label: "Sun", value: 260 },
];

export function fetch_analytics() {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          user_growth: structuredClone(MOCK_USER_GROWTH),
          active_users: structuredClone(MOCK_ACTIVE_USERS),
        }),
      400
    );
  });
}
