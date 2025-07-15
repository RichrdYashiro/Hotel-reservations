import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getRoom } from "../actions/Room-find";
import styled from "styled-components";
import { Button, H2 } from "../components";

const RoomDetailsContainer = ({ className }) => {
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getRoom(id));
  }, [dispatch, id]);
    const { room } = useSelector((state) => state.room);

    return (
      <div className={className}>
          <img src={room.img} alt={room.title} />
          <div className="roomInner">
              <H2>Забронировать: {room.title}</H2>
                <p>{room.descriontion}</p>
                <Button>Забронировать</Button>
          </div>    
    </div>
  );
};

export const RoomDetails = styled(RoomDetailsContainer)`
  display: flex;
  gap: 16px;
margin-top:40px;
  & img{
  max-width:400px;
  }
`;