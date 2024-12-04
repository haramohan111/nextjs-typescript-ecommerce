"use client"
import Footer from "@/components/Footer";
import Header from "../components/Header"
import TopMenu from "../components/TopMenu"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DefaultLayout = ({ children }) => {

  return (
    <>
      <ToastContainer />
      <Header />
      <TopMenu />
      {children}
      <Footer />
    </>
  )
}

export default DefaultLayout