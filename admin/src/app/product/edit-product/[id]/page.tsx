import { Metadata } from "next";
import EditProduct from "@/components/Product/EditProduct";

export const metadata: Metadata = {
  title: "Edit Category | Dashboard Template",
  description:
    "This is Next.js Form Layout page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const EditProductPage = () => {

  return (
    <>
      <EditProduct />
    </>
  );
};

export default EditProductPage;
