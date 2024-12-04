import { Metadata } from "next";
import AddSubCategory from "@/components/SubCategory/AddSubcategory";

export const metadata: Metadata = {
  title: "Add Category | Dashboard Template",
  description:
    "Category page for add category",
};

const AddCategoryPage = () => {

  return (
    <>
      <AddSubCategory />
    </>
  );
};

export default AddCategoryPage;
