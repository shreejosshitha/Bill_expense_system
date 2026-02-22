import { RouterProvider } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
function App() {
  return <AuthProvider>
      <DataProvider>
        <RouterProvider router={router} />
        <Toaster />
      </DataProvider>
    </AuthProvider>;
}
export {
  App as default
};
