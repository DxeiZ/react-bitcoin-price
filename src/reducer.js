const initialState = {
    todos: []
  };
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case 'UPDATE_DATA':
        return {
          ...state,
          todos: action.payload
        };
      default:
        return state;
    }
  };
  
  export default reducer;
  