import { Metadata } from "next";
import ManageCategory from "@/components/Category/ManageCategory";

export const metadata: Metadata = {
    title: "Next.js Tables | TailAdmin - Next.js Dashboard Template",
    description:
        "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const ManageCategoryPage = () => {
    return (
        <>
            <ManageCategory />
        </>
    );
};

export default ManageCategoryPage;
