export default (...args: string[]): string => {
  const randomId = Math.random().toString(36).substring(2);
  return `${args.join('-')}-${randomId}`;
};
