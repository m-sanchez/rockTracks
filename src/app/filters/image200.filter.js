const image200 = () => input => {
  if (!input) {
    return input;
  }
  return input ? input.replace('100x100', '200x200') : '';
};
module.exports = image200;
