import { useContext } from "react";
import { AppContext } from "../contexts/app.context";

const useApp = () => useContext(AppContext);
export { useApp };
