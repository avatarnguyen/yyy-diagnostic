import Axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveMessage } from "../_actions/message_actions";

function Chatbot() {
  const dispatch = useDispatch();
  const messagesFromRedux = useSelector((state) => state.message.messages);

  useEffect(() => {
    console.log("---Event Query---");
    let conversation = {
      who: "user",
      content: {
        text: {
          text: "Hallo! Willkommen",
        },
      },
    };
    dispatch(saveMessage(conversation));
    // eventQuery("welcomeToYYY");
  }, [dispatch]);

  // Event Query Handle
  const eventQuery = async (event) => {
    // We need to take care of the message Chatbot sent
    const eventQueryVariables = {
      event,
    };
    try {
      //I will send request to the textQuery ROUTE
      const response = await Axios.post(
        "/api/dialogflow/eventQuery",
        eventQueryVariables
      );
      for (let content of response.data.fulfillmentMessages) {
        let conversation = {
          who: "bot",
          content: content,
        };

        dispatch(saveMessage(conversation));
      }
    } catch (error) {
      let conversation = {
        who: "bot",
        content: {
          text: {
            text: " Error just occured, please check the problem",
          },
        },
      };
      dispatch(saveMessage(conversation));
    }
  };

  // TEXT QUERY
  const textQuery = async (text) => {
    // Sent Message
    let conversation = {
      who: "user",
      content: {
        text: {
          text: text,
        },
      },
    };
    dispatch(saveMessage(conversation));
    console.log("text I sent", conversation);

    // Handle Message from Chatbot
    const textQueryVariables = {
      text,
    };
    try {
      const response = await Axios.post(
        "api/dialogflow/textQuery",
        textQueryVariables
      );
      const content = response.data.fulfillmentMessages[0];

      conversation = {
        who: "bot",
        content: content,
      };
      dispatch(saveMessage(conversation));
      // console.log(conversation)
    } catch (error) {
      conversation = {
        who: "bot",
        content: {
          text: {
            text: "Error occured with textQuery!!!",
          },
        },
      };
      dispatch(saveMessage(conversation));
      // console.log(conversation)
    }
  };

  const eventKeyPressHandler = (e) => {
    eventQuery("welcomeToYYY");
  };

  const keyPressHandler = (e) => {
    if (e.key === "Enter") {
      if (!e.target.value) {
        return alert("You need to type something first before hitting enter");
      }
      textQuery(e.target.value);
      e.target.value = "";
    }
  };

  const renderOneMessage = (message, i) => {
    console.log("message: ", message);

    if (message.content && message.content.text && message.content.text.text) {
      return (
        <p>{message.content.text.text}</p>
      );
    }
  };

  const renderMessage = (returnedMessages) => {
    if (returnedMessages) {
      return returnedMessages.map((message, i) => {
        return renderOneMessage(message, i);
      });
    } else {
      return null;
    }
  };

  return (
    <div className="App-chat">
      <div style={{ height: 644, width: "100%", overflow: "auto" }}>
        {renderMessage(messagesFromRedux)}
      </div>
      <input
        style={{
          margin: 0,
          width: "100%",
          height: 50,
          borderRadius: "4px",
          padding: "5px",
          fontSize: "1rem",
        }}
        placeholder="Send a message..."
        onKeyPress={keyPressHandler}
        type="text"
      />
      <button onClick={eventKeyPressHandler}>Event</button>
    </div>
  );
}

export default Chatbot;
