import { Metadata } from "next";
import AddProduct from "@/components/Product/AddProduct";

export const metadata: Metadata = {
  title: "Add Product | Dashboard Template",
  description:
    "This is Next.js Form Layout page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const AddProductPage = () => {

  return (
    <>
      <AddProduct />
    </>
  );
};

export default AddProductPage;
