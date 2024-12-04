import { Metadata } from "next";
import AddSeller from "@/components/Seller/AddSeller";

export const metadata: Metadata = {
  title: "Add Product | Dashboard Template",
  description:
    "This is Next.js Form Layout page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const AddSellerPage = () => {

  return (
    <>
      <AddSeller/>
    </>
  );
};

export default AddSellerPage;
