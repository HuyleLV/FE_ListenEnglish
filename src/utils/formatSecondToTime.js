import {useEffect, useState, useCallback} from 'react';

function formatSecondToTime(seconds) {
  let mins = parseInt(seconds / 60)
      .toString()
      .padStart(2, '0');
  let secs = (Math.trunc(seconds) % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

export default formatSecondToTime;
