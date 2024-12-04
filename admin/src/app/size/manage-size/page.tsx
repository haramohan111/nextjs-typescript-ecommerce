import { Metadata } from "next";
import ManageSize from "@/components/Size/ManageSize";

export const metadata: Metadata = {
    title: "Next.js Tables | TailAdmin - Next.js Dashboard Template",
    description:
        "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const ManageOrderPage = () => {
    return (
        <>
            <ManageSize />
        </>
    );
};

export default ManageOrderPage;
