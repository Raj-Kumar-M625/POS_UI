import { COMPLETED, PENDING } from "../Constants/Common";

type CardProps = {
  text?: string;
  count?: number | string;
  classNames?: string;
};

export const SquareCard = ({ text, count, classNames }: CardProps) => {
  return (
    <div
      className={`card border-3 border-dark mx-2 d-flex 
      align-items-center justify-content-center ${classNames}`}
      style={{ width: "11.5rem", backgroundColor: "", height: "5.5rem" }}
    >
      <h6 className="text-center fw-bold">{text}</h6>
      <h6 className="text-center fw-bold">{count}</h6>
    </div>
  );
};

export const RectangleCard = ({ text, count, classNames }: CardProps) => {
  return (
    <div
      className={`card border-3 border-dark m-2 d-flex pt-1
                 align-items-center border-2 fw-bold ${classNames}`}
      style={{
        width: "11.5rem",
        height: "2rem",
        backgroundColor: `${text === COMPLETED && "red"} 
                          ${text === PENDING && "#edf029"} 
                          ${text ?? "#edf029"}`,
      }}
    >
      <p className="fs-6 text-center">{text ?? count}</p>
    </div>
  );
};
