
// Mock API endpoint to add a new category

import { KanbanData } from "@/app/components/apps/kanban/kanbanData";
import { NextResponse } from "next/server";



export async function POST(req:any){
    try{
        const { categoryName } = await req.json();
        const newCategory = {
          id: Math.random(),
          name: categoryName,
          child: [],
        };
        KanbanData.push(newCategory);
        return NextResponse.json({status:200, msg:"success" , data:newCategory});
    }catch(error){
       return NextResponse.json({status:400 , msg:"failed" , error})
    }
}
