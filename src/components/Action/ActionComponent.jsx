import React from "react";
import { Box } from "@mui/material";
import { useTransition, animated } from 'react-spring';
import BuyingAdvice from "./BuyingAdvice";
import SellingAdvice from "./SellingAdvice";

const MainPage = () => {
  const components = [<BuyingAdvice key="buying" />, <SellingAdvice key="selling" />];

  const transitions = useTransition(components, {
    keys: component => component.key,
    from: { opacity: 0, transform: 'translate3d(-100%,0,0)' },
    enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
    leave: { opacity: 0, transform: 'translate3d(100%,0,0)' },
    trail: 100,
  });

  return (
    <Box className="container" sx={{ marginTop: "120px" }}>
      {transitions((style, component) => (
        <animated.div style={style} key={component.key}>
          {component}
        </animated.div>
      ))}
    </Box>
  );
};

export default MainPage;
