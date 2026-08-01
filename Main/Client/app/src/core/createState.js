export const createState = (initialValue, render) => {
  let value = initialValue;

  return {
    get: () => value ,
    set: (newValue) => {
      value = newValue;
      if (typeof render === 'function') {
        render();
      }
    }
  }
}
