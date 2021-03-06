import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  CircularProgress,
  FormControl,
  Hidden,
  MenuItem,
  Select
} from "@material-ui/core";
import { use100vh } from "react-div-100vh";
import InfiniteScroll from "react-infinite-scroll-component";

import { FetchPosts } from "../api/TwetchGraph";
import Composer from "../components/Composer";
import AppBar from "../components/AppBar";
import LeftPane from "../components/LeftPane";
import RightPane from "../components/RightPane";
import Post from "../components/Post";
import StickyButton from "../components/StickyButton";

const Twetch = require("@twetch/sdk");

const indexToOrder = {
  0: "CREATED_AT_DESC",
  10: "CREATED_AT_ASC",
  20: "RANKING_DESC"
};

const OrderToIndex = {
  CREATED_AT_DESC: 0,
  CREATED_AT_ASC: 10,
  RANKING_DESC: 20
};

export default function Home(props) {
  const pinnedId = "1255590";
  const [orderBy, setOrderBy] = useState(indexToOrder[0]);
  //const [filter, setFilter] = useState(props.filter);
  const [postList, setPostList] = useState([]);
  const [offset, setOffset] = useState(0);
  const [boosts, setBoosts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const height = use100vh();
  const containerHeight = height ? height : "100vh";

  useEffect(() => {
    setLoading(true);
    fetchMore();
    setLoading(false);
    //getBoosts().then((res) => setBoosts(res));
  }, [orderBy]);

  const fetchMore = () => {
    FetchPosts(pinnedId, orderBy, offset).then((res) => {
      console.log(res);
      setTotalCount(res.allPosts.totalCount);
      //console.log("total:", totalCount);
      let data = res.allPosts.edges;
      setPostList(postList.concat(data));
      //console.log("postList:", postList.length);
      setOffset(offset + 30);
      if (totalCount !== 0 && postList.length >= totalCount) {
        //console.log("here");
        setHasMore(false);
      }
    });
    //console.log("hasMore:", hasMore);
  };

  const handleChangeOrder = (event) => {
    setPostList([]);
    setTotalCount(0);
    setHasMore(true);
    setOrderBy(indexToOrder[event.target.value]);
    setOffset(0);
  };

  const getDiff = (tx) => {
    let diff = 0;
    let found = boosts.find((x) => x.tx === tx);
    if (found) {
      diff = found.diff;
    }
    return diff;
  };

  const scrollTop = (e) => {
    document.getElementById("scrollable").scrollTo(0, 0);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center"
      }}
    >
      <Hidden smDown>
        <LeftPane currentTab="Home" />
      </Hidden>
      <div
        style={{
          flex: 2,
          width: "100%",
          maxWidth: "600px"
        }}
      >
        <div
          className="borders"
          style={{
            flex: 2,
            width: "100%",
            maxWidth: "600px"
          }}
        >
          <div style={{ cursor: "pointer" }} onClick={scrollTop}>
            <Hidden smUp>
              <AppBar currentTab="Home" />
            </Hidden>
            <Hidden xsDown>
              <div
                style={{
                  height: "81px",
                  position: "sticky",
                  display: "flex",
                  justifyContent: "center",
                  padding: "16px",
                  borderBottom: "1px solid #F2F2F2"
                }}
              >
                <Button
                  style={{
                    color: "#2F2F2F",
                    margin: 0,
                    fontSize: "22px",
                    fontWeight: "bold",
                    textDecoration: "none",
                    textTransform: "none"
                  }}
                  onClick={() => history.push("/")}
                >
                  Home
                </Button>
              </div>
            </Hidden>
            <FormControl
              style={{
                width: "100%",
                borderBottom: "1px solid #F2F2F2"
              }}
            >
              <Select
                variant="standard"
                style={{ paddingLeft: "16px" }}
                disableUnderline
                value={OrderToIndex[orderBy]}
                onChange={handleChangeOrder}
              >
                <MenuItem value={0}>Latest</MenuItem>
                <MenuItem value={10}>Oldest</MenuItem>
                <MenuItem value={20}>Economy</MenuItem>
              </Select>
            </FormControl>
          </div>

          {!loading ? (
            <div
              id="scrollable"
              style={{
                position: "relative",
                height: `calc(${containerHeight}px - 114px)`,
                overflowY: "auto"
              }}
            >
              <Hidden xsDown>
                <Composer />
                <div
                  style={{
                    width: "100%",
                    height: "8px",
                    backgroundColor: "#F2F2F2"
                  }}
                />
              </Hidden>
              <InfiniteScroll
                dataLength={postList.length}
                next={fetchMore}
                hasMore={hasMore}
                scrollableTarget="scrollable"
                loader={
                  <div
                    style={{
                      display: "flex",
                      marginTop: "16px",
                      justifyContent: "center",
                      overflow: "hidden"
                    }}
                  >
                    <CircularProgress />
                  </div>
                }
                endMessage={
                  <p style={{ textAlign: "center" }}>
                    <b>Yay, you've seen it all!</b>
                  </p>
                }
              >
                {postList.map((post, index) => {
                  return (
                    <Post
                      {...post}
                      boostDiff={getDiff(post.node.transaction)}
                      key={index}
                      tx={post.node.transaction}
                    />
                  );
                })}
              </InfiniteScroll>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                marginTop: "16px",
                justifyContent: "center",
                overflow: "hidden"
              }}
            >
              <CircularProgress />
            </div>
          )}
        </div>
      </div>
      <Hidden mdDown>
        <RightPane />
      </Hidden>
      <div
        style={{
          width: "100%",
          bottom: 0,
          zIndex: 1002,
          position: "fixed"
        }}
      >
        <Hidden smUp>
          <StickyButton replyTx="09011784eaf33c86dacc39cb21de64c3a12779de8c258a9edeec2608ab0f7136" />
        </Hidden>
      </div>
    </div>
  );
}
