import React from "react";
import styled from "styled-components";
import ConfigDark from "../config/particlesjs-config.json";
import ConfigLight from "../config/particlesjs-config-light.json";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const Box = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 0;
  /* Add additional styling as needed */
`;

const ParticlesComponent = ({ theme }) => {
  const particlesInit = async (main) => {
    try {
      await loadFull(main);
    } catch (error) {
      console.error("Error initializing particles:", error);
    }
  };

  const particlesParams =  ConfigDark;

  return (
    <Box>
      <Particles
        id="tsparticles"
        style={{ position: "absolute", top: 0 }}
        params={particlesParams}
        init={particlesInit}
      />
    </Box>
  );
};

export default ParticlesComponent;
