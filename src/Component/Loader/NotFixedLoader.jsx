import React from "react";


const NotFixedLoader = () => {
  return (
    <div style={styles.wrapper}>
      <SpinnerRoundFilled 
        size={90} 
        thickness={100} 
        speed={100} 
        color="#4fa94d" 
        secondaryColor="#2c2c2c" 
      />
      <p style={styles.text}>Loading...</p>
    </div>
  );
};

const styles = {
  wrapper: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 15,
    color: "#121212",
    fontSize: "1.1rem",
    letterSpacing: "0.5px",
  },
};

export default NotFixedLoader;
