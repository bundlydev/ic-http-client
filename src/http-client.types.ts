import { ActorMethod } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";

export type QueryConfig = {
    headers?: Record<string, string>;
    params?: Record<string, string>;
}

export type UpdateConfig = {
    headers?: Record<string, string>;
    params?: Record<string, string>;
}

export type GetConfig = {
    headers?: Record<string, string>;
    params?: Record<string, string>;
}

export type PostConfig = {
    headers?: Record<string, string>;
    params?: Record<string, string>;
}

export type PutConfig = {
    headers?: Record<string, string>;
    params?: Record<string, string>;
}

export type DeleteData = {
    headers?: Record<string, string>;
    params?: Record<string, string>;
}

export type HttpResponse = {
    headers: Record<string, string>;
    body?: any;
    statusCode: number;
}

export interface REST_ACTOR_SERVICE {
    http_request: ActorMethod<
        [
            {
                url: string,
                method: string,
                body: Uint8Array | number[],
                headers: [string, string][],
                certificate_version: [] | [number],
            },
        ],
        {
            body: Uint8Array | number[],
            headers: [string, string][],
            upgrade: [] | [boolean],
            streaming_strategy: [] | [
                {
                    Callback: {
                        token: { arbitrary_data: string },
                        callback: [Principal, string],
                    }
                }
            ],
            status_code: number,
        }
    >,
    http_request_update: ActorMethod<
        [
            {
                url: string,
                method: string,
                body: Uint8Array | number[],
                headers: [string, string][],
                certificate_version: [] | [number],
            },
        ],
        {
            body: Uint8Array | number[],
            headers: [string, string][],
            upgrade: [] | [boolean],
            streaming_strategy: [] | [
                {
                    Callback: {
                        token: { arbitrary_data: string },
                        callback: [Principal, string],
                    }
                }
            ],
            status_code: number,
        }
    >
}
