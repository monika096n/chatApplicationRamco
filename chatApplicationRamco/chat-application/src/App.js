import OrderForm from "./components/OrderForm/OrderForm";
import ChatBotModalIcon from "./components/ChatBox/ChatBox";
import { useState ,useEffect} from "react";
import { io } from "socket.io-client";
function App() {
  const componentdisplayStyles = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
  };
  const [userName, setUserName] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [mobileContact, setMobileContact] = useState("");
  const [itemsToOrder, setItemsToOrder] = useState([]);
  const [deliveryDateTime, setDeliveryDateTime] = useState(null);
  const [currentUserName, setCurrentUserName] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [socket, setSocket] = useState(null);


  const propsForOrderForm = {
    setOrderDetails: setOrderDetails,
    userName: userName,
    customerName: customerName,
    mobileContact: mobileContact,
    itemsToOrder: itemsToOrder,
    deliveryDateTime: deliveryDateTime,
    setCustomerName: setCustomerName,
    setMobileContact: setMobileContact,
    setItemsToOrder: setItemsToOrder,
    setDeliveryDateTime: setDeliveryDateTime,
  };
  const ENDPOINT = "http://localhost:8000";

  useEffect(() => {
    if (userName) {
      const newSocket = io(ENDPOINT);
      setSocket(newSocket);
      newSocket.emit("setup", {
        userName: userName,
      });
      newSocket.on("connected", () => {
        setSocketConnected(true);
      });
      newSocket.emit("joinChat", {
        userName: userName,
      });
      newSocket.on("userJoined", (data) => {
        console.log(data?.data);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [userName]);

  return (
    <div className="App">
      <div style={componentdisplayStyles}>
        {userName ? (
          <>
            <OrderForm propsForOrderForm={propsForOrderForm} socket={socket}/>
            <ChatBotModalIcon
              userName={userName}
              socket={socket}
            />
          </>
        ) : (
          <div>
            Please Enter Login Details to Place an Order <br />
            <input
              onChange={(e) => setCurrentUserName(e.target.value)}
              type="text"
            />
            <button
              onClick={() => {
                currentUserName?.length > 0
                  ? setUserName(currentUserName)
                  : window.alert("Please Enter Username");
              }}
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
