import axios from 'axios';
import Razorpay from 'razorpay';

import React from 'react';
import axios from 'axios';

const RazorpayPayment = () => {
  const handlePayment = async () => {
    try {
      // Hard-coded Bearer token (replace with the actual token)
      const bearerToken = 'YOUR_BEARER_TOKEN';

      // Create an Order
      const orderResponse = await axios.post(
        'YOUR_CREATE_ORDER_API_URL',
        {
          amount: 50000, // in paise
          currency: 'INR',
          receipt: 'order_rcptid_11',
        },
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );

      const { _id: orderId } = orderResponse.data;

      // Initialize Razorpay
      const options = {
        key: 'YOUR_RAZORPAY_KEY_ID', // Enter the Key ID generated from the Dashboard
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        name: 'Your Company Name',
        description: 'Test Transaction',
        order_id: orderId,
        handler: async (response) => {
          try {
            // Verify the payment
            const verifyResponse = await axios.post(
              'YOUR_VERIFY_ORDER_API_URL',
              {
                transactionId: response.razorpay_payment_id,
              },
              {
                headers: {
                  Authorization: `Bearer ${bearerToken}`,
                },
              }
            );

            alert('Payment successful');
            console.log(verifyResponse.data);
          } catch (error) {
            console.error('Error verifying payment', error);
          }
        },
        prefill: {
          name: 'Your Name',
          email: 'email@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error creating order', error);
    }
  };

  return (
    <button onClick={handlePayment}>
      Pay Now
    </button>
  );
};

export default RazorpayPayment;
