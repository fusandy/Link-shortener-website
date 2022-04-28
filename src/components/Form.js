import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import "./form.css";

// get the URL, validate, post to shrtco API, get response and put into the output area

function Form() {
  const [inputURL, setInputURL] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  // https://api.shrtco.de/v2/
  // https://shrtco.de/docs/

  const changeHandler = (e) => {
    setError("");
    setOutput('');
    setInputURL(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const regex = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator

    let outputString = "";
    if (!inputURL) {
      outputString = "URL is empty.";
    } else {
      const validateResult = !!regex.test(inputURL);
      if (validateResult) {
        getShortenLink();
      } else {
        outputString = "Invalid URL, please try again.";
      }
    }
    setError(outputString);
  };

  // https://blog.logrocket.com/implementing-copy-clipboard-react-clipboard-api/
  const copyTextToClipboard = async(text) => {
    console.log(text);
    console.log(navigator);
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    }
  }

  const copyHandler = () => {
    copyTextToClipboard(output)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getShortenLink = async () => {
    try {
      const res = await fetch(
        `https://api.shrtco.de/v2/shorten?url=${inputURL}`
      );
      const result = await res.json();
      if (result.ok) {
        setOutput(result.result.short_link);
      }
    } catch (err) {
      console.log("catch:", err);
    }
  };

  return (
    <>
      <form className="container">
        <TextField
          id="input"
          name="url"
          placeholder="Paste On an URL"
          value={inputURL}
          type="text"
          onChange={changeHandler}
          fullWidth
          autoComplete="off"
        />
        <span>{error}</span>

        <div className="btn-area">
          <Button variant="contained" className="btn" onClick={submitHandler}>
            Transfer
          </Button>
        </div>
      </form>

      <TextField
        id="input"
        value={output}
        placeholder="Transfer Output"
        InputProps={{
          readOnly: true,
        }}
        fullWidth
      />
      <div className="copy" onClick={copyHandler}>
        <CopyAllIcon />
        <span>{isCopied ? "Copied!" : "Copy"}</span>
      </div>
    </>
  );
}
export default Form;
