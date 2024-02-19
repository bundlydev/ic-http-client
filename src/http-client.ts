import { ActorSubclass } from "@dfinity/agent";

import { parseBodyRequest, parseHeadersRequest } from './request-parsers';
import { parseBodyResponse, parseHeadersResponse } from './response-parsers';
import { REST_ACTOR_SERVICE, QueryConfig, UpdateConfig, HttpResponse, GetConfig, PostConfig, PutConfig, DeleteData } from "./http-client.types";

export class HttpClient {
    constructor(private actor: ActorSubclass<REST_ACTOR_SERVICE>) { }

    public async query(url: string, config?: QueryConfig): Promise<HttpResponse> {
        const queryParams = config?.params ? `?${new URLSearchParams(config.params).toString()}` : "";
        const result = await this.actor.http_request({
            url: `${url}${queryParams}`,
            method: "GET",
            body: [],
            headers: config?.headers ? parseHeadersRequest(config.headers) : [],
            certificate_version: []
        });

        if (result.status_code > 400) {
            const error = {
                statusCode: result.status_code,
            }

            throw error;
        }

        const json = {
            headers: parseHeadersResponse(result.headers),
            body: parseBodyResponse(result.body),
            statusCode: result.status_code,
        }

        return json;
    }

    public async update(url: string, method: string, data?: any, config?: UpdateConfig): Promise<HttpResponse> {
        const queryParams = config?.params ? `?${new URLSearchParams(config.params).toString()}` : "";
        const body = data ? parseBodyRequest(data) : [];
        const customHeaders: [string, string][] = config?.headers ? parseHeadersRequest(config.headers) : [];
        const headers: [string, string][] = [
            ["Content-Length", `${body?.length ?? 0}`],
            ...customHeaders
        ];

        const result = await this.actor.http_request_update({
            url: `${url}${queryParams}`,
            method,
            body: data ? parseBodyRequest(data) : [],
            headers,
            certificate_version: []
        });

        if (result.status_code > 400) {
            const error = {
                statusCode: result.status_code,
            }

            throw error;
        }

        const json = {
            headers: parseHeadersResponse(result.headers),
            body: parseBodyResponse(result.body),
            statusCode: result.status_code,
        }

        return json;
    }

    public async get(url: string, config?: GetConfig): Promise<HttpResponse> {
        return this.query(url, config);
    }

    public async post(url: string, data?: any, config?: PostConfig): Promise<HttpResponse> {
        return this.update(url, "POST", data, config);
    }

    public async put(url: string, data?: any, config?: PutConfig): Promise<HttpResponse> {
        return this.update(url, "PUT", data, config);
    }

    public async delete(url: string, config?: DeleteData): Promise<HttpResponse> {
        return this.update(url, "DELETE", {}, config);
    }
}
