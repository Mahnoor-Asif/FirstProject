// Simple in-memory storage for demo purposes
// In a real app, this would use AsyncStorage or a database

let jobHistory: any[] = [
  {
    id: 1,
    service: 'Plumbing',
    subcategory: 'Pipe Repair',
    date: '2025-01-10',
    provider: 'Ahmad Ali',
    amount: 800,
    status: 'completed',
    rating: 5,
    review: 'Excellent work, very professional',
  },
  {
    id: 2,
    service: 'House Cleaning',
    subcategory: 'Deep Cleaning',
    date: '2025-01-08',
    provider: 'Sara Khan',
    amount: 1200,
    status: 'completed',
    rating: 4,
    review: 'Good service, arrived on time',
  },
];

export const addJobToHistory = (job: any) => {
  jobHistory.unshift(job);
};

export const getJobHistory = () => {
  return [...jobHistory];
};

export const clearJobHistory = () => {
  jobHistory = [];
};