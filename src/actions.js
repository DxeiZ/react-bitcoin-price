export const updateData = (newData) => {
  return {
    type: 'UPDATE_DATA',
    payload: newData
  };
};

export default updateData;
