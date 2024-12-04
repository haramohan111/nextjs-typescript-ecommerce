import { Metadata } from "next";
import ManageColor from "@/components/Color/ManageColor";
import ManageBrand from "@/components/Brand/ManageBrand";

export const metadata: Metadata = {
    title: "Manage Color | Dashboard",
    description:
        "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const ManageBrandPage = () => {
    return (
        <>
            <ManageBrand />
        </>
    );
};

export default ManageBrandPage;
