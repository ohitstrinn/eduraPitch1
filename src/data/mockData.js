// Mock data for founder dashboard — replaced by Supabase in production

export const MOCK_SIGNUPS = [
  { id: 1, name: "Alex Thompson", email: "alex.t@unh.edu", school: "unh", major: "stem", createdAt: "2025-06-20T14:23:00Z", status: "active" },
  { id: 2, name: "Jordan Rivera", email: "jrivera@snhu.edu", school: "snhu", major: "business", createdAt: "2025-06-21T09:11:00Z", status: "active" },
  { id: 3, name: "Sam Nguyen", email: "sam.n@mccnh.edu", school: "mcc", major: "stem", createdAt: "2025-06-21T16:45:00Z", status: "active" },
  { id: 4, name: "Maria Santos", email: "msantos@nashuacc.edu", school: "ncc", major: "health", createdAt: "2025-06-22T11:30:00Z", status: "active" },
  { id: 5, name: "Chris Lee", email: "c.lee@unh.edu", school: "unh", major: "humanities", createdAt: "2025-06-22T13:15:00Z", status: "active" },
  { id: 6, name: "Taylor Brown", email: "tbrown@snhu.edu", school: "snhu", major: "education", createdAt: "2025-06-23T08:00:00Z", status: "active" },
  { id: 7, name: "Morgan Chen", email: "mchen@mccnh.edu", school: "mcc", major: "arts", createdAt: "2025-06-23T15:22:00Z", status: "active" },
  { id: 8, name: "Riley Park", email: "rpark@nashuacc.edu", school: "ncc", major: "criminal_justice", createdAt: "2025-06-24T10:10:00Z", status: "active" },
  { id: 9, name: "Casey Martinez", email: "caseym@unh.edu", school: "unh", major: "stem", createdAt: "2025-06-25T12:00:00Z", status: "active" },
  { id: 10, name: "Drew Wilson", email: "dwilson@snhu.edu", school: "snhu", major: "undeclared", createdAt: "2025-06-26T09:45:00Z", status: "active" },
  { id: 11, name: "Jamie Okafor", email: "jokafor@mccnh.edu", school: "mcc", major: "business", createdAt: "2025-06-27T14:00:00Z", status: "active" },
  { id: 12, name: "Avery Quinn", email: "aquinn@nashuacc.edu", school: "ncc", major: "health", createdAt: "2025-06-28T16:30:00Z", status: "active" },
];

export const MOCK_TESTING_INTEREST = [
  { id: 1, email: "prospective1@gmail.com", school: "unh", major: "stem", interest: "very_interested", note: "Looking for help with Organic Chem", createdAt: "2025-06-20T10:00:00Z" },
  { id: 2, email: "student2@yahoo.com", school: "snhu", major: "business", interest: "interested", note: "Online student, need flexible tools", createdAt: "2025-06-21T11:00:00Z" },
  { id: 3, email: "local3@hotmail.com", school: "mcc", major: "health", interest: "very_interested", note: "Nursing program, very busy schedule", createdAt: "2025-06-22T09:00:00Z" },
  { id: 4, email: "nashua4@gmail.com", school: "ncc", major: "stem", interest: "curious", note: "Heard about it from a friend", createdAt: "2025-06-23T14:00:00Z" },
  { id: 5, email: "unh5@gmail.com", school: "unh", major: "humanities", interest: "interested", note: "English major, want writing help", createdAt: "2025-06-24T08:00:00Z" },
  { id: 6, email: "snhu6@outlook.com", school: "snhu", major: "education", interest: "very_interested", note: "Teaching degree, lots of reading", createdAt: "2025-06-25T13:00:00Z" },
  { id: 7, email: "mcc7@gmail.com", school: "mcc", major: "arts", interest: "skeptical", note: "Not sure AI can help with art", createdAt: "2025-06-26T15:00:00Z" },
  { id: 8, email: "ncc8@gmail.com", school: "ncc", major: "business", interest: "interested", note: "Accounting track, need practice problems", createdAt: "2025-06-27T10:00:00Z" },
  { id: 9, email: "unh9@unh.edu", school: "unh", major: "stem", interest: "very_interested", note: "Physics major, struggling with upper level courses", createdAt: "2025-06-28T09:00:00Z" },
  { id: 10, email: "snhu10@snhu.edu", school: "snhu", major: "other", interest: "curious", note: "Exploring options", createdAt: "2025-06-29T08:00:00Z" },
];

export function getStoredSignups() {
  try {
    const stored = localStorage.getItem("stemara_signups");
    const live = stored ? JSON.parse(stored) : [];
    return [...MOCK_SIGNUPS, ...live];
  } catch {
    return MOCK_SIGNUPS;
  }
}

export function getStoredTestingInterest() {
  try {
    const stored = localStorage.getItem("stemara_testing_interest");
    const live = stored ? JSON.parse(stored) : [];
    return [...MOCK_TESTING_INTEREST, ...live];
  } catch {
    return MOCK_TESTING_INTEREST;
  }
}

export function saveTestingInterest(entry) {
  try {
    const stored = localStorage.getItem("stemara_testing_interest");
    const existing = stored ? JSON.parse(stored) : [];
    existing.push({ ...entry, id: Date.now(), createdAt: new Date().toISOString() });
    localStorage.setItem("stemara_testing_interest", JSON.stringify(existing));
    return true;
  } catch {
    return false;
  }
}

export function saveSignup(entry) {
  try {
    const stored = localStorage.getItem("stemara_signups");
    const existing = stored ? JSON.parse(stored) : [];
    existing.push({ ...entry, id: Date.now(), createdAt: new Date().toISOString(), status: "active" });
    localStorage.setItem("stemara_signups", JSON.stringify(existing));
    return true;
  } catch {
    return false;
  }
}
