import { Metadata } from "next";
import AddColor from "@/components/Color/AddColor";

export const metadata: Metadata = {
  title: "Add Color | Dashboard Template",
  description:
    "ListSubCategory page",
};

const AddColorPage = () => {

  return (
    <>
      <AddColor />
    </>
  );
};

export default AddColorPage;
