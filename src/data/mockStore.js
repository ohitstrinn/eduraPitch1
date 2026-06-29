const STORE_KEY = "stemara_store";

function getStore() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || {
      signups: [],
      testingInterest: [],
      chatLogs: [],
    };
  } catch {
    return { signups: [], testingInterest: [], chatLogs: [] };
  }
}

function saveStore(store) {
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

export function saveSignup(data) {
  const store = getStore();
  const entry = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    ...data,
  };
  store.signups.push(entry);
  saveStore(store);
  return entry;
}

export function saveTestingInterest(data) {
  const store = getStore();
  const entry = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    ...data,
  };
  store.testingInterest.push(entry);
  saveStore(store);
  return entry;
}

export function saveChatMessage(schoolId, role, message) {
  const store = getStore();
  store.chatLogs.push({
    id: Date.now(),
    schoolId,
    role,
    message,
    createdAt: new Date().toISOString(),
  });
  saveStore(store);
}

export function getSignups() {
  return getStore().signups;
}

export function getTestingInterest() {
  return getStore().testingInterest;
}

export function getChatLogs() {
  return getStore().chatLogs;
}

export function clearStore() {
  saveStore({ signups: [], testingInterest: [], chatLogs: [] });
}

export function seedDemoData() {
  const store = getStore();
  if (store.signups.length > 0) return;

  const demoSignups = [
    { name: "Alex Johnson", email: "alex@unh.edu", school: "unh", major: "STEM", role: "student" },
    { name: "Maria Garcia", email: "maria@snhu.edu", school: "snhu", major: "Business", role: "student" },
    { name: "Chris Lee", email: "chris@mcc.edu", school: "mcc", major: "Health", role: "student" },
    { name: "Taylor Brown", email: "taylor@ncc.edu", school: "ncc", major: "STEM", role: "student" },
    { name: "Sam Wilson", email: "sam@unh.edu", school: "unh", major: "Humanities", role: "student" },
  ];

  const demoInterest = [
    { name: "Jordan Park", email: "jordan@unh.edu", school: "unh", major: "Business", interest: "ready", notes: "Very excited about syllabus parsing" },
    { name: "Casey Morgan", email: "casey@snhu.edu", school: "snhu", major: "Health", interest: "curious", notes: "" },
    { name: "Riley Davis", email: "riley@mcc.edu", school: "mcc", major: "STEM", interest: "ready", notes: "First-gen student, needs this" },
    { name: "Drew Thompson", email: "drew@ncc.edu", school: "ncc", major: "Education", interest: "skeptical", notes: "Wants to see demo first" },
    { name: "Quinn Adams", email: "quinn@snhu.edu", school: "snhu", major: "STEM", interest: "ready", notes: "" },
    { name: "Avery Martinez", email: "avery@mcc.edu", school: "mcc", major: "Business", interest: "curious", notes: "Working full-time student" },
  ];

  demoSignups.forEach(s => saveSignup(s));
  demoInterest.forEach(i => saveTestingInterest(i));
}
