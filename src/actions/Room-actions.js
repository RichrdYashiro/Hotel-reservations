export const getRoomsRequest = () => ({
  type: 'GET_ROOMS_REQUEST',
});

export const getRoomsSuccess = (rooms) => ({
  type: 'GET_ROOMS_SUCCESS',
  payload: rooms,
});

export const getRoomsFailure = (error) => ({
  type: 'GET_ROOMS_FAILURE',
  payload: error,
});

export const fetchRooms = () => { 
    return async (dispatch) => {
        dispatch(getRoomsRequest());
        try {
            const response = await fetch('http://localhost:3005/rooms');
            if (!response.ok) throw new Error("Ошибка при загрузке")
          const data = await response.json();
            dispatch(getRoomsSuccess(data));
        }
        catch(err) { 
            dispatch(getRoomsFailure(err.message)); 
        }
    };
   
}

