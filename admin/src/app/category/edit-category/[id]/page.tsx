import { Metadata } from "next";
import EditCategory from "@/components/Category/EditCategory";

export const metadata: Metadata = {
  title: "Add Category | Dashboard Template",
  description:
    "This is Next.js Form Layout page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const EditCategoryPage = () => {

  return (
    <>
      <EditCategory />
    </>
  );
};

export default EditCategoryPage;
