import { Avatar, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { format } from "timeago.js";
const useStyles = makeStyles((theme) => ({
  message: {
    display: "flex",
    flexDirection: "column",
    marginTop: "20px",
  },
  messageTop: {
    display: "flex",
    alignItems: ({ own }) => (own ? "flex-end" : "flex-start"), // Use own prop here
  },
  messageText: {
    padding: "10px",
    borderRadius: "20px",
    color: "#000", // Text color black for better visibility
    alignSelf: ({ own }) => (own ? "flex-end" : "flex-start"), // Align to flex-end if own is true, flex-start otherwise
    background: ({ own }) => (own ? "#1877f2" : "#9e9e9e"), // Blue if own is true, Grey otherwise
  },
  messageImg: {
    width: "32px",
    height: "32px",
    borderRadius: 0.5,
    objectFit: "cover",
    marginRight: "10px",
  },
  messageBottom: {
    fontSize: "12px",
    marginTop: "10px",
    alignSelf: ({ own }) => (own ? "flex-end" : "flex-start"), // Align to flex-end if own is true, flex-start otherwise
  },
}));

export default function Message({ message, own }) {
  const classes = useStyles({ own });
  return (
    // <Box className={`${classes.message}`}>
    //   <Box className={classes.messageTop}>
    //     <Box
    //       className={classes.messageImg}
    //       src="https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
    //       alt=""
    //     />
    //     <p className={classes.messageText}>{message.message}</p>
    //   </Box>
    //   <div className={classes.messageBottom}>{message.userName} - {format(message.createdAt)}</div>
    // </Box>
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          borderRadius: "30px",
          padding: "20px",
          margin: "20px",
        }}
      >
        <div
          className="chat-main-content"
          style={{
            width: "50%",
            alignSelf: own ? "flex-end" : "flex-start",
            background: own ? "#015C4B" : "#1F2C33",
            color: "white",
            padding: "0px 20px",
            borderRadius: "20px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            {!own && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 20,
                  marginBottom: 0,
                }}
              >
                <Avatar>{message?.userName?.charAt(0)?.toUpperCase()}</Avatar>
                <p className="message-info">
                  {message?.userName?.charAt(0).toUpperCase() +
                    message?.userName?.slice(1)}
                </p>
              </div>
            )}
            <p style={{ marginBottom: 0 }} className="message-body">
              {message.message}
            </p>
            <div
              style={{
                display: "flex",
                alignSelf: "end",
                flexDirection: "row",
                gap: 20,
                marginTop: 0,
                color: "#A3BEB7",
              }}
            >
              <p className="message-info">{format(message.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}