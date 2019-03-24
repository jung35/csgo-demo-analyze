module.exports = {
  onRoundStart: ({ match_status }) => {
    if (++match_status.count === 3) {
      console.log(`[${process.pid}] match start`);
      match_status.started = true;
    }
  },

  onRoundEnd: ({ match_status }) => {
    match_status.count = 0;
  },
};
