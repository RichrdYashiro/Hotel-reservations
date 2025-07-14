const initialState = {
  rooms: [],
  loading: false,
  error: null,
};

export const roomsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_ROOMS_REQUEST": { 
      return {
        ...state,
        loading: true,
        error:null
      }    
    }
         case "GET_ROOMS_SUCCESS": { 
      return {
        ...state,
        loading: false,
         rooms: action.payload, 
      }    
    }
           case "GET_ROOMS_FAILURE": { 
      return {
        ...state,
        loading: false,
         error: action.payload,
      }    
    }
    default:
			return state;
    }
}