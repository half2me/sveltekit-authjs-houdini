export const validFor = (expiresAt: number) => Math.ceil(expiresAt - new Date().getTime());
