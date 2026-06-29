const KEYS = {
  USER: 'stemara_user',
  SCHOOL: 'stemara_school',
  SUBMISSIONS: 'stemara_submissions',
  SIGNUPS: 'stemara_signups',
  FOUNDER: 'stemara_founder_session',
};

const seed = () => {
  if (localStorage.getItem('stemara_seeded')) return;
  const mockSubmissions = [
    { id: 1001, name: 'Aiden Park', email: 'aiden.p@unh.edu', school: 'unh', major: 'stem', interest: 'very', note: 'Looking for something to replace my planner app', createdAt: '2025-09-15T10:22:00Z' },
    { id: 1002, name: 'Priya Sharma', email: 'priya.s@snhu.edu', school: 'snhu', major: 'business', interest: 'very', note: 'Balancing work + school is tough. Need this.', createdAt: '2025-09-16T14:05:00Z' },
    { id: 1003, name: 'Carlos Reyes', email: 'creyes@mccnh.edu', school: 'mcc', major: 'health', interest: 'somewhat', note: 'First gen student — would love any help', createdAt: '2025-09-17T08:40:00Z' },
    { id: 1004, name: 'Jordan Lee', email: 'jlee@nashuacc.edu', school: 'ncc', major: 'cs', interest: 'very', note: 'Current student in CompTech program', createdAt: '2025-09-17T11:15:00Z' },
    { id: 1005, name: 'Maya Thompson', email: 'maya.t@unh.edu', school: 'unh', major: 'humanities', interest: 'somewhat', note: 'Heard about this from a friend in Bio', createdAt: '2025-09-18T09:30:00Z' },
    { id: 1006, name: 'Derek Wu', email: 'derek.w@snhu.edu', school: 'snhu', major: 'cs', interest: 'very', note: 'Online IT student. Would be a huge help.', createdAt: '2025-09-18T16:00:00Z' },
    { id: 1007, name: 'Aaliyah Brown', email: 'aaliyah.b@mccnh.edu', school: 'mcc', major: 'education', interest: 'curious', note: '', createdAt: '2025-09-19T07:55:00Z' },
    { id: 1008, name: 'Liam Chen', email: 'liam.c@nashuacc.edu', school: 'ncc', major: 'business', interest: 'very', note: 'Need help organizing syllabus info', createdAt: '2025-09-19T12:20:00Z' },
    { id: 1009, name: 'Sofia Rodriguez', email: 'sofia.r@unh.edu', school: 'unh', major: 'stem', interest: 'very', note: 'Pre-med sophomore. Syllabi stress me out.', createdAt: '2025-09-20T10:00:00Z' },
    { id: 1010, name: 'Tyler James', email: 'tyler.j@snhu.edu', school: 'snhu', major: 'business', interest: 'somewhat', note: 'Working full time — any time-saver helps', createdAt: '2025-09-20T14:45:00Z' },
    { id: 1011, name: 'Naomi Patel', email: 'naomi.p@mccnh.edu', school: 'mcc', major: 'stem', interest: 'very', note: 'Transfer student to UNH next year, need to stay on track', createdAt: '2025-09-21T09:10:00Z' },
    { id: 1012, name: 'Brandon Kim', email: 'bkim@nashuacc.edu', school: 'ncc', major: 'health', interest: 'somewhat', note: '', createdAt: '2025-09-21T15:30:00Z' },
    { id: 1013, name: 'Emma Wilson', email: 'e.wilson@unh.edu', school: 'unh', major: 'stem', interest: 'very', note: 'Research lab work + classes. Need better organization.', createdAt: '2025-09-22T11:00:00Z' },
    { id: 1014, name: 'Marcus Davis', email: 'mdavis@snhu.edu', school: 'snhu', major: 'undeclared', interest: 'curious', note: 'Just signed up for first term', createdAt: '2025-09-22T13:25:00Z' },
    { id: 1015, name: 'Jaylen Foster', email: 'jfoster@mccnh.edu', school: 'mcc', major: 'humanities', interest: 'very', note: 'First gen, single parent. This app could change things.', createdAt: '2025-09-23T08:00:00Z' },
  ];
  const mockSignups = [
    { id: 2001, name: 'Aiden Park', email: 'aiden.p@unh.edu', school: 'unh', major: 'stem', createdAt: '2025-09-15T10:30:00Z' },
    { id: 2002, name: 'Priya Sharma', email: 'priya.s@snhu.edu', school: 'snhu', major: 'business', createdAt: '2025-09-16T14:10:00Z' },
    { id: 2003, name: 'Carlos Reyes', email: 'creyes@mccnh.edu', school: 'mcc', major: 'health', createdAt: '2025-09-17T08:50:00Z' },
    { id: 2004, name: 'Jordan Lee', email: 'jlee@nashuacc.edu', school: 'ncc', major: 'cs', createdAt: '2025-09-17T11:20:00Z' },
    { id: 2005, name: 'Maya Thompson', email: 'maya.t@unh.edu', school: 'unh', major: 'humanities', createdAt: '2025-09-18T09:35:00Z' },
    { id: 2006, name: 'Derek Wu', email: 'derek.w@snhu.edu', school: 'snhu', major: 'cs', createdAt: '2025-09-18T16:05:00Z' },
  ];
  localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify(mockSubmissions));
  localStorage.setItem(KEYS.SIGNUPS, JSON.stringify(mockSignups));
  localStorage.setItem('stemara_seeded', 'true');
};

export const storage = {
  init: seed,

  getUser: () => JSON.parse(localStorage.getItem(KEYS.USER) || 'null'),
  setUser: (user) => localStorage.setItem(KEYS.USER, JSON.stringify(user)),
  clearUser: () => localStorage.removeItem(KEYS.USER),

  getSchool: () => localStorage.getItem(KEYS.SCHOOL),
  setSchool: (id) => localStorage.setItem(KEYS.SCHOOL, id),
  clearSchool: () => localStorage.removeItem(KEYS.SCHOOL),

  getSubmissions: () => JSON.parse(localStorage.getItem(KEYS.SUBMISSIONS) || '[]'),
  addSubmission: (sub) => {
    const list = storage.getSubmissions();
    const updated = [...list, { ...sub, id: Date.now(), createdAt: new Date().toISOString() }];
    localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify(updated));
    return updated;
  },

  getSignups: () => JSON.parse(localStorage.getItem(KEYS.SIGNUPS) || '[]'),
  addSignup: (signup) => {
    const list = storage.getSignups();
    const updated = [...list, { ...signup, id: Date.now(), createdAt: new Date().toISOString() }];
    localStorage.setItem(KEYS.SIGNUPS, JSON.stringify(updated));
    return updated;
  },

  isFounderLoggedIn: () => !!localStorage.getItem(KEYS.FOUNDER),
  setFounderSession: () => localStorage.setItem(KEYS.FOUNDER, 'true'),
  clearFounderSession: () => localStorage.removeItem(KEYS.FOUNDER),
};
