import Axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveMessage } from "../_actions/message_actions";
import pandaImg from "../assets/images/google-panda-circular-symbol.png";
import yyyImg from "../assets/images/Logo_Yin-Young-&-You_Web.jpg";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  FormControl,
  InputGroup,
  Image,
} from "react-bootstrap";

function Chatbot() {
  const dispatch = useDispatch();
  const messagesFromRedux = useSelector((state) => state.message.messages);
  const [textInput, setTextInput] = useState(" ");
  // const [loading, setLoading] = useState(false);
  const endRef = useRef();

  // const textURL =
  //   process.env.REACT_ENV === "production"
  //     ? "https://yyy-diagnostic.herokuapp.com/"
  //     : "http://localhost:8000/";
  const textURL = "https://yyy-diagnostic.herokuapp.com/";

  useEffect(() => {
    eventQuery("welcome");
  }, []);

  const handleScroll = () => {
    if (endRef) {
      endRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  // Event Query Handle
  const eventQuery = async (event) => {
    // We need to take care of the message Chatbot sent
    const eventQueryVariables = {
      event,
    };
    try {
      //I will send request to the textQuery ROUTE
      const response = await Axios.post(
        `${textURL}api/dialogflow/eventQuery`,
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

    // Handle Message from Chatbot
    const textQueryVariables = {
      text,
    };
    try {
      const response = await Axios.post(
        `${textURL}api/dialogflow/textQuery`,
        textQueryVariables
      );
      for (let content of response.data.fulfillmentMessages) {
        let conversation = {
          who: "bot",
          content: content,
        };
        dispatch(saveMessage(conversation));
      }
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
  const buttonPressHandler = () => {
    textQuery(textInput);
    setTextInput("");
  };

  const keyPressHandler = (e) => {
    if (e.key === "Enter") {
      if (!e.target.value) {
        return alert("You need to type something first before hitting enter");
      }
      textQuery(e.target.value);
      setTextInput("");
    }
  };

  const renderOneMessage = (message, i) => {
    // console.log("message: ", message);
    if (message.content && message.content.text && message.content.text.text) {
      const isBot = (message.who === "bot");
      handleScroll();
      return (
        <div className="py-0 px-1 my-2">
          <Row
            className={`mx-0 ${
              message.who === "bot"
                ? "justify-content-start"
                : "justify-content-end"
            }`}
          >
            <Col
              sm={{ span: 1, order: isBot ? "first" : "last" }}
              className="align-items-center p-1 mx-2"
            >
              <Image
                src={isBot ? yyyImg : pandaImg}
                style={{ width: "3rem", height: "auto" }}
                roundedCircle
              />
            </Col>
            <Col sm={7} className="px-0 mx-0 align-items-center">
              <Card
                bg={isBot ? "primary" : "white"}
                style={{ width: "100%", border: "none" }}
              >
                <Card.Body
                  className={isBot ? "text-light" : "text-dark"}
                >
                  {message.content.text.text}
                </Card.Body>
              </Card>
            </Col>
          </Row>
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
//  backgroundColor: "#F8F8FF",
  return (
    <div>
      <Container fluid className="pt-3">
        <Row className="justify-content-center">
          <Col lg={8} md={10} sm={12}>
            <Card
              style={{
                width: "100%",
                height: "80vh",
                backgroundColor: "#F8F8FF",
              }}
            >
              <div style={{ height: 644, width: "100%", overflow: "auto" }}>
                {renderMessage(messagesFromRedux)}
                <div style={{ clear: "both" }} ref={endRef}></div>
              </div>
            </Card>
            <InputGroup
              className="my-2"
              style={{ width: "100%" }}
              key="chat_input"
            >
              <FormControl
                placeholder="Hit Enter to submit answer"
                aria-label="message"
                aria-describedby="messageToChatbot"
                value={textInput}
                onKeyPress={keyPressHandler}
                onChange={(e) => setTextInput(e.target.value)}
                type="text"
                style={{ height: "3rem" }}
              />
              <InputGroup.Append>
                <Button variant="primary" onClick={buttonPressHandler}>
                  Send
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Chatbot;
