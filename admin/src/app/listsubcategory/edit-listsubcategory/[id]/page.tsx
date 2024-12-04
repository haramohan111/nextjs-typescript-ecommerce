import { Metadata } from "next";
import EditListSubCategory from "@/components/Listsubcategory/EditListSubCategory";

export const metadata: Metadata = {
  title: "Add Category | Dashboard Template",
  description:
    "This is Next.js Form Layout page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const EditCategoryPage = () => {

  return (
    <>
      <EditListSubCategory />
    </>
  );
};

export default EditCategoryPage;
