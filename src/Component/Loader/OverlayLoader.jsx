import React from "react";
import { SpinnerRoundFilled } from "spinners-react";

const OverlayLoader = () => {
  return (
    <div style={styles.overlay}>
      <div style={styles.wrapper}>
        <SpinnerRoundFilled 
          size={90} 
          thickness={100} 
          speed={100} 
          color="#e50914" 
          secondaryColor="#fdd" 
        />
        <p style={styles.text}>Saving...</p>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  text: {
    marginTop: 15,
    color: "#fff",
    fontSize: "1.1rem",
    letterSpacing: "0.5px",
  },
};

export default OverlayLoader;
