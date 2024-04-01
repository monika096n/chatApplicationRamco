import Message from "./Message";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  messenger: {
    display: "flex",
    maxWidth: "50%",
    justifyContent: "center",
    margin: "0 auto",
    alignItems: "center",
    height: "100vh",
  },
  chatBox: {
    flex: 5.5,
    background: "#111A20",
    borderRadius: "20px",
    height: "470px",
    width:'800px'
  },
  chatBoxWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
  },
  chatBoxTop: {
    paddingRight: "10px",
    maxHeight: "300px",
    overflowY: "auto",
  },
  chatBoxBottom: {
    marginTop: "80px",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 10,
  },
  chatMessageInput: {
    top: "60%",
    width: "30%",
    height: "50px",
    padding: "10px",
    borderRadius: "20px",
    resize: "none",
    position: "fixed",
  },
  chatSubmitButton: {
    position: "fixed",
    top: "70%",
    marginBottom: "10px",
    width: "70px",
    height: "40px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    backgroundColor: ({ newMessage }) =>
      !newMessage?.length ? "grey " : "purple",
    color: ({ newMessage }) => (!newMessage?.length ? "black" : "white"),
  },

  chatMenuWrapper: {
    padding: "10px",
    height: "100%",
  },

  noConversationText: {
    position: "absolute",
    top: "10%",
    fontSize: "50px",
    cursor: "default",
  },
}));

function Messages({ userName, socket }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const classes = useStyles({ newMessage });

  const scrollRef = useRef();


  useEffect(() => {
    if (socket) {
      // Initialize a set to keep track of received messageIds
      const receivedMessageIds = new Set();
  
      socket.on("newMessageReceived", (data) => {
        console.log("newMessageReceived:", data?.data?.messageId);
        
        // Check if the messageId has already been received
        if (!receivedMessageIds.has(data.data.messageId)) {
          receivedMessageIds.add(data.data.messageId);
          setMessages((prevMessages) => [...prevMessages, data.data]);
        }
      });
  
      return () => {
        socket.off("newMessageReceived");
      };
    }
  }, [socket]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("socket value before submit message:", socket);
    if (newMessage.length && socket) {
      const sendData = {
        message: newMessage,
        userName: userName,
        createdAt: new Date(),
      };
      socket.emit("sendMessage", sendData);
      setMessages((prevMessages) => [...prevMessages, sendData]);
      setNewMessage("");
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {userName && (
        <div
          className={classes.messenger}
        >
          <div className={classes.chatBox}>
            <div className={classes.chatBoxWrapper}>
              <>
                <div
                  className={classes.chatBoxTop}
                >
                  {messages.map((m, index) => (
                    <div key={index} ref={scrollRef}>
                      <Message message={m} own={m.userName === userName} />
                    </div>
                  ))}
                </div>
                <div className={classes.chatBoxBottom}>
                  <textarea
                    className={classes.chatMessageInput}
                    placeholder="Please write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                    required={true}
                  ></textarea>
                  <button
                    className={classes.chatSubmitButton}
                    onClick={handleSubmit}
                    disabled={!newMessage?.length}
                  >
                    Send
                  </button>
                </div>
              </>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Messages;
