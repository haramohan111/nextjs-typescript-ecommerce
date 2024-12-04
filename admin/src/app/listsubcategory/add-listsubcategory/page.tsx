import { Metadata } from "next";
import AddListSubcategory from "@/components/Listsubcategory/AddListSubcategory";

export const metadata: Metadata = {
  title: "Add ListSubCategory | Dashboard Template",
  description:
    "ListSubCategory page",
};

const AddCategoryPage = () => {

  return (
    <>
      <AddListSubcategory />
    </>
  );
};

export default AddCategoryPage;
