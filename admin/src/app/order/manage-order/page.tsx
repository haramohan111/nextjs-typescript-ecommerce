import { Metadata } from "next";
import ManageOrder from "@/components/Order/ManageOrder";

export const metadata: Metadata = {
    title: "Next.js Tables | TailAdmin - Next.js Dashboard Template",
    description:
        "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const ManageOrderPage = () => {
    return (
        <>
            <ManageOrder />
        </>
    );
};

export default ManageOrderPage;
