import React from "react";
import { SpinnerRoundFilled } from "spinners-react";

const Loader = () => {
  return (
    <div style={styles.wrapper}>
      <SpinnerRoundFilled 
        size={90} 
        thickness={100} 
        speed={100} 
        color="#e50914" 
        secondaryColor="#fdd" 
      />
      <p style={styles.text}>Loading...</p>
    </div>
  );
};

const styles = {
  wrapper: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 15,
    color: "#e50914",
    fontSize: "1.1rem",
    letterSpacing: "0.5px",
  },
};

export default Loader;
