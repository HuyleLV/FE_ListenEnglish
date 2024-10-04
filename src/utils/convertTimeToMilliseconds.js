function convertTimeToMilliseconds(time) {
  // console.log('Time', time);
  // Split the time string into minutes, seconds, and milliseconds parts
  const [minutesStr, secondsMilliStr] = time.split(':');
  const [secondsStr, millisecondsStr] = secondsMilliStr?.split('.') || [0, 0];
  // Convert each part to a number
  const minutes = parseInt(minutesStr, 10);
  const seconds = parseInt(secondsStr, 10);
  const milliseconds = parseInt(millisecondsStr, 10);

  // Calculate the total milliseconds
  const minutesToMs = minutes * 60 * 1000;
  const secondsToMs = seconds * 1000;
  // Add all the calculated values together to get the total milliseconds
  return minutesToMs + secondsToMs + milliseconds;
}

export default convertTimeToMilliseconds;
