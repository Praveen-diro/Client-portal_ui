import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { env } from "@/app/config/environment";
import {
  twoFactorLogin as twoFactorLoginAction,
  twoFactorLoginSuccess,
  twoFactorLoginFailure,
  sendLoginOtp as sendLoginOtpAction,
  sendLoginOtpSuccess,
  sendLoginOtpFailure,
} from "./authSlice";

export const twoFactorLogin = createAsyncThunk(
  "auth/twoFactorLogin",
  async (
    { email, otp, twoFactorId, sandboxStatus }: { email: string; otp: string; twoFactorId: string; sandboxStatus: boolean },
    { dispatch }
  ) => {
    try {
      dispatch(twoFactorLoginAction({ email, otp, twoFactorId, sandboxStatus }));

      const response = await axios.post(
        env.twoFactorLogin,
        { email, otp, twoFactorId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        dispatch(twoFactorLoginSuccess(response.data));
        return response.data;
      } else {
        dispatch(twoFactorLoginFailure(response.data.message || "Verification failed"));
        throw new Error(response.data.message || "Verification failed");
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "An error occurred";
      dispatch(twoFactorLoginFailure(message));
      throw error;
    }
  }
);

export const sendLoginOtp = createAsyncThunk(
  "auth/sendLoginOtp",
  async ({ twoFactorId, methodId }: { twoFactorId: string; methodId: string }, { dispatch }) => {
    try {
      dispatch(sendLoginOtpAction({ twoFactorId, methodId }));

      const response = await axios.post(
        env.sendLoginOtp,
        { twoFactorId, methodId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        dispatch(sendLoginOtpSuccess());
        return response.data;
      } else {
        dispatch(sendLoginOtpFailure(response.data.message || "Failed to send OTP"));
        throw new Error(response.data.message || "Failed to send OTP");
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "An error occurred";
      dispatch(sendLoginOtpFailure(message));
      throw error;
    }
  }
);
