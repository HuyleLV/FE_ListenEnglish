function findMillisecond(timestamps, targetTime) {
  let left = 0;
  let right = timestamps.length - 1;
  let previousTime = null;
  let currentTime = null;
  let nextTime = null;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    let midTime = timestamps[mid];
    let preTime = timestamps[mid - 1];

    if (midTime <= targetTime) {
      previousTime = preTime;
      currentTime = midTime;
      left = mid + 1;
    } else {
      nextTime = midTime;
      right = mid - 1;
    }
  }

  if (currentTime === null) {
    nextTime = timestamps[0];
  }

  return {
    previousTime: previousTime,
    currentTime: currentTime,
    nextTime: nextTime,
  };
}

export default findMillisecond;
