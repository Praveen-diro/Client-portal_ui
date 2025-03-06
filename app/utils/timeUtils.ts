/**
 * Formats a timestamp into a user-friendly relative time (e.g., "5 mins ago")
 * @param eptime Timestamp in milliseconds
 * @returns Formatted relative time string
 */
export const getUserTime = (eptime: number | null | undefined): string => {
  if (eptime === null || eptime === undefined) {
    return "";
  }

  let dateMDY = "";
  const date = new Date();
  const currentTime = date.getTime();
  const diff = currentTime - eptime;

  switch (true) {
    case 0 <= diff && diff < 60000: // Less than 1 minute
      const seconds = Math.floor(diff / 1000);
      dateMDY = `${seconds} ${seconds === 1 ? "Sec" : "Secs"} ago`;
      break;
    case 60000 <= diff && diff < 60000 * 2: // 1-2 minutes
      const oneMin = Math.floor(diff / 60000);
      dateMDY = `${oneMin} Min ago`;
      break;
    case 60000 * 2 <= diff && diff < 60000 * 60: // 2-60 minutes
      const mins = Math.floor(diff / 60000);
      dateMDY = `${mins} Mins ago`;
      break;
    case 60000 * 60 <= diff && diff < 60000 * 60 * 2: // 1-2 hours
      const oneHour = Math.floor(diff / (60000 * 60));
      dateMDY = `${oneHour} Hour ago`;
      break;
    case 60000 * 60 * 2 <= diff && diff < 60000 * 60 * 24: // 2-24 hours
      const hours = Math.floor(diff / (60000 * 60));
      dateMDY = `${hours} Hours ago`;
      break;
    case 60000 * 60 * 24 <= diff && diff < 60000 * 60 * 24 * 2: // 1-2 days
      const oneDay = Math.floor(diff / (60000 * 60 * 24));
      dateMDY = `${oneDay} Day ago`;
      break;
    case 60000 * 60 * 24 * 2 <= diff && diff < 60000 * 60 * 24 * 7: // 2-7 days
      const days = Math.floor(diff / (60000 * 60 * 24));
      dateMDY = `${days} Days ago`;
      break;
    case 60000 * 60 * 24 * 7 <= diff && diff < 60000 * 60 * 24 * 7 * 1.5: // 1-1.5 weeks
      const oneWeek = Math.floor(diff / (60000 * 60 * 24 * 7));
      dateMDY = `${oneWeek} Week ago`;
      break;
    case 60000 * 60 * 24 * 7 * 1.5 <= diff && diff < 60000 * 60 * 24 * 7 * 4: // 1.5-4 weeks
      const weeks = Math.floor(diff / (60000 * 60 * 24 * 7));
      dateMDY = `${weeks} Weeks ago`;
      break;
    case 60000 * 60 * 24 * 7 * 4 <= diff && diff < 60000 * 60 * 24 * 7 * 4 * 1.5: // 1-1.5 months
      const oneMonth = Math.floor(diff / (60000 * 60 * 24 * 7 * 4));
      dateMDY = `${oneMonth} Month ago`;
      break;
    case 60000 * 60 * 24 * 7 * 4 * 1.5 <= diff && diff < 60000 * 60 * 24 * 7 * 4 * 12: // 1.5-12 months
      const months = Math.floor(diff / (60000 * 60 * 24 * 7 * 4));
      dateMDY = `${months} Months ago`;
      break;
    default:
      // Format as date if older than a year
      const fileDate = new Date(eptime);
      dateMDY = fileDate.toLocaleDateString();
  }

  return dateMDY;
};

/**
 * Capitalizes the first letter of a string
 * @param string Input string
 * @returns String with first letter capitalized
 */
export const firstLetterCap = (string: string | null | undefined): string => {
  if (!string) {
    return "";
  }

  return string.charAt(0).toUpperCase() + string.slice(1);
};
