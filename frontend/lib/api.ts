"use client";

import Cookies from "js-cookie";
import router from "next/router";

const API_URL = process.env.apiUrl;

export interface LoginCredentials {
  username: string;
  pass: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface User {
  id: string;
  name: string;
}

export interface EventPayload {
  type: "deposit" | "withdraw" | "transfer";
  amount: number;
  origin?: string;
  destination?: string;
}

export const getAuthToken = () => {
  return Cookies.get("auth_token");
};

export async function login(
  credentials: LoginCredentials
): Promise<ApiResponse<{ token: string; user: User }>> {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message || "Failed to login" };
    }

    return { data: await response.json() };
  } catch (error) {
    return { error: "Network error occurred" };
  }
}

export async function getBalance(
  accountId: string
): Promise<ApiResponse<number>> {
  try {
    const token = getAuthToken();

    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(
      `${API_URL}/accounts/balance?account_id=${accountId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();

      await createEvent({
        type: "deposit",
        amount: 0,
        destination: process.env.clientId!,
      });

      return { error: error.message || "Failed to fetch balance" };
    }

    return { data: await response.json() };
  } catch (error) {
    return { error: "Network error occurred" };
  }
}

export async function createEvent(
  payload: EventPayload
): Promise<ApiResponse<{ success: boolean }>> {
  try {
    const token = getAuthToken();

    if (!token) {
      return { error: "Not authenticated" };
    }

    const response = await fetch(`${API_URL}/accounts/event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message || "Failed to process transaction" };
    }

    return { data: await response.json() };
  } catch (error) {
    return { error: "Network error occurred" };
  }
}
