import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './context/AuthContext';
import { useEffect } from "react";
import { App as CapacitorApp } from "@capacitor/app";


export default function App() {
  useEffect(() => {
    const listener = CapacitorApp.addListener(
      "appUrlOpen",
      ({ url }) => {
        console.log("Opened with URL:", url);

        if (url.startsWith("traceproduct://wallet")) {
          console.log("Returned from wallet");
        }
      }
    );

    return () => {
      listener.then((handle) => handle.remove());
    };
  }, []);


  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}