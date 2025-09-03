import TaskManager from "@/app/components/apps/kanban/TaskManager";
import BreadcrumbComp from "../../layout/shared/breadcrumb/BreadcrumbComp";
import CardBox from "@/app/components/shared/CardBox";
import { KanbanDataContextProvider } from '@/app/context/kanbancontext/index'
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Kanban App",
};

const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Kanban",
    },
];

function kanban() {
    return (
        <>
            <KanbanDataContextProvider>
                <BreadcrumbComp title="Kanban app" items={BCrumb} />
                <CardBox>
                    <TaskManager />
                </CardBox>
            </KanbanDataContextProvider>
        </>
    )
}
export default kanban
