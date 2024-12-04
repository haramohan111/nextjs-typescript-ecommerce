import { Metadata } from "next";
import ManageListSubcategory from "@/components/Listsubcategory/ManageListSubcategory";

export const metadata: Metadata = {
    title: "Next.js Tables | TailAdmin - Next.js Dashboard Template",
    description:
        "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const ManageListSubCategoryPage = () => {
    return (
        <>
            <ManageListSubcategory />
        </>
    );
};

export default ManageListSubCategoryPage;
