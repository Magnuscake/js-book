import { useState, useEffect } from "react";
import { ResizableBox, ResizableBoxProps } from "react-resizable";

interface ResizableProps {
  direction: "horizontal" | "vertical";
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    let timer: any;

    const eveListner = () => {
      // prevent the code cell from lagging when the browser is resized
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        setWindowWidth(window.innerWidth);
        setWindowHeight(window.innerHeight);
      }, 100);
    };

    window.addEventListener("resize", eveListner);

    return () => {
      window.removeEventListener("resize", eveListner);
    };
  }, []);

  let resizableProps: ResizableBoxProps;

  if (direction === "horizontal") {
    resizableProps = {
      className: "resize-horizontal",
      maxConstraints: [windowWidth * 0.85, Infinity],
      minConstraints: [windowWidth * 0.2, Infinity],
      height: Infinity,
      width: windowWidth * 0.75,
      resizeHandles: ["e"],
    };
  } else {
    resizableProps = {
      maxConstraints: [Infinity, windowHeight * 0.9],
      minConstraints: [Infinity, 30],
      height: 300,
      width: Infinity,
      resizeHandles: ["s"],
    };
  }

  return <ResizableBox {...resizableProps}>{children}</ResizableBox>;
};

export default Resizable;
