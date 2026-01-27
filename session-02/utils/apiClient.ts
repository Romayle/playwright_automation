import { APIRequestContext, expect } from '@playwright/test';

export class ApiClient {
  constructor(
    private request: APIRequestContext,
    private baseUrl: string
) {}

  async get(path: string) {
    return this.request.get(`${this.baseUrl}${path}`);
  }

  async post(path: string, data: any) {
    return this.request.post(`${this.baseUrl}${path}`, { data });
  }

  async put(path: string, data: any) {
    return this.request.put(`${this.baseUrl}${path}`, { data });
  }

  async delete(path: string) {
    return this.request.delete(`${this.baseUrl}${path}`);
  }
}
