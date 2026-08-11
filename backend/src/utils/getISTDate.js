export const getISTStartOfToday = () => {
  const now = new Date();

  // IST = UTC + 5:30
  const istOffset = 5.5 * 60 * 60 * 1000;

  // Convert current time to IST
  const istTime = new Date(now.getTime() + istOffset);

  // Set to 12:00 AM IST
  istTime.setHours(0, 0, 0, 0);

  // Convert back to UTC Date object
  return new Date(istTime.getTime() - istOffset);
};
