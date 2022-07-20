import {
  createContext,
  useContext,
  useMemo,
  useEffect,
  ReactNode,
} from "react";

type WSProviderProps = { children: ReactNode; url: string };

const WSStateContext = createContext<WebSocket | null>(null);

function WSProvider({ children, url }: WSProviderProps): JSX.Element {
  const wsInstance = useMemo(
    () =>
      typeof window != "undefined"
        ? new WebSocket(
            `ws://${
              process.env.NODE_ENV === "development"
                ? "localhost:55556"
                : window.location.host
            }/ws${url}`
          )
        : null,
    [url]
  );

  useEffect(() => {
    return () => {
      wsInstance?.close();
    };
  }, [wsInstance]);

  return (
    <WSStateContext.Provider value={wsInstance}>
      {children}
    </WSStateContext.Provider>
  );
}

function useWS(): WebSocket {
  const context = useContext(WSStateContext);

  if (context == undefined) {
    throw new Error("useWS must be used within a WSProvider");
  }

  return context;
}

export { WSProvider, useWS };
