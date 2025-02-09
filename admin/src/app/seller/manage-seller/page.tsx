import { Metadata } from "next";
import ManageOrder from "@/components/Order/ManageOrder";
import ManageSeller from "@/components/Seller/ManageSeller";

export const metadata: Metadata = {
    title: "Next.js Tables | TailAdmin - Next.js Dashboard Template",
    description:
        "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const ManageSellerPage = () => {
    return (
        <>
            <ManageSeller />
        </>
    );
};

export default ManageSellerPage;
