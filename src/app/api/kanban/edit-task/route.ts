import { KanbanData } from "@/app/components/apps/kanban/kanbanData";
import { NextResponse } from "next/server";


export async function PATCH(req:any){
    try{
      const { taskId, newData } = await req.json();
      KanbanData.forEach((category) => {
        category.child.forEach((task) => {
          if (task.id === taskId) {
            Object.assign(task, newData);
          }
        });
      });
      return NextResponse.json({status:200,msg:"success",data:KanbanData})
    }catch(error){
      return NextResponse.json({status:400,msg:"Internal server error",error})
    }
  }