
const HeaderHelper = (options?: { token?: string, isBearerToken?: boolean }): any => {
	return {
		'Content-Type': 'application/json',
		'PRIVATE-TOKEN': options?.token,
		'Authorization': options?.isBearerToken ? `Bearer ${options?.token}` : undefined,
	}
};

export { HeaderHelper };
