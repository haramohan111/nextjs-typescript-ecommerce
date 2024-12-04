import { Metadata } from "next";
import AddBrand from "@/components/Brand/AddBrand";

export const metadata: Metadata = {
  title: "Add Product | Dashboard Template",
  description:
    "This is Next.js Form Layout page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const AddBrandPage = () => {

  return (
    <>
      <AddBrand />
    </>
  );
};

export default AddBrandPage;
