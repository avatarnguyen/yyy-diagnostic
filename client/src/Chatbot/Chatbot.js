import Axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveMessage } from "../_actions/message_actions";

import {
  Container,
  Row,
  Card,
  Button,
  FormControl,
  InputGroup,
} from "react-bootstrap";

function Chatbot() {
  const dispatch = useDispatch();
  const messagesFromRedux = useSelector((state) => state.message.messages);
  var textInput = "";
  // const [textInput, setTextInput] = useState(" ");

  let conversation = {
    who: "user",
    content: {
      text: {
        text: "Hallo! Willkommen",
      },
    },
  };

  useEffect(() => {
    dispatch(saveMessage(conversation));
    // eventQuery("welcomeToYYY");
  }, [dispatch]);

  // const ref = React.createRef();
  var element = document.getElementById("endMessage");

  const handleScroll = () =>
  element.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });

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
    // console.log("text I sent", conversation);

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
    }
  };

  // const eventKeyPressHandler = (e) => {
  //   eventQuery("welcomeToYYY");
  // };
  const buttonPressHandler = () => {
    textQuery(textInput);
  };
  const handleInput = (e) => {
    textInput = e.target.value;
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
    handleScroll();
    if (message.content && message.content.text && message.content.text.text) {
      return (
        <div className="py-0 px-2 my-2">
          <Card
            className={message.who === "bot" ? "mr-auto" : "ml-auto"}
            bg={message.who === "bot" ? "primary" : "white"}
            style={{ width: "60%", border: "none" }}
          >
            <Card.Body
              className={message.who === "bot" ? "text-light" : "text-dark"}
            >
              {message.content.text.text}
            </Card.Body>
          </Card>
        </div>
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
    <div>
      <Container fluid className="pt-3 bg-white">
        <Row className="justify-content-center">
          <Card style={{ width: "60%", height: "80vh", backgroundColor: "#F8F8FF" }}>
            <Card.Title>Diagnostic Chat</Card.Title>
            <div
              style={{ height: 644, width: "100%", overflow: "auto" }}
            >
              {renderMessage(messagesFromRedux)}
              <div
                style={{ clear: "both" }}
                id="endMessage"
              ></div>
            </div>
          </Card>
        </Row>
        <Row className="justify-content-center">
          <InputGroup className="my-2" style={{ width: "60%" }}>
            <FormControl
              placeholder="message"
              aria-label="message"
              aria-describedby="messageToChatbot"
              onKeyPress={keyPressHandler}
              onChange={handleInput}
              type="text"
              style={{ height: "3rem" }}
            />
            <InputGroup.Append>
              <Button variant="primary" onClick={buttonPressHandler}>
                Send
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Row>
      </Container>
    </div>
  );
}

export default Chatbot;
