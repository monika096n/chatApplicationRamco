import React, { useState } from "react";
import { Modal } from "@mui/material";
import { makeStyles } from "@mui/styles";
import ChatIcon from "@mui/icons-material/Chat";
import Messages from "../Message/Messages";
const useStyles = makeStyles((theme) => ({
  chatBotContainer: {
    display: "flex",
    justifyContent: "space-evenly",
  },
  chatIconButton:{
    
      maxWidth: "50px",
      maxHeight: "40px",
      borderRadius: "50px",
      borderColor: "transparent",
      cursor: "pointer",
    
  }
}));

export default function ChatBox({ userName, setUserName, orderDetails ,socket}) {
  const classes = useStyles();
  const [popupState, setPopUpState] = useState(false);

  return (
    <>
      <button
      className={classes.chatIconButton}
        onClick={() => setPopUpState(!popupState)}
      >
        <ChatIcon />
      </button>
      <Modal open={popupState} onClose={() => setPopUpState(false)}>
        <Messages
          userName={userName}
          socket={socket}
        />
      </Modal>
    </>
  );
}
