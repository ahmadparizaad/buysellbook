// src/utils/cometchatConfig.ts
import { COMETCHAT_CONSTANTS } from '@/app/chat/const';
import { useEffect } from 'react';

const appID = COMETCHAT_CONSTANTS.APP_ID;
const region = COMETCHAT_CONSTANTS.REGION;

declare global {
  interface Window {
    CometChat: any;
  }
}

export const useInitializeCometChat = () => {
  useEffect(() => {
    let CometChat: any;
    if (typeof window !== "undefined") {
      CometChat = require("@cometchat/chat-sdk-javascript").CometChat;
      window.CometChat = CometChat;

      const appSetting = new window.CometChat.AppSettingsBuilder()
        .subscribePresenceForAllUsers()
        .setRegion(region)
        .autoEstablishSocketConnection(true)
        .build();

      const initializeCometChat = async () => {
        try {
          await window.CometChat.init(appID, appSetting);
          console.log('CometChat initialized successfully');
        } catch (error) {
          console.error('CometChat initialization failed', error);
        }
      };

      initializeCometChat();
    }
  }, []);
};