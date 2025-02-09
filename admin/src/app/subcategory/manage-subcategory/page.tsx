import { Metadata } from "next";
import ManageSubCategory from "@/components/SubCategory/ManageSubcategory";

export const metadata: Metadata = {
    title: "Next.js Tables | TailAdmin - Next.js Dashboard Template",
    description:
        "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const ManageSubCategoryPage = () => {
    return (
        <>
            <ManageSubCategory />
        </>
    );
};

export default ManageSubCategoryPage;
