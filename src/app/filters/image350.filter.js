const image350 = () => input => {
  if (!input) {
    return input;
  }
  return input ? input.replace('100x100', '350x350') : '';
};
module.exports = image350;
