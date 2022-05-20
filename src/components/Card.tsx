import React from "react";
import { RiCloseCircleLine } from "react-icons/ri";
import { TiEdit } from "react-icons/ti";
import { useNavigate } from "react-router-dom";

type CardItem = {
  id: string;
  title: string;
  total: number;
};
interface CardProps {
  items: CardItem[];
}
function Card(props: CardProps) {
  let navigate = useNavigate();
  const goto = function (id: string) {
    navigate("/" + id);
    return;
  };
  if (props.items == null || props.items.length <= 0) {
    return <></>;
  }

  return (
    <>
      {props.items.map((item, index) => (
        <div className="flex justify-center" key={index}>
          <div className=" relative justify-center mt-6">
            <div className="absolute flex top-0 right-0 p-3 space-x-1">
              <TiEdit
                size={25}
                onClick={(event: React.MouseEvent<SVGElement, MouseEvent>) =>
                  goto(item.id)
                }
              />
              <RiCloseCircleLine size={25} />
            </div>
            <span className="absolute -left-3 -top-3 bg-green-500 flex justify-center items-center rounded-full w-8 h-8 text-gray-50 font-bold">
              {item.total}
            </span>
            <p className="bg-white px-12 py-8 rounded-lg w-80">{item.title}</p>
          </div>
        </div>
      ))}
    </>
  );
}

export default Card;
