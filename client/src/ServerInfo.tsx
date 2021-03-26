import React from 'react';

interface ServerInfo {
  apiURL: string;
}
export type { ServerInfo };
export const ServerInfoContext = React.createContext<ServerInfo>({ apiURL: "" });
