const initialState = {
  room: null
};

export const roomReducer = (state = initialState, action) => {
  switch (action.type) { 
         case "GET_ROOM_SUCCESS": { 
      return {
        ...state,
         room: action.payload, 
      }    
    }
    default:
			return state;
    }
}