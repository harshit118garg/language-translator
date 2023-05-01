import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { BiCopy } from "react-icons/bi";
import "./App.css";
interface LanguageObj {
  code: string;
  name: string;
  targets: string[];
}

function App() {
  const [options, setOptions] = useState([]);
  const [from, setFrom] = useState("en");
  const [to, setTo] = useState("en");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const OutputRef = useRef<HTMLTextAreaElement>(null);

  const translateFunc = async () => {
    if (input) {
      const params = new URLSearchParams();
      params.append("q", input);
      params.append("source", from);
      params.append("target", to);
      params.append("format", "text");
      params.append("api_key", "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx");
      axios
        .post("https://libretranslate.de/translate", params, {
          headers: {
            accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          setOutput(res.data.translatedText);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert(`enter some text`);
    }
  };

  useEffect(() => {
    axios
      .get("https://libretranslate.de/languages", {
        headers: {
          accept: "application/json",
        },
      })
      .then((res) => {
        setOptions(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  function handleClick(): void {
    if (OutputRef.current) {
      OutputRef.current.select();
      navigator.clipboard.writeText(OutputRef.current.value);
      alert("translated text is copied");
    }
  }

  return (
    <>
      <div className="App">
        <Container className="bg-primary shadow-lg p-3" fluid>
          <h2 className="text-uppercase display-3 text-light">
            Language Translator
          </h2>
        </Container>
        <Container className="mt-5 bg-warning p-3 rounded-2 shadow-sm">
          <Row className="p-3">
            <Col xs={12} sm={12} md={6}>
              <Form.Label>From ({from})</Form.Label>
              <Form.Select
                className="p-3 fs-4"
                onChange={(e) => setFrom(e.target.value)}
              >
                {options.map((opt: LanguageObj) => {
                  return (
                    <option value={opt.code} key={opt.code}>
                      {opt.name}
                    </option>
                  );
                })}
              </Form.Select>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Form.Label>To ({to})</Form.Label>
              <Form.Select
                className="p-3 fs-4"
                onChange={(e) => setTo(e.target.value)}
              >
                {options.map((opt: LanguageObj) => (
                  <option value={opt.code} key={opt.code}>
                    {opt.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </Container>
        <Container className="mt-5 bg-danger p-3 rounded-2 shadow-sm">
          <Row className="mb-4 p-3">
            <Form.Control
              as={"textarea"}
              style={{ height: "100px", fontSize: "24px" }}
              value={input}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setInput(e.target.value)
              }
            />
          </Row>
          <Row className="p-3">
            <Form.Control
              as={"textarea"}
              style={{ height: "100px", fontSize: "24px" }}
              value={output}
              onChange={() => {}}
              ref={OutputRef}
            />
          </Row>
          <Row className="p-3">
            <Col xs={12} sm={12} md={6} lg={6}>
              <Button
                className="fs-3 w-100"
                variant="success"
                onClick={() => translateFunc()}
              >
                Translate
              </Button>
            </Col>
            <Col>
              <Button
                className="fs-3 w-100"
                variant="success"
                onClick={handleClick}
              >
                Copy Text <BiCopy />
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default App;
