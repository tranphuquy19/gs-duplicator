import axios from "axios";

import { gitlabApiUrl } from "@/config";
import { HttpMethods } from "@/types";
import { HeaderHelper } from "./header-helper";

export function HttpClient(endpoint: string, method = HttpMethods.GET, body: any, options?: { token: string | undefined, url?: string, isBearerToken?: boolean }): Promise<any> {
	return axios({
		url: options?.url ? options.url : `${gitlabApiUrl}/${endpoint}`,
		method,
		headers: HeaderHelper(options),
		data: body,
		params: method === HttpMethods.GET ? body : undefined,
	});
}
