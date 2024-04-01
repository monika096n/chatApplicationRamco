import React, { useState } from 'react';
import { TextField, Button, Chip, Typography,Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
const useStyles = makeStyles((theme) => ({

  formContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '70vh',
    width: '50vh',
    flexDirection: "column"
  },
  orderForm: {
    width: 400,
    padding: 20,
    border: '1px solid #ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  formHeader:{
    fontSize: '2rem !important',
  },
  error: {
    color: 'red',
    fontSize: '0.8rem !important',
    margin: '5px 0px !important'
  }
}));

const OrderForm = ({propsForOrderForm,socket}) => {
  let {userName,customerName,mobileContact,itemsToOrder,deliveryDateTime,setCustomerName,setMobileContact,setItemsToOrder,setDeliveryDateTime,setOrderDetails}=propsForOrderForm;
  const classes = useStyles();
  const [newItem, setNewItem] = useState('');
  const [errors, setErrors] = useState({});


  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && newItem.trim() !== '') {
      event.preventDefault(); // Prevent the default Enter key action
      setItemsToOrder([...itemsToOrder, newItem.trim()]);
      setNewItem('');
    }
  };
  const handleMobileNumberChange = (event) => {
    const { value } = event.target;
    // Allow only numbers in the mobile number input
    const newValue = value.replace(/\D/g, '');
    setMobileContact(newValue);
  };
  const handleCxNameChange = (event) => {
    const { value } = event.target;
    // Allow only text in the cx name input
    const newValue = value.replace(/[^a-zA-Z]/g, '');
    setCustomerName(newValue);
  };

  const handleItemDelete = (index) => {
    const updatedItems = [...itemsToOrder];
    updatedItems.splice(index, 1);
    setItemsToOrder(updatedItems);
  };
  const validateFields = (data) => {
    const {
      customerName,
      mobileContact,
      itemsToOrder,
      deliveryDateTime
    } =data;
    const newErrors = {};

    if (!customerName) {
      newErrors.customerName = "Please Fill Customer Name";
    }
    if (mobileContact.length < 10 || !mobileContact) {
      newErrors.mobileContact = "Make Sure Mobile Contact has 10 digits";
    }
    if (!itemsToOrder.length) {
      newErrors.itemsToOrder = "Please enter at least one order";
    }
    if (!deliveryDateTime) {
      newErrors.deliveryDateTime = "Please select delivery date";
    }

    setErrors(newErrors);

    // Return true if there are no errors, false otherwise
    return Object.keys(newErrors).length === 0;
  };
  const clearOrderStateValues=()=>{
    setCustomerName('')
    setMobileContact('')
    setItemsToOrder([])
    setDeliveryDateTime(null)
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    let submitObj={
      customerName,
      mobileContact,
      itemsToOrder,
      deliveryDateTime
    }
    console.log('validateFields(submitObj):',validateFields(submitObj))
    if (validateFields(submitObj)) {
      setOrderDetails(submitObj);
      clearOrderStateValues();
      const sendData = {
        message: `Customer Name :${submitObj.customerName} , Phone: ${submitObj.mobileContact}, Order Id : ${submitObj.itemsToOrder} , Delivery Date:${submitObj.deliveryDateTime}`,
        userName: userName,
        createdAt: new Date(),
      };
      socket.emit("sendMessage", sendData);
    }
  };

  return (
    userName &&
    <Box className={classes.formContainer}>
         <Typography className={classes.formHeader}>Add Customer Orders </Typography>
        <form className={classes.orderForm}>
          <TextField
            label="Customer Name"
            type='text'
            variant="outlined"
            value={customerName}
            onChange={(e) => handleCxNameChange(e)}
            style={{ marginBottom: '10px' }}
            required
          />
         {errors.customerName && <Typography className={classes.error}>{errors.customerName}</Typography>}

          <TextField
            label="Mobile Contact"
            type='text'
            variant="outlined"
            value={mobileContact}
            onChange={(e) => handleMobileNumberChange(e)}
            style={{ marginBottom: '10px' }}
            required
          />
          {errors.mobileContact && <Typography className={classes.error}>{errors.mobileContact}</Typography>}
        
          <div>
            <TextField
              label="Preferred Delivery Date"
              type='date'
              variant="outlined"
              value={deliveryDateTime}
              onChange={(e) => {setDeliveryDateTime(e.target.value)}}
              style={{ marginBottom: '10px' }}
              required
            />
            {errors.deliveryDateTime && <Typography className={classes.error}>{errors.deliveryDateTime}</Typography>}
            </div>
          <TextField
            label="Add Items and Press Enter"
            variant="outlined"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={handleKeyPress}
            style={{ marginBottom: '10px' }}
          />
            {errors.itemsToOrder && <Typography className={classes.error}>{errors.itemsToOrder}</Typography>}

           <div style={{ marginBottom: '10px' }}>
            {itemsToOrder.map((item, index) => (
              <Chip
                key={index}
                label={item}
                onDelete={() => handleItemDelete(index)}
                style={{ marginRight: '5px', marginBottom: '5px' }}
              />
            ))}
          </div>
          
         
          <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </form>
    </Box>
  );
};

export default OrderForm;
