import { Metadata } from "next";
import ECommerce from "@/components/Dashboard/E-commerce";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
    title: "Dashboard",
    description:
        "Dashboard Template",
};

const Dashboard = () => {
    return (
        <>
            <DefaultLayout>
                <ECommerce />
            </DefaultLayout>
        </>
    );
};

export default Dashboard;
