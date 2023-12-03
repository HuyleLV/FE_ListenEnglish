
import React from 'react';

function Control({
  onPlay,
  onPause,
  onReset,
  current,
  setCurrent,
  recoverAutoScrollImmediately,
}) {
  return (
    <center>
      <button type="button" className='bg-red-100 p-4 rounded-full' onClick={onPlay}>
        play
      </button>
      <button type="button" className='mx-10 bg-red-100 p-4 rounded-full' onClick={onPause}>
        pause
      </button>
      <button type="button" className='bg-red-100 p-4 rounded-full' onClick={onReset}>
        reset
      </button>
      <input
        type="number"
        value={current}
        className='px-10'
        onChange={(event) => setCurrent(Number(event.target.value))}
      />
      <button type="button" onClick={recoverAutoScrollImmediately}>
        recover auto scroll immediately
      </button>
    </center>
  );
}

export default Control;
