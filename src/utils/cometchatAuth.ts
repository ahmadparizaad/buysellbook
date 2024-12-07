'use client';

import axios from 'axios';

interface AuthResponse {
  success: boolean;
  authToken: string;
}

export class CometchatAuthService {
  private static instance: CometchatAuthService;
  private isInitialized: boolean = false;

  private constructor() {
    let CometChat: any;
     if (typeof window !== "undefined") {
      CometChat = require("@cometchat/chat-sdk-javascript").CometChat;
      window.CometChat = CometChat;
    }
  }

  public static getInstance(): CometchatAuthService {
    if (!CometchatAuthService.instance) {
      CometchatAuthService.instance = new CometchatAuthService();
    }
    return CometchatAuthService.instance;
  }

  /**
   * Initialize CometChat
   */
  public async initializeCometChat(): Promise<void> {
    if (this.isInitialized) return;

    const appID = process.env.COMETCHAT_APP_ID;
    const region = process.env.COMETCHAT_REGION;

    if (!appID || !region) {
      throw new Error('CometChat credentials are not properly configured');
    }

    try {
      const appSetting = new window.CometChat.AppSettingsBuilder()
        .subscribePresenceForAllUsers()
        .setRegion(region)
        .autoEstablishSocketConnection(true)
        .build();

      await window.CometChat.init(appID, appSetting);
      this.isInitialized = true;
      console.log('CometChat initialization completed successfully');
    } catch (error) {
      console.error('CometChat initialization failed:', error);
      throw error;
    }
  }

  /**
   * Login user to CometChat using auth token
   */
  public async loginWithAuthToken(uid: string): Promise<CometChat.User> {
    try {
      // Ensure CometChat is initialized
      await this.initializeCometChat();

      // First, check if user is already logged in
      const currentUser = await window.CometChat.getLoggedinUser();
      if (currentUser && currentUser.getUid() === uid) {
        console.log('User already logged in');
        return currentUser;
      } else{

      // If not logged in, generate new auth token
      // const response = await fetch(`https://${COMETCHAT_CONSTANTS.APP_ID}.api-${COMETCHAT_CONSTANTS.REGION}.cometchat.io/v3/users/${uid}/auth_tokens`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'appId': COMETCHAT_CONSTANTS.APP_ID,
      //     'apiKey': COMETCHAT_CONSTANTS.AUTH_KEY,
      //     'Accept': 'application/json',
      //   },
      // });

      // const data = await response.json();
      // if (!data.success || !data.authToken) {
      //   throw new Error('Failed to generate auth token', { cause: data });
      // }

      // Login with the generated auth token
      const user = await window.CometChat.login(uid, process.env.COMETCHAT_AUTH_KEY);
      console.log('CometChat login successful:', user);
        return user;
      }

    } catch (error) {
      console.error('CometChat login failed:', error);
      throw error;
    }
  }

  /**
   * Logout from CometChat
   */
  public async logout(): Promise<void> {
    try {
      await window.CometChat.logout();
      console.log('CometChat logout successful');
    } catch (error) {
      console.error('CometChat logout failed:', error);
      throw error;
    }
  }

  /**
   * Check if user is logged in
   */
  public async isLoggedIn(): Promise<boolean> {
    try {
      const user = await window.CometChat.getLoggedinUser();
      return !!user;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get current logged in user
   */
  public async getCurrentUser(): Promise<CometChat.User | null> {
    try {
      return await window.CometChat.getLoggedinUser();
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }
}

// Create a simple interface for common auth operations
export const cometchatAuth = {
  init: async () => {
    return await CometchatAuthService.getInstance().initializeCometChat();
  },
  
  login: async (uid: string) => {
    return await CometchatAuthService.getInstance().loginWithAuthToken(uid);
  },
  
  logout: async () => {
    return await CometchatAuthService.getInstance().logout();
  },
  
  isLoggedIn: async () => {
    return await CometchatAuthService.getInstance().isLoggedIn();
  },
  
  getCurrentUser: async () => {
    return await CometchatAuthService.getInstance().getCurrentUser();
  }
};