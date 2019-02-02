export default seconds => {
  const h = Math.floor(seconds / 3600); // 3600 = seconds in 1 hour
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor((seconds % 3600) % 60);

  const hour = h >= 0 && h < 10 ? `0${h}` : `${h}`;
  const minute = m >= 0 && m < 10 ? `0${m}` : `${m}`;
  const second = s >= 0 && s < 10 ? `0${s}` : `${s}`;

  return `${hour}:${minute}:${second}`;
};
