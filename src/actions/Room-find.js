
export const getRoomSuccess = (room) => ({
  type: 'GET_ROOM_SUCCESS',
  payload: room
});


export const getRoom = (id) => async (dispatch) => {
    const response = await fetch(`http://localhost:3005/rooms/${id}`);
    if (!response.ok) throw new Error('Ошибка загрузки комнаты');
    const data = await response.json();
    dispatch(getRoomSuccess(data));
}