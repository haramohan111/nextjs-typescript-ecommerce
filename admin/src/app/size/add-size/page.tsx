import { Metadata } from "next";
import AddSize from "@/components/Size/AddSize";

export const metadata: Metadata = {
  title: "Add Size | Dashboard Template",
  description:
    "This is Next.js Form Layout page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const AddSizePage = () => {

  return (
    <>
      <AddSize />
    </>
  );
};

export default AddSizePage;
