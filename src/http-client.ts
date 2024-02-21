import { Actor, ActorConfig, ActorSubclass, HttpAgent, HttpAgentOptions, Identity } from "@dfinity/agent";

import { idlFactory } from "api-rest.did";
import { QueryConfig, UpdateConfig, HttpResponse, GetConfig, PostConfig, PutConfig, DeleteData, REST_ACTOR_SERVICE } from "./http-client.types";
import { parseBodyRequest, parseHeadersRequest } from "./request-parsers";
import { parseBodyResponse, parseHeadersResponse } from "./response-parsers";

export type HttpClientConfig = {
    identity?: Identity;
    agentOptions?: Omit<HttpAgentOptions, "host" | "identity">;
    actorOptions?: Omit<ActorConfig, "canisterId">;
};

export class HttpClient {
    private agent: HttpAgent;
    private actor: ActorSubclass<REST_ACTOR_SERVICE>;

    constructor(private readonly baseUrl: string, private readonly options?: HttpClientConfig) {
        const hostUrl = this.getHostUrl(this.baseUrl);
        const canisterId = this.extractId(this.baseUrl);

        this.agent = new HttpAgent({
            host: hostUrl,
            identity: this.options?.identity,
            ...(this.options?.agentOptions || {})
        });

        // TODO: do this only for develoment environment
        this.agent.fetchRootKey();

        this.actor = Actor.createActor(idlFactory, {
            agent: this.agent,
            canisterId,
            ...(options?.actorOptions ?? {})
        });
    }

    private extractId(url: string): string {
        var pattern = /(?:https?:\/\/)([^\/.]+)\./;
        var match = url.match(pattern);
        if (match) {
            return match[1];
        } else {
            throw new Error("Invalid URL");
        }
    }

    private getHostUrl(url: string): string {
        const textToReplace = `${this.extractId(url)}.`;
        const hostUrl = new URL(url.replace(textToReplace, "")).href;
        return hostUrl;
    }

    public replaceIdentity(identity: Identity) {
        this.agent.replaceIdentity(identity);
    }

    public async query(url: string, config?: QueryConfig): Promise<HttpResponse> {
        const queryParams = config?.params ? `?${new URLSearchParams(config.params).toString()}` : "";
        const result = await this.actor.http_request({
            url: `${url}${queryParams}`,
            method: "GET",
            body: [],
            headers: config?.headers ? parseHeadersRequest(config.headers) : [],
            certificate_version: []
        });

        if (result.status_code >= 400) {
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

        if (result.status_code >= 400) {
            const error = {
                statusCode: result.status_code
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
