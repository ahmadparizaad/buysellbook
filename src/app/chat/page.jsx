'use client';
import React from "react";
import Chat from "./chat";

export default function Home() {
  let [libraryImported, setLibraryImported] = React.useState(false);

  React.useEffect(() => {
    window.CometChat = require("@cometchat/chat-sdk-javascript").CometChat;
    setLibraryImported(true);
  }, []);

  return libraryImported ? <Chat /> : <p>Loading....</p>;
}