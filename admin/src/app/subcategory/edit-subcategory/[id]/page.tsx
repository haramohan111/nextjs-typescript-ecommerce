import { Metadata } from "next";
import EditSubCategory from "@/components/SubCategory/EditSubCategory";

export const metadata: Metadata = {
  title: "Add Category | Dashboard Template",
  description:
    "This is Next.js Form Layout page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const EditCategoryPage = () => {

  return (
    <>
      <EditSubCategory />
    </>
  );
};

export default EditCategoryPage;
