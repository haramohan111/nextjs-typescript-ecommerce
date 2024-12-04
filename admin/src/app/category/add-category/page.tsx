import { Metadata } from "next";
import AddCategory from "@/components/Category/AddCategory";

export const metadata: Metadata = {
  title: "Add Category | Dashboard Template",
  description:
    "This is Next.js Form Layout page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const AddCategoryPage = () => {

  return (
    <>
      <AddCategory />
    </>
  );
};

export default AddCategoryPage;
