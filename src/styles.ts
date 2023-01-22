import { createStyles } from "@mantine/core";
const useStyles = createStyles({
  navbarLink: {
    fontSize: "0.9rem",
    "&:hover": {
      backgroundColor: "rgb(37,38,43)",
    },
    textDecoration: "none",
    color: "inherit",
    display: "flex",
    alignContent: "center",
    marginLeft: "0",
    marginTop: "0 ",
    marginBottom: "0",
    borderRadius: "5px",
  },

  navbarIcon: {
    margin: "0 auto",
  },

  textContainer: {
    border: "1px solid rgb(53, 58, 60)",
    borderRadius: "5px",
    padding: "0px",
  },

  primaryButton: {
    backgroundColor: "white",
    border: "1px solid rgb(114,114,114)",
    color: "black",
  },
});

export default useStyles;
