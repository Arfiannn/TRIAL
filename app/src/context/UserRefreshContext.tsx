import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface UserRefreshContextType {
  refreshKey: number;
  triggerRefresh: () => void;
}

const UserRefreshContext = createContext<UserRefreshContextType | undefined>(undefined);

export const UserRefreshProvider = ({ children }: { children: ReactNode }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => setRefreshKey((prev) => prev + 1);

  return (
    <UserRefreshContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </UserRefreshContext.Provider>
  );
};

export const useUserRefresh = () => {
  const context = useContext(UserRefreshContext);
  if (!context) throw new Error("useUserRefresh must be used within UserRefreshProvider");
  return context;
};
