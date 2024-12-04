import { Metadata } from "next";
import ManageProduct from "@/components/Product/ManageProduct";

export const metadata: Metadata = {
  title: "Add Product | Dashboard Template",
  description:
    "This is Next.js Form Layout page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const ManageProductPage = () => {

  return (
    <>
      <ManageProduct />
    </>
  );
};

export default ManageProductPage;
