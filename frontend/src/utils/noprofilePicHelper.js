export const defaultAvatar = (userName) => {
  if (!userName) return;
  const onlyLatters = userName.trim().split(" ");
  if (onlyLatters.length === 1) {
    return onlyLatters[0].charAt(0).toUpperCase();
  } else {
    return (
      onlyLatters[0].charAt(0).toUpperCase() +
      onlyLatters[onlyLatters.length - 1].charAt(0).toUpperCase()
    );
  }
};
