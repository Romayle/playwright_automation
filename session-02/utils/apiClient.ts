import { APIRequestContext, expect } from '@playwright/test';

export class ApiClient {
  constructor(
    private request: APIRequestContext,
    private baseUrl: string
) {}

  async get(path: string) {
    return await this.request.get(`${this.baseUrl}${path}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (GitHub Actions CI)",
        "Accept": "application/json"
      }
    });
  }

  async post(path: string, data: any) {
    return await this.request.post(`${this.baseUrl}${path}`, {
      data, headers: {
        "User-Agent": "Mozilla/5.0 (GitHub Actions CI)",
        "Accept": "application/json"
      }
    });
  }

  async put(path: string, data: any) {
    return await this.request.put(`${this.baseUrl}${path}`, {
      data, headers: {
        "User-Agent": "Mozilla/5.0 (GitHub Actions CI)",
        "Accept": "application/json"
      }
    });
  }

  async delete(path: string) {
    return await this.request.delete(`${this.baseUrl}${path}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (GitHub Actions CI)",
        "Accept": "application/json"
      }
    });
  }
}
