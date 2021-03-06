import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Drawer,
  Grid,
  FormControl,
  MenuItem,
  Select,
  Snackbar,
  InputAdornment,
  LinearProgress,
  TextField,
  Typography
} from "@material-ui/core";
import { MuiAlert } from "@material-ui/lab";
import { Link } from "react-router-dom";
import { twquery } from "../api/TwetchGraph";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Composer(props) {
  const window = props.window;
  const container =
    window !== undefined ? () => window().document.body : undefined;
  console.log(props);
  const replyTx = props.replyTx;
  const [placeholder, setPlaceholder] = useState("What's the latest?");
  const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (replyTx) {
      console.log(replyTx);
      twquery(`{
        allPosts(
          condition: {transaction: "${replyTx}"}
        ) {
          edges {
            node {
              userByUserId {
                name
              }
            }
          }
        }
      }`).then((res) =>
        setPlaceholder(
          `In reply to ${res.allPosts.edges[0].node.userByUserId.name}`
        )
      );
    }
  }, []);

  const handleChangeContent = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (localStorage.isOneClick === "false") {
      setOpen(true);
    } else {
      twetchPost(content, replyTx);
      setContent("");
    }
  };

  const getColor = () => {
    //console.log(256 - content.length);
    if (content.length > 255) {
      return "#E81212";
    } else {
      if (256 - content.length < 21) {
        return "#085AF6";
      } else {
        return "#696969";
      }
    }
  };
  const handleDrawerToggle = (e) => {
    e.stopPropagation();
    setOpen(!open);
  };

  const pay = (
    <main>
      <div
        style={{
          height: "100%",
          width: "100vw",
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          bottom: 0
        }}
      >
        <div
          style={{
            display: "flex",
            position: "fixed",
            bottom: 0,
            width: "100%"
          }}
        >
          <div style={{ flexGrow: 1 }}></div>
          <div
            style={{
              width: "600px",
              maxWidth: "calc(100% - 24px)",
              background: "white",
              borderRadius: "6px 6px 0 0"
            }}
          >
            <div style={{ padding: "16px", display: "flex" }}>
              <div
                style={{
                  color: "#2F2F2F",
                  margin: 0,
                  fontSize: "22px",
                  fontWeight: "bold",
                  textDecoration: "none"
                }}
              >
                Twetch
                <span style={{ color: "#085AF6", fontSize: "16px" }}>Pay</span>
              </div>
              <div style={{ flexGrow: 1 }} />
              <p
                style={{
                  fontSize: "18px",
                  lineHeight: "21px",
                  color: "#bdbdbd",
                  margin: 0,
                  fontWeight: "normal",
                  cursor: "pointer"
                }}
                onClick={handleDrawerToggle}
              >
                Close
              </p>
            </div>
            <div
              id="detail"
              style={{
                padding: "16px",
                borderTop: "2px solid #f2f2f2"
              }}
            >
              <div
                style={{
                  margin: "0 0 26px 0",
                  borderRadius: "6px"
                }}
              >
                <div
                  style={{
                    display: "block",
                    padding: "16px",
                    background: "#F6F5FB",
                    borderRadius: "6px",
                    textDecoration: "none"
                  }}
                >
                  <Link
                    style={{
                      display: "inline-block",
                      position: "relative",
                      marginRight: "12px",
                      verticalAlign: "top"
                    }}
                    to={`/u/${localStorage.id}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Avatar src={localStorage.icon} />
                  </Link>
                  <div
                    style={{
                      width: "calc(100% - 58px)",

                      display: "inline-block",
                      verticalAlign: "top"
                    }}
                  >
                    <div
                      style={{
                        width: "calc(100% - 58px)",
                        display: "inline-block",
                        verticalAlign: "top"
                      }}
                    >
                      <Link
                        to={`/u/${localStorage.id}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div
                          style={{
                            color: "#000000",
                            cursor: "pointer",
                            display: "inline-block",
                            overflow: "hidden",
                            fontSize: "16px",
                            maxWidth: "calc(100% - 64px)",
                            fontWeight: "bold",
                            lineHeight: "24px",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            verticalAlign: "top",
                            textDecoration: "none"
                          }}
                        >
                          {localStorage.name}
                        </div>
                      </Link>
                      <Typography
                        variant="body1"
                        style={{
                          color: "#828282",
                          display: "inline-block",
                          verticalAlign: "top"
                        }}
                      >{`@${localStorage.id}`}</Typography>
                    </div>
                    <div style={{ position: "relative" }}>
                      <Typography
                        variant="body1"
                        style={{
                          fontSize: "1rem",
                          fontFamily:
                            '"Roboto", "Helvetica", "Arial", sans-serif',
                          fontWeight: 400,
                          lineHeight: 1.5,
                          letterSpacing: "0.00938em",
                          wordWrap: "break-word"
                        }}
                      >
                        {content}
                      </Typography>
                    </div>
                    <div></div>
                  </div>
                </div>
              </div>
            </div>
            <div
              id="button"
              style={{
                marginBottom: "16px"
              }}
            >
              <div>
                <Typography
                  style={{
                    color: "#1A1A1C",
                    margin: "0 auto",
                    fontSize: "36px",
                    textAlign: "center",
                    fontWeight: 600,
                    lineHeight: "44px"
                  }}
                  variant="body1"
                >
                  $0.02
                </Typography>
                <Typography
                  style={{
                    color: "#A5A4A9",
                    margin: "0 auto",
                    fontSize: "16px",
                    marginTop: "2px",
                    textAlign: "center",
                    lineHeight: "20px",
                    marginBottom: "18px"
                  }}
                  variant="body1"
                >
                  0.00013378 BSV
                </Typography>
                <Button
                  style={{
                    width: "257px",
                    display: "block",
                    padding: "14px",
                    fontSize: "16px",
                    fontWeight: 600,
                    lineWeight: "24px",
                    textTransform: "none"
                  }}
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    twetchPost(content, replyTx);
                    setContent("");
                  }}
                >
                  Twetch It!
                </Button>
              </div>
              )
            </div>
            <div style={{ height: "10vh" }}></div>
          </div>
          <div style={{ flexGrow: 1 }}></div>
        </div>
      </div>
    </main>
  );

  const twetchPost = async (text, replyTx) => {
    //TODO
    console.log("twetch Post");
  };

  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSuccess(false);
  };

  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setError(false);
  };

  return (
    <div>
      <form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid
          container
          direction="column"
          style={{ padding: "16px", borderBottom: "1px solid #f2f2f2" }}
        >
          <Grid item>
            <TextField
              placeholder={placeholder}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <Avatar src={localStorage.getItem("icon")} />
                  </InputAdornment>
                )
              }}
              style={{ width: "100%" }}
              multiline
              rows={3}
              value={content}
              onChange={(event) => handleChangeContent(event)}
            />
          </Grid>
          <Grid item>
            <div style={{ display: "flex" }}>
              <div style={{ flexGrow: 1 }}></div>
              <div
                style={{
                  top: "unset",
                  margin: "8px 0",
                  display: "inline-block",
                  position: "relative",
                  right: "0px",
                  width: "30px",
                  fontSize: "12px",
                  background: "#F2F2F2",
                  lineHeight: "20px",
                  borderRadius: "9px"
                }}
              >
                <Typography
                  style={{
                    color: getColor(),
                    padding: "0 4px",
                    fontSize: "12px",
                    textAlign: "center",
                    fontWeight: "bold",
                    lineHeight: "20px"
                  }}
                  variant="body1"
                >
                  {256 - content.length}
                </Typography>
              </div>
            </div>
          </Grid>
          <Grid item>
            <Grid container style={{ width: "100%" }}>
              <div style={{ flexGrow: 1 }}></div>
              <div>
                <Button
                  style={{
                    height: "32px",
                    marginLeft: "16px",
                    marginTop: "10px",
                    textTransform: "none",
                    transition: "color .01s"
                  }}
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={!content || content.length > 256}
                  onClick={handleSubmit}
                >
                  Post
                </Button>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </form>
      <Snackbar
        open={success}
        autoHideDuration={4200}
        onClose={handleCloseSuccess}
      >
        <Alert onClose={handleCloseSuccess} severity="info"></Alert>
      </Snackbar>
      <Snackbar open={error} autoHideDuration={4200} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error">
          Error
        </Alert>
      </Snackbar>
      <Drawer
        style={{
          position: "fixed",
          inset: "0px"
        }}
        anchor="bottom"
        container={container}
        ModalProps={{
          keepMounted: true // Better open performance on mobile.
        }}
        onClose={handleDrawerToggle}
        open={open}
        variant="temporary"
      >
        {pay}
      </Drawer>
    </div>
  );
}
