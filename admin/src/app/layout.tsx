"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import { Providers } from "../redux/Providers";

import { ToastContainer} from 'react-toastify';
import 'react-toastify/ReactToastify.min.css';



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);



  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en">
       <Providers>
      <body suppressHydrationWarning={true}>
      <ToastContainer />
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          
          {loading ? <Loader /> : children}
        </div>
      </body>
      </Providers>
    </html>
  );
}
