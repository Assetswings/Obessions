import useNetworkStatus from "./useNetworkStatus";
import NoInternet from "../components/Otherpage/NoInternet";

export default function OfflineGuard({ children }) {
  const isOnline = useNetworkStatus();

  if (!isOnline) {
    return <NoInternet />;
  }

  return children;
}
